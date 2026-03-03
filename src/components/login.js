"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage({ text: "Giriş bilgileri hatalı!", type: "error" });
      setPassword('');
      setIsLoading(false);
    } else {
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
        
        {/* noValidate: Tarayıcının "e-posta girin" uyarısını susturur */}
        <form onSubmit={handleSubmit} noValidate>
        <input 
            type="email" 
            inputMode="email" 
            placeholder="E-posta Adresiniz" 
            // .trim() ekleyerek sağdaki-soldaki gizli boşlukları siliyoruz
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())} 
            style={styles.input}
            autoCapitalize="none" // İlk harfi büyük yapmasını engeller
            autoCorrect="off"     // Otomatik düzeltmeyi kapatır
            disabled={isLoading}
            required 
          />

          <input 
            type="password" 
            placeholder="Şifre" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Şifrede boşluk olabilir, trim yapmıyoruz
            style={styles.input}
            autoCapitalize="none"
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
  input: { 
    width: '100%', 
    padding: '12px', 
    margin: '12px 0', 
    border: '1px solid #334155', 
    borderRadius: '8px', 
    backgroundColor: '#1e293b', 
    color: 'white', 
    fontSize: '14px', 
    outline: 'none',
    boxSizing: 'border-box' // Mobilde taşmaları önlemek için eklendi
  },
  button: { 
    width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', 
    cursor: 'pointer', fontSize: '16px', fontWeight: '600', marginTop: '10px',
    display: 'flex', justifyContent: 'center', alignItems: 'center' 
  }
};