"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
// 1. SUPABASE BAĞLANTISINI İÇERİ AKTARIYORUZ
// (Dosya yolu senin klasör yapına göre '../lib/supabaseClient' veya '@/lib/supabaseClient' olabilir)
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  // Supabase Auth e-posta kullandığı için username yerine email state'i kullanıyoruz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => { // async ekledik çünkü Supabase'den cevap bekleyeceğiz
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' }); // Eski mesajları temizle

    // 2. SUPABASE İLE GİRİŞ İŞLEMİ
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Şifre veya E-posta yanlışsa Supabase bize 'error' döndürür
      setMessage({ text: "E-posta veya şifre hatalı!", type: "error" });
      setPassword(''); // Güvenlik için şifre kutusunu temizle
      setIsLoading(false);
    } else {
      // Başarılı giriş
      setMessage({ text: "Giriş başarılı! Yönlendiriliyorsunuz...", type: "success" });
      setTimeout(() => {
        router.push('/anasayfa'); 
      }, 1500);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <img src="/NÖ.png" alt="Logo" style={styles.logo} />
        </div>
        
        <form onSubmit={handleSubmit}>
         <input 
            type="text" // 'email' yerine 'text' yaptık
            inputMode="email" // Klavyede @ işaretini yine gösterir ama zorunlu tutmaz
            placeholder="E-posta veya Kullanıcı Adı" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading}
            required 
          />
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "Giriş Yap"}
          </button>
        </form>

        {message.text && (
          <p style={{ 
            marginTop: '15px', 
            fontWeight: '500',
            color: message.type === 'success' ? '#4ade80' : '#f87171' 
          }}>
            {message.text}
          </p>
        )}
      </div>

      <style jsx>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' },
  card: { background: '#000000', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '350px', textAlign: 'center', border: '1px solid #1e293b' },
  logoWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '25px' },
  logo: { width: '100px', height: 'auto', display: 'block' },
  input: { width: '100%', padding: '12px', margin: '12px 0', border: '1px solid #334155', borderRadius: '8px', backgroundColor: '#1e293b', color: 'white', fontSize: '14px', outline: 'none' },
  button: { 
    width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', 
    cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginTop: '10px',
    display: 'flex', justifyContent: 'center', alignItems: 'center' 
  }
};