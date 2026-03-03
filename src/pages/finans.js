import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// SUPABASE BAĞLANTISI
import { supabase } from '@/lib/supabaseClient';

export default function Butce() {
  const router = useRouter();
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '🍔 Yemek' });
  const [activeUser, setActiveUser] = useState('Özgür');
  const [loading, setLoading] = useState(true);

  // --- KULLANICI DEĞİŞTİĞİNDE VERİLERİ ÇEK ---
  useEffect(() => {
    fetchData();
  }, [activeUser]);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Geliri Çek
    const { data: budgetData } = await supabase
      .from('budgets')
      .select('income')
      .eq('owner', activeUser)
      .single();
      
    setIncome(budgetData ? budgetData.income : 0);

    // 2. Harcamaları Çek
    const { data: expensesData } = await supabase
      .from('expenses')
      .select('*')
      .eq('owner', activeUser)
      .order('created_at', { ascending: false });

    setExpenses(expensesData || []);
    setLoading(false);
  };

  // --- GELİRİ BULUTA KAYDET (Input'tan çıkıldığında çalışır) ---
  const saveIncomeToCloud = async () => {
    await supabase
      .from('budgets')
      .upsert({ owner: activeUser, income: Number(income) }); // Varsa günceller, yoksa ekler
  };

  // --- YENİ HARCAMA EKLE ---
  const addExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    const expenseToAdd = {
      title: newExpense.title,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      owner: activeUser
    };

    // UI'ı hemen güncelle (Kullanıcı beklediğini hissetmesin)
    const optimisticExpense = { ...expenseToAdd, id: Date.now() };
    setExpenses([optimisticExpense, ...expenses]);

    // Supabase'e gönder
    const { error } = await supabase.from('expenses').insert([expenseToAdd]);
    
    if (error) {
      alert("Hata oluştu: " + error.message);
      fetchData(); // Hata varsa eski listeye dön
    } else {
      fetchData(); // Başarılıysa gerçek ID'leri almak için listeyi tazele
    }

    setNewExpense({ title: '', amount: '', category: '🍔 Yemek' });
  };

  // --- HARCAMA SİL ---
  const deleteExpense = async (id) => {
    // UI'dan hemen sil
    setExpenses(expenses.filter(ex => ex.id !== id));

    // Veritabanından sil
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) fetchData(); // Hata varsa geri getir
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remaining = income - totalSpent;

  return (
    <div className="budget-wrapper">
      <Head>
        <title>Bütçe | {activeUser}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <nav className="glass-nav">
        <div className="nav-container">
          <button className="back-home" onClick={() => router.push('/anasayfa')}>
            ← <span>Ana Sayfa</span>
          </button>
          
          <div className="user-selector">
            <button className={activeUser === 'Özgür' ? 'active' : ''} onClick={() => setActiveUser('Özgür')}>Özgür</button>
            <button className={activeUser === 'Nisa' ? 'active' : ''} onClick={() => setActiveUser('Nisa')}>Nisa</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="balance-hero">
          <span className="label">Kalan Kullanılabilir Bütçe</span>
          <h1 className={remaining < 0 ? 'negative' : ''}>{remaining.toLocaleString('tr-TR')} ₺</h1>
          <div className="mini-stats">
            <div className="stat">
              <span>Aylık Gelir</span>
              <input 
                type="number" 
                value={income} 
                onChange={(e) => setIncome(e.target.value)} 
                onBlur={saveIncomeToCloud} // Kutudan çıkıldığında buluta kaydeder
              />
            </div>
            <div className="stat">
              <span>Toplam Harcama</span>
              <strong>{totalSpent.toLocaleString('tr-TR')} ₺</strong>
            </div>
          </div>
        </div>

        <section className="action-section">
          <div className="glass-card form-box">
            <h3>Harcama Ekle</h3>
            <form onSubmit={addExpense}>
              <input 
                placeholder="Nereye harcadın?" 
                value={newExpense.title}
                onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
              />
              <div className="row">
                <input 
                  type="number" 
                  placeholder="Miktar" 
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                />
                <select 
                  value={newExpense.category} 
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option>🍔 Yemek</option>
                  <option>🚗 Yol</option>
                  <option>☕ Kahve</option>
                  <option>🛍️ Mağaza</option>
                  <option>🎸 Diğer</option>
                </select>
              </div>
              <button type="submit">Harcamayı Kaydet</button>
            </form>
          </div>

          <div className="list-box">
            <div className="list-header">
              <h3>Son Harcamalar</h3>
              <span>{loading ? 'Yükleniyor...' : `${expenses.length} İşlem`}</span>
            </div>
            <div className="expense-scroll">
              {loading ? <p className="empty-msg">Veriler çekiliyor...</p> : 
               expenses.length === 0 ? <p className="empty-msg">Henüz veri yok.</p> : 
                expenses.map(ex => (
                  <div key={ex.id} className="expense-card">
                    <div className="ex-icon">{ex.category.split(' ')[0]}</div>
                    <div className="ex-details">
                      <strong>{ex.title}</strong>
                      <span>{ex.category.split(' ')[1] || ex.category}</span>
                    </div>
                    <div className="ex-price">
                      <span>-{Number(ex.amount).toLocaleString('tr-TR')} ₺</span>
                      <button onClick={() => deleteExpense(ex.id)}>✕</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        /* Stillerin tamamı aynen korundu */
        .budget-wrapper { min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Inter', -apple-system, sans-serif; padding-bottom: 40px; }
        .glass-nav { position: sticky; top: 0; z-index: 100; padding: 12px 15px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-container { max-width: 600px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 15px; }
        .back-home { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 8px 12px; border-radius: 10px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 5px; transition: 0.2s; }
        .back-home:hover { color: white; border-color: #3b82f6; }
        .user-selector { display: flex; gap: 4px; background: #0f172a; padding: 4px; border-radius: 10px; flex: 1; max-width: 200px; }
        .user-selector button { flex: 1; padding: 6px; border: none; border-radius: 7px; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.85rem; }
        .user-selector button.active { background: #3b82f6; color: white; }
        .main-content { max-width: 600px; margin: 0 auto; padding: 20px; }
        .balance-hero { text-align: center; padding: 40px 20px; background: linear-gradient(180deg, #1e293b 0%, transparent 100%); border-radius: 30px; margin-bottom: 20px; }
        .balance-hero h1 { font-size: 3rem; margin: 10px 0; font-weight: 800; letter-spacing: -2px; }
        .balance-hero h1.negative { color: #f87171; }
        .label { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
        .mini-stats { display: flex; justify-content: center; gap: 40px; margin-top: 20px; }
        .stat span { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 4px; }
        .stat input { background: transparent; border: none; border-bottom: 1px dashed #334155; color: #4ade80; font-weight: bold; width: 100px; text-align: center; outline: none; transition: 0.2s; }
        .stat input:focus { border-bottom-color: #4ade80; }
        .stat strong { color: #f87171; }
        .glass-card { background: #1e293b; border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
        .form-box h3 { margin: 0 0 20px 0; font-size: 1.1rem; }
        form { display: flex; flex-direction: column; gap: 12px; }
        form input, form select { background: #0f172a; border: 1px solid #334155; padding: 14px; border-radius: 12px; color: white; outline: none; transition: 0.2s; }
        form input:focus { border-color: #3b82f6; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        form button { background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: 0.2s; }
        form button:hover { background: #2563eb; }
        .list-box { margin-top: 30px; }
        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .list-header span { font-size: 0.8rem; color: #64748b; }
        .expense-card { display: flex; align-items: center; gap: 15px; background: rgba(30, 41, 59, 0.5); padding: 16px; border-radius: 18px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.03); }
        .ex-icon { width: 45px; height: 45px; background: #0f172a; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.2rem; }
        .ex-details { flex: 1; display: flex; flex-direction: column; }
        .ex-details span { font-size: 0.75rem; color: #64748b; }
        .ex-price { text-align: right; display: flex; align-items: center; gap: 10px; }
        .ex-price span { font-weight: 700; color: #f87171; }
        .ex-price button { background: none; border: none; color: #475569; font-size: 1.2rem; cursor: pointer; }
        .ex-price button:hover { color: #f87171; }
        .empty-msg { text-align: center; color: #475569; font-size: 0.9rem; padding: 20px 0; }
        @media (max-width: 480px) { .balance-hero h1 { font-size: 2.2rem; } .main-content { padding: 15px; } .glass-card { padding: 20px; } .back-home span { display: none; } }
      `}</style>
    </div>
  );
}