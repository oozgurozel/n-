import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Planlayici() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState('Özgür');
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });

  // Kullanıcı değiştiğinde o kişiye ait planları yükle
  useEffect(() => {
    const savedEvents = localStorage.getItem(`plans_${activeUser}`);
    setEvents(savedEvents ? JSON.parse(savedEvents) : []);
  }, [activeUser]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = now.toTimeString().slice(0, 5);

    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
      date: newEvent.date || defaultDate,
      time: newEvent.time || defaultTime
    };

    const updatedEvents = [...events, eventToAdd];
    setEvents(updatedEvents);
    localStorage.setItem(`plans_${activeUser}`, JSON.stringify(updatedEvents));
    setNewEvent({ title: '', date: '', time: '' });
  };

  const deleteEvent = (id) => {
    const filtered = events.filter(event => event.id !== id);
    setEvents(filtered);
    localStorage.setItem(`plans_${activeUser}`, JSON.stringify(filtered));
  };

  return (
    <div className="app-container">
      <Head>
        <title>Ajanda | {activeUser}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Modern Üst Menü */}
      <nav className="top-nav">
        <button className="back-circle" onClick={() => router.push('/anasayfa')}>←</button>
        <div className="selector-wrapper">
          <button className={activeUser === 'Özgür' ? 'active' : ''} onClick={() => setActiveUser('Özgür')}>Özgür</button>
          <button className={activeUser === 'Nisa' ? 'active' : ''} onClick={() => setActiveUser('Nisa')}>Nisa</button>
        </div>
        <div style={{width: '40px'}}></div>
      </nav>

      <main className="main-wrapper">
        <header className="hero-section">
          <span className="badge">Kişisel Ajanda</span>
          <h1>Merhaba, {activeUser}</h1>
          <p>Yönetmen gereken <strong>{events.length}</strong> etkinlik var.</p>
        </header>

        <div className="content-layout">
          {/* Giriş Kartı */}
          <section className="glass-card add-box">
            <h3>Yeni Etkinlik</h3>
            <form onSubmit={addEvent}>
              <input 
                className="main-input"
                placeholder="Ne yapacaksın?" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
              <div className="grid-inputs">
                <input 
                  type="date" 
                  max="9999-12-31"
                  value={newEvent.date} 
                  onChange={(e) => {
                    const year = e.target.value.split('-')[0];
                    if (year.length <= 4) setNewEvent({...newEvent, date: e.target.value});
                  }}
                />
                <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} />
              </div>
              <button type="submit" className="add-btn">Listeye Ekle</button>
            </form>
          </section>

          {/* Liste Kartı */}
          <section className="list-container">
            <div className="list-header">
              <h3>Planların</h3>
              <div className="status-dot"></div>
            </div>
            
            <div className="scroll-area">
              {events.length === 0 ? (
                <div className="empty-ui">
                  <span className="icon">📝</span>
                  <p>Henüz bir plan eklenmedi.</p>
                </div>
              ) : (
                events
                  .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
                  .map(event => (
                    <div key={event.id} className="plan-card">
                      <div className="plan-time">
                        <span className="time">{event.time}</span>
                        <div className="line"></div>
                      </div>
                      <div className="plan-content">
                        <h4>{event.title}</h4>
                        <span className="date">📅 {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                      </div>
                      <button onClick={() => deleteEvent(event.id)} className="delete-btn">✕</button>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: #020617;
          color: #f8fafc;
          font-family: 'Inter', -apple-system, sans-serif;
          padding-bottom: 40px;
        }

        .top-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 20px;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(15px);
          position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .back-circle {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid #334155; background: #1e293b;
          color: white; cursor: pointer; transition: 0.2s;
        }

        .selector-wrapper {
          display: flex; gap: 5px; background: #0f172a;
          padding: 4px; border-radius: 14px; border: 1px solid #1e293b;
        }

        .selector-wrapper button {
          padding: 8px 20px; border: none; border-radius: 10px;
          background: transparent; color: #64748b; font-weight: 600;
          cursor: pointer; transition: 0.3s; font-size: 0.9rem;
        }

        .selector-wrapper button.active {
          background: #3b82f6; color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .main-wrapper { max-width: 900px; margin: 0 auto; padding: 40px 20px; }

        .hero-section { margin-bottom: 40px; }
        .hero-section h1 { font-size: 2.5rem; font-weight: 900; margin: 10px 0; letter-spacing: -1.5px; }
        .badge { background: #1e293b; color: #3b82f6; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .hero-section p { color: #94a3b8; font-size: 1.1rem; }

        .content-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; align-items: start; }

        .glass-card {
          background: #0f172a; padding: 30px; border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        form { display: flex; flex-direction: column; gap: 15px; }
        .main-input {
          background: #1e293b; border: 1px solid #334155; padding: 16px;
          border-radius: 14px; color: white; font-size: 1rem; outline: none;
        }
        .grid-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .grid-inputs input {
          background: #1e293b; border: 1px solid #334155; padding: 12px;
          border-radius: 14px; color: white; font-size: 0.9rem; outline: none;
        }

        .add-btn {
          background: #3b82f6; color: white; border: none; padding: 16px;
          border-radius: 14px; font-weight: 700; cursor: pointer;
          transition: 0.2s; margin-top: 10px;
        }

        .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .status-dot { width: 10px; height: 10px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 10px #3b82f6; }

        .plan-card {
          display: flex; align-items: center; gap: 20px;
          background: rgba(30, 41, 59, 0.4); padding: 20px;
          border-radius: 20px; margin-bottom: 12px;
          border: 1px solid rgba(255,255,255,0.03);
          transition: 0.3s;
        }

        .plan-time { display: flex; flex-direction: column; align-items: center; min-width: 50px; }
        .time { font-size: 0.8rem; font-weight: 800; color: #3b82f6; }
        .line { width: 2px; height: 20px; background: #334155; margin-top: 5px; }

        .plan-content { flex: 1; }
        .plan-content h4 { margin: 0 0 5px 0; font-size: 1.1rem; }
        .date { font-size: 0.8rem; color: #64748b; }

        .delete-btn {
          background: transparent; border: none; color: #475569;
          font-size: 1.2rem; cursor: pointer; transition: 0.2s;
        }
        .delete-btn:hover { color: #f87171; }

        .empty-ui { text-align: center; padding: 50px; color: #475569; }
        .empty-ui .icon { font-size: 3rem; display: block; margin-bottom: 10px; }

        @media (max-width: 850px) {
          .content-layout { grid-template-columns: 1fr; }
          .hero-section h1 { font-size: 2rem; }
          .main-wrapper { padding: 20px; }
        }
      `}</style>
    </div>
  );
}