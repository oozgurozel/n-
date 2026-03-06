import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const ROOMS = [
  { id: 'salon', name: 'Salon', icon: '🛋️', color: '#8b5cf6' },
  { id: 'mutfak', name: 'Mutfak', icon: '🍳', color: '#f59e0b' },
  { id: 'yatak_odasi', name: 'Yatak Odası', icon: '🛏️', color: '#ec4899' },
  { id: 'banyo', name: 'Banyo', icon: '🛁', color: '#06b6d4' },
  { id: 'antre', name: 'Antre & Hol', icon: '🚪', color: '#10b981' }
];

// Tek tıkla yüklenecek varsayılan eşyalar
const DEFAULT_ITEMS = [
  { room_id: 'salon', item_name: 'Koltuk Takımı', price: 0 },
  { room_id: 'salon', item_name: 'TV & TV Ünitesi', price: 0 },
  { room_id: 'salon', item_name: 'Yemek Masası ve Sandalyeler', price: 0 },
  { room_id: 'salon', item_name: 'Halı ve Perdeler', price: 0 },
  { room_id: 'mutfak', item_name: 'Buzdolabı', price: 0 },
  { room_id: 'mutfak', item_name: 'Bulaşık Makinesi', price: 0 },
  { room_id: 'mutfak', item_name: 'Fırın & Ocak & Davlumbaz', price: 0 },
  { room_id: 'mutfak', item_name: 'Yemek ve Çatal Bıçak Takımı', price: 0 },
  { room_id: 'mutfak', item_name: 'Küçük Ev Aletleri (Çay/Kahve Mak.)', price: 0 },
  { room_id: 'yatak_odasi', item_name: 'Yatak ve Baza', price: 0 },
  { room_id: 'yatak_odasi', item_name: 'Gardırop', price: 0 },
  { room_id: 'yatak_odasi', item_name: 'Nevresim Takımları', price: 0 },
  { room_id: 'banyo', item_name: 'Çamaşır Makinesi', price: 0 },
  { room_id: 'banyo', item_name: 'Banyo Dolabı & Havlular', price: 0 },
  { room_id: 'antre', item_name: 'Portmanto / Ayakkabılık', price: 0 },
];

export default function AskYuvasi() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  
  // Yeni Eşya Ekleme Formu
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Sayfa açıldığında verileri direkt çek
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('ask_yuvasi').select('*').order('created_at', { ascending: true });
    if (data) setItems(data);
  };

  // --- HESAPLAMALAR ---
  const totalSpent = items.reduce((acc, curr) => curr.is_bought ? acc + Number(curr.price) : acc, 0);
  const globalProgress = items.length === 0 ? 0 : Math.round((items.filter(i => i.is_bought).length / items.length) * 100);

  const getRoomProgress = (roomId) => {
    const roomItems = items.filter(i => i.room_id === roomId);
    if (roomItems.length === 0) return 0;
    return Math.round((roomItems.filter(i => i.is_bought).length / roomItems.length) * 100);
  };

  // --- İŞLEMLER ---
  const loadDefaultItems = async () => {
    await supabase.from('ask_yuvasi').insert(DEFAULT_ITEMS);
    fetchItems();
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItemName) return;
    await supabase.from('ask_yuvasi').insert([{ 
      room_id: activeRoom.id, 
      item_name: newItemName, 
      price: newItemPrice ? Number(newItemPrice) : 0 
    }]);
    setNewItemName('');
    setNewItemPrice('');
    fetchItems();
  };

  const toggleBought = async (item) => {
    const newStatus = !item.is_bought;
    
    // Anında UI güncellemesi (hızlı hissiyat)
    setItems(items.map(i => i.id === item.id ? { ...i, is_bought: newStatus } : i));
    
    await supabase.from('ask_yuvasi')
      .update({ is_bought: newStatus })
      .eq('id', item.id);
  };

  const updatePrice = async (id, newPrice) => {
    await supabase.from('ask_yuvasi').update({ price: Number(newPrice) }).eq('id', id);
    fetchItems();
  };

  const deleteItem = async (id) => {
    if(confirm("Bu eşyayı listeden silmek istiyor musun?")) {
      await supabase.from('ask_yuvasi').delete().eq('id', id);
      fetchItems();
    }
  };

  return (
    <div className="page-wrapper">
      <Head><title>Aşk Yuvası | Evlilik Hazırlığı</title></Head>

      {/* ÜST BAR VE GERİ DÖNÜŞ */}
      <nav className="top-nav">
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>
          <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
        </button>
        <div className="user-badge">
          <strong>Ortak Liste</strong> 🤍
        </div>
      </nav>

      <div className="main-container">
        
        {/* ANA KONTROL PANELİ */}
        <header className="dashboard-header">
          <div className="title-area">
            <h1>🏡 Aşk Yuvası</h1>
            <p>Eksikleri tamamla, yuvayı kur!</p>
          </div>
          
          <div className="global-progress">
            <div className="progress-text">
              <span>Ev Kurulumu</span>
              <span>%{globalProgress}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${globalProgress}%`, background: globalProgress === 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #ec4899)' }}></div>
            </div>
          </div>
        </header>

        {/* ORTAK BÜTÇE PANELİ */}
        {items.length > 0 && (
          <div className="budget-panel">
            <span className="budget-label">Toplam Harcanan</span>
            <h2 className="budget-amount">{totalSpent.toLocaleString('tr-TR')} TL</h2>
            <p className="budget-subtitle">Birlikte, adım adım tamamlıyoruz.</p>
          </div>
        )}

        {/* EŞYA YOKSA ŞABLON YÜKLE */}
        {items.length === 0 && (
          <div className="empty-state">
            <h3>Listeniz şu an bomboş! 📦</h3>
            <p>Eşyaları tek tek eklemek yerine temel ev paketini otomatik yükleyebilirsin.</p>
            <button className="load-default-btn" onClick={loadDefaultItems}>✨ Standart Çeyiz Paketini Yükle</button>
          </div>
        )}

        {/* ODA SEÇİM EKRANI */}
        {!activeRoom && items.length > 0 && (
          <div className="rooms-grid">
            {ROOMS.map(room => {
              const progress = getRoomProgress(room.id);
              const roomItems = items.filter(i => i.room_id === room.id);
              
              return (
                <div key={room.id} className="room-card" onClick={() => setActiveRoom(room)}>
                  <div className="room-icon" style={{ background: `${room.color}20`, color: room.color }}>
                    {room.icon}
                  </div>
                  <div className="room-info">
                    <h3>{room.name}</h3>
                    <p>{roomItems.filter(i => i.is_bought).length} / {roomItems.length} Alındı</p>
                  </div>
                  {/* Dairesel Progress Mini */}
                  <div className="room-progress">
                    <div className="circular-progress" style={{ background: `conic-gradient(${room.color} ${progress * 3.6}deg, #1e293b 0deg)` }}>
                      <div className="inner-circle"><span>%{progress}</span></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ODA İÇİ EŞYA LİSTESİ */}
        {activeRoom && (
          <div className="room-detail fade-in">
            <div className="detail-header" style={{ borderBottomColor: activeRoom.color }}>
              <button className="close-room-btn" onClick={() => setActiveRoom(null)}>← Odalara Dön</button>
              <h2>{activeRoom.icon} {activeRoom.name}</h2>
            </div>

            <div className="items-list">
              {items.filter(i => i.room_id === activeRoom.id).map(item => (
                <div key={item.id} className={`item-row ${item.is_bought ? 'bought' : ''}`}>
                  
                  {/* Checkbox (Özel Tasarım) */}
                  <div className="checkbox-wrapper" onClick={() => toggleBought(item)}>
                    <div className={`custom-checkbox ${item.is_bought ? 'checked' : ''}`}>
                      {item.is_bought && '✓'}
                    </div>
                  </div>

                  <div className="item-details">
                    <span className="item-name">{item.item_name}</span>
                    {/* Fiyat Girişi */}
                    <div className="price-input-wrapper">
                      <input 
                        type="number" 
                        defaultValue={item.price || ''} 
                        placeholder="Fiyat gir..."
                        onBlur={(e) => updatePrice(item.id, e.target.value)}
                        disabled={item.is_bought} // Alındıysa fiyat değiştirilemez
                      />
                      <span>TL</span>
                    </div>
                  </div>

                  {/* Silme Butonu */}
                  <div className="item-actions">
                    <button className="delete-btn" onClick={() => deleteItem(item.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {/* YENİ EŞYA EKLEME FORMU */}
            <form className="add-item-form" onSubmit={addItem}>
              <input 
                type="text" 
                placeholder="Yeni eşya adı..." 
                value={newItemName} 
                onChange={e => setNewItemName(e.target.value)} 
                required 
              />
              <input 
                type="number" 
                placeholder="Tahmini Fiyat" 
                value={newItemPrice} 
                onChange={e => setNewItemPrice(e.target.value)} 
              />
              <button type="submit" style={{ background: activeRoom.color }}>+ Ekle</button>
            </form>
          </div>
        )}

      </div>

      <style jsx>{`
        .page-wrapper { min-height: 100vh; background: #020617; color: white; font-family: 'Inter', sans-serif; padding: 80px 20px 40px 20px; display: flex; justify-content: center; }
        
        /* Navbar */
        .top-nav { position: fixed; top: 0; left: 0; width: 100%; padding: 15px 20px; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(10px); display: flex; justify-content: space-between; align-items: center; z-index: 1000; border-bottom: 1px solid #1e293b; }
        .back-btn { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 8px 15px; border-radius: 10px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #3b82f6; color: white; }
        .user-badge { background: rgba(16, 185, 129, 0.1); padding: 8px 15px; border-radius: 20px; font-size: 0.95rem; color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);}

        .main-container { width: 100%; max-width: 700px; }

        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Başlık ve Genel İlerleme */
        .dashboard-header { text-align: center; margin-bottom: 30px; }
        .title-area h1 { font-size: 2.5rem; margin: 0 0 5px 0; color: #f8fafc; }
        .title-area p { color: #94a3b8; margin: 0 0 20px 0; font-size: 1.1rem; }
        
        .global-progress { background: #0f172a; padding: 20px; border-radius: 16px; border: 1px solid #1e293b; }
        .progress-text { display: flex; justify-content: space-between; font-weight: bold; color: #cbd5e1; margin-bottom: 10px; }
        .progress-bar-bg { width: 100%; height: 12px; background: #1e293b; border-radius: 6px; overflow: hidden; }
        .progress-bar-fill { height: 100%; transition: width 0.5s ease-out, background 0.3s; }

        /* Ortak Bütçe Paneli */
        .budget-panel { background: #0f172a; padding: 30px; border-radius: 20px; border: 1px dashed #3b82f6; margin-bottom: 30px; text-align: center; position: relative; overflow: hidden; }
        .budget-panel::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%); pointer-events: none;}
        .budget-label { color: #94a3b8; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; }
        .budget-amount { color: #fbbf24; font-size: 3rem; font-weight: 900; margin: 10px 0; text-shadow: 0 0 20px rgba(251, 191, 36, 0.2); }
        .budget-subtitle { color: #10b981; font-size: 0.9rem; font-weight: 500; margin: 0; }

        /* Boş Durum */
        .empty-state { text-align: center; background: #0f172a; padding: 40px; border-radius: 20px; border: 1px solid #1e293b; }
        .empty-state h3 { color: #f8fafc; margin-bottom: 10px; }
        .empty-state p { color: #94a3b8; margin-bottom: 25px; }
        .load-default-btn { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 900; font-size: 1.1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.2); }
        .load-default-btn:hover { transform: scale(1.05); }

        /* Odalar Grid */
        .rooms-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
        .room-card { background: #0f172a; border: 1px solid #1e293b; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.3s; }
        .room-card:hover { border-color: #475569; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .room-icon { font-size: 2rem; width: 60px; height: 60px; display: flex; justify-content: center; align-items: center; border-radius: 16px; }
        .room-info { flex: 1; }
        .room-info h3 { margin: 0 0 5px 0; font-size: 1.2rem; color: #f8fafc; }
        .room-info p { margin: 0; color: #64748b; font-size: 0.9rem; }
        
        .circular-progress { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
        .inner-circle { width: 40px; height: 40px; background: #0f172a; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .inner-circle span { font-size: 0.75rem; font-weight: bold; color: #cbd5e1; }

        /* Oda Detayı */
        .room-detail { background: #0f172a; border-radius: 24px; padding: 25px; border: 1px solid #1e293b; }
        .detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid; }
        .detail-header h2 { margin: 0; font-size: 1.5rem; }
        .close-room-btn { background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 8px 15px; border-radius: 10px; font-weight: bold; cursor: pointer; }
        .close-room-btn:hover { background: #1e293b; color: white; }

        .items-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 25px; }
        .item-row { display: flex; align-items: center; gap: 15px; background: #020617; padding: 15px; border-radius: 16px; border: 1px solid #1e293b; transition: 0.3s; }
        .item-row.bought { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3); }
        
        .custom-checkbox { width: 28px; height: 28px; border: 2px solid #475569; border-radius: 8px; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: 0.2s; color: white; font-weight: bold; }
        .custom-checkbox.checked { background: #10b981; border-color: #10b981; }
        
        .item-details { flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .item-name { font-size: 1.1rem; color: #f8fafc; font-weight: 500; transition: 0.2s; }
        .bought .item-name { text-decoration: line-through; color: #64748b; }
        
        .price-input-wrapper { display: flex; align-items: center; gap: 5px; color: #64748b; font-size: 0.9rem; }
        .price-input-wrapper input { background: transparent; border: none; border-bottom: 1px dashed #475569; color: #fbbf24; font-weight: bold; width: 80px; outline: none; padding: 2px 0; font-size: 1rem; }
        .price-input-wrapper input:disabled { border-bottom: none; color: #94a3b8; }
        
        .item-actions { display: flex; align-items: center; gap: 10px; }
        .delete-btn { background: transparent; border: none; filter: grayscale(1); cursor: pointer; transition: 0.2s; font-size: 1.1rem; }
        .delete-btn:hover { filter: grayscale(0); transform: scale(1.1); }

        .add-item-form { display: flex; gap: 10px; background: #020617; padding: 15px; border-radius: 16px; border: 1px dashed #334155;}
        .add-item-form input { flex: 2; background: #0f172a; border: 1px solid #1e293b; color: white; padding: 12px; border-radius: 10px; outline: none; }
        .add-item-form input[type="number"] { flex: 1; }
        .add-item-form button { color: white; border: none; padding: 0 20px; border-radius: 10px; font-weight: bold; cursor: pointer; }

        @media (max-width: 600px) {
          .hide-mobile { display: none; }
          .rooms-grid { grid-template-columns: 1fr; }
          .add-item-form { flex-direction: column; }
          .add-item-form button { padding: 15px; }
        }
      `}</style>
    </div>
  );
}