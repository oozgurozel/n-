import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import jsPDF from 'jspdf'; 

// EĞİTİMLER İNTERAKTİF ADIMLARA BÖLÜNDÜ
const COURSES = [
  {
    id: 'yazilim-101',
    title: 'Sıfırdan Yazılıma Giriş 💻',
    category: 'Yazılım',
    description: 'HTML, CSS ve JS nedir? İnteraktif slaytlarla öğrenin.',
    steps: [
      { icon: '🦴', title: 'Adım 1: HTML (İskelet)', content: 'Bir web sitesinin kemikleridir. Tıpkı bir inşaatın temeli gibi, sayfadaki tüm yazılar, resimler ve butonlar HTML ile iskelet olarak yerleştirilir.' },
      { icon: '🎨', title: 'Adım 2: CSS (Makyaj)', content: 'Sadece iskelet yeter mi? Hayır! Sayfayı güzelleştiren, renklendiren ve hizalayan kısım CSS\'tir. Sayfanın kıyafeti ve makyajıdır.' },
      { icon: '⚙️', title: 'Adım 3: JavaScript (Motor)', content: 'İskeleti kurduk, boyadık. Şimdi hareket lazım! "Butona basınca şu sekme açılsın" mantığı, yani sayfanın beyni ve kas gücü JavaScript ile yazılır.' }
    ],
    questions: [
      { q: "Bir web sitesinin 'iskeletini' oluşturan dil hangisidir?", options: ["CSS", "JavaScript", "HTML", "Python"], answer: "HTML" },
      { q: "Sayfadaki butonları renklendirmek için hangisi kullanılır?", options: ["CSS", "HTML", "C++", "JavaScript"], answer: "CSS" },
      { q: "Araba örneğini düşünürsek, JavaScript web sitesinin neresidir?", options: ["Boyası", "Kasası", "Tekerleği", "Motoru"], answer: "Motoru" }
    ]
  },
  {
    id: 'iletisim-101',
    title: 'Etkili İletişim Sanatı 🗣️',
    category: 'Kişisel Gelişim',
    description: 'Kelimelerin gücünü keşfedin ve karşınızdakini daha iyi anlayın.',
    steps: [
      { icon: '👂', title: 'Adım 1: Aktif Dinleme', content: 'İletişim sadece konuşmak değildir! Çoğu insan anlamak için değil, cevap vermek için dinler. Aktif dinleme, tüm odağını karşı tarafa vermektir.' },
      { icon: '🕺', title: 'Adım 2: Beden Dili', content: 'Kelimeler iletişimin sadece %7\'sidir! Ses tonu %38, Beden Dili ise %55\'lik devasa bir etkiye sahiptir. Duruşun, sözlerinden daha çok şey anlatır.' },
      { icon: '🤝', title: 'Adım 3: "Ben" Dili Kullanımı', content: 'Suçlayıcı "Sen hep böyle yapıyorsun" demek yerine, "Ben bu duruma üzülüyorum" demek krizleri çözer. Odak noktası karşı taraf değil, kendi hislerin olmalıdır.' }
    ],
    questions: [
      { q: "İletişimde en büyük etkiye sahip olan unsur hangisidir?", options: ["Kelimeler", "Beden Dili", "Ses Tonu", "Yazılı Mesaj"], answer: "Beden Dili" },
      { q: "Cevap vermek için değil, anlamak için dinlemeye ne ad verilir?", options: ["Pasif Dinleme", "Seçici Dinleme", "Aktif Dinleme", "Duymazdan Gelme"], answer: "Aktif Dinleme" },
      { q: "Suçlayıcı 'Sen' dili yerine hangisini kullanmak iletişimi güçlendirir?", options: ["'O' Dili", "Sessizlik", "Emir Kipleri", "'Ben' Dili"], answer: "'Ben' Dili" }
    ]
  },
  {
    id: 'finans-101',
    title: 'Finansal Okuryazarlık 💰',
    category: 'Ekonomi',
    description: 'Paranın kurallarını öğrenin ve bütçenizi yönetin.',
    steps: [
      { icon: '📊', title: 'Adım 1: 50/30/20 Kuralı', content: 'Gelirinizin %50\'sini temel ihtiyaçlara (kira, fatura), %30\'unu isteklere (gezme, eğlence), %20\'sini ise geleceğiniz için birikim ve yatırıma ayırmalısınız.' },
      { icon: '🛡️', title: 'Adım 2: Acil Durum Fonu', content: 'Hayat sürprizlerle doludur. İşsiz kalma veya ani hastalıklara karşı her zaman en az 3 ile 6 aylık zorunlu giderinizi kapsayacak nakit birikiminiz olmalıdır.' },
      { icon: '📉', title: 'Adım 3: Enflasyon Canavarı', content: 'Paranın alım gücünün zamanla erimesidir. Eğer paranızı sadece yastık altında veya faizsiz hesapta tutarsanız, enflasyon karşısında paranızın değeri her gün düşer.' }
    ],
    questions: [
      { q: "Gelirin yüzde kaçı birikim ve yatırıma ayrılmalıdır (50/30/20 kuralına göre)?", options: ["%10", "%20", "%30", "%50"], answer: "%20" },
      { q: "Acil durum fonu ideal olarak en az kaç aylık gideri karşılamalıdır?", options: ["1 Ay", "3-6 Ay", "1 Yıl", "5 Yıl"], answer: "3-6 Ay" },
      { q: "Paranın alım gücünün zamanla düşmesine ne ad verilir?", options: ["Deflasyon", "Devalüasyon", "Enflasyon", "Resesyon"], answer: "Enflasyon" }
    ]
  },
  {
    id: 'zaman-101',
    title: 'Zaman Yönetimi ⏳',
    category: 'Üretkenlik',
    description: 'Günün 24 saatini en verimli şekilde kullanma sanatı.',
    steps: [
      { icon: '🍅', title: 'Adım 1: Pomodoro Tekniği', content: 'Dikkatinin dağılmasını engellemek için 25 dakika pür dikkat çalışma ve ardından 5 dakika mola verme döngüsüdür. Beyni zinde tutar.' },
      { icon: '🔲', title: 'Adım 2: Eisenhower Matrisi', content: 'İşleri "Acil" ve "Önemli" olarak 4 kutuya böler. Acil ve önemli olanları hemen yap, önemli ama acil olmayanları planla, diğerlerini sil veya devret.' },
      { icon: '🎈', title: 'Adım 3: Parkinson Yasası', content: '"Bir iş, ona ayrılan süreyi dolduracak kadar genişler." Bir projeye 1 hafta verirsen 1 hafta sürer, aynı işe 1 gün süre tanırsan beynin onu 1 günde bitirir!' }
    ],
    questions: [
      { q: "Geleneksel bir Pomodoro çalışma süresi kaç dakikadır?", options: ["15", "25", "45", "60"], answer: "25" },
      { q: "İşleri 'Acil' ve 'Önemli' olarak ayıran matrisin adı nedir?", options: ["Eisenhower", "Newton", "Tesla", "Pisagor"], answer: "Eisenhower" },
      { q: "'Bir iş, ona ayrılan süreyi dolduracak kadar genişler' kuralı nedir?", options: ["Murphy Kanunu", "Pareto İlkesi", "Parkinson Yasası", "Moore Yasası"], answer: "Parkinson Yasası" }
    ]
  },
  {
    id: 'mantik-101',
    title: 'Analitik Düşünme 🧠',
    category: 'Felsefe & Mantık',
    description: 'Safsataları (mantık hatalarını) tanıyın ve doğru kararlar verin.',
    steps: [
      { icon: '🤺', title: 'Adım 1: Ad Hominem', content: 'Bir tartışmada, fikri çürütmek yerine o fikri savunan kişinin şahsına, karakterine veya tipine saldırma acizliğidir. Çok yaygın bir mantık hatasıdır.' },
      { icon: '🔗', title: 'Adım 2: Korelasyon ≠ Nedensellik', content: 'İki olayın aynı anda olması, birinin diğerine sebep olduğu anlamına gelmez. Yazın hem dondurma satışları artar hem güneş yanığı artar. Ama dondurma yemek yanık yapmaz!' },
      { icon: '🙈', title: 'Adım 3: Doğrulama Önyargısı', content: 'İnsan beyni, sadece kendi inançlarını doğrulayan bilgileri ciddiye alma, aksini ispatlayan gerçekleri ise görmezden gelme veya küçümseme eğilimindedir.' }
    ],
    questions: [
      { q: "Fikri değil de fikri savunan kişiyi hedef almaya ne denir?", options: ["Ad Hominem", "Empati", "Korelasyon", "Diyalog"], answer: "Ad Hominem" },
      { q: "İki olayın aynı anda gerçekleşmesi her zaman neyi İFADE ETMEZ?", options: ["İstatistik", "Nedensellik (Sebep-Sonuç)", "Tesadüf", "Korelasyon"], answer: "Nedensellik (Sebep-Sonuç)" },
      { q: "Sadece kendi fikrimizi destekleyen kanıtları görme eğilimine ne denir?", options: ["Adil Yargı", "Objektiflik", "Doğrulama Önyargısı", "Kritik Düşünce"], answer: "Doğrulama Önyargısı" }
    ]
  }
];

export default function EgitimAkademisi() {
  const router = useRouter();
  
  const [player, setPlayer] = useState(''); 
  const [mode, setMode] = useState('menu'); 
  
  const [activeCourse, setActiveCourse] = useState(null);
  
  // YENİ: Slayt (Ders Adımı) State'i
  const [lessonStep, setLessonStep] = useState(0);

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [allCertificates, setAllCertificates] = useState([]);

  useEffect(() => {
    if (player) fetchCertificates();
  }, [player, mode]);

  const fetchCertificates = async () => {
    const { data } = await supabase.from('akademi_certificates').select('*');
    if (data) setAllCertificates(data);
  };

  const startCourse = (course) => {
    setActiveCourse(course);
    setLessonStep(0); // Dersi hep ilk adımdan başlat
    setMode('lesson');
  };

  const nextLessonStep = () => {
    if (lessonStep + 1 < activeCourse.steps.length) {
      setLessonStep(lessonStep + 1);
    } else {
      startExam();
    }
  };

  const startExam = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedOpt(null);
    setTimeLeft(15);
    setMode('exam');
  };

  useEffect(() => {
    if (mode !== 'exam' || selectedOpt !== null) return;
    
    if (timeLeft === 0) {
      handleAnswer('ZAMAN_DOLDU'); 
      return;
    }
    
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, mode, selectedOpt]);

  const handleAnswer = async (selected) => {
    if (selectedOpt !== null) return; 
    
    setSelectedOpt(selected);
    const isCorrect = selected === activeCourse.questions[currentQ].answer;
    const newScore = isCorrect ? score + 1 : score;
    
    setTimeout(async () => {
      setScore(newScore);
      setSelectedOpt(null);
      setTimeLeft(15);

      if (currentQ + 1 < activeCourse.questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        const finalPercentage = (newScore / activeCourse.questions.length) * 100;
        if (finalPercentage === 100) {
          await supabase.from('akademi_certificates').upsert({
            player_name: player,
            course_id: activeCourse.id,
            course_title: activeCourse.title
          }, { onConflict: 'player_name, course_id' });
          setMode('certificate');
        } else {
          setMode('fail');
        }
      }
    }, 1500);
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setLineWidth(5); doc.setDrawColor(251, 191, 36); doc.rect(10, 10, 277, 190);
    doc.setLineWidth(1); doc.setDrawColor(30, 41, 59); doc.rect(13, 13, 271, 184);
    doc.setFont("helvetica", "bold"); doc.setFontSize(40); doc.setTextColor(30, 41, 59);
    doc.text("NÖ AKADEMI", 148, 40, { align: "center" });
    doc.setFontSize(25); doc.setTextColor(180, 83, 9); 
    doc.text("BASARI SERTIFIKASI", 148, 60, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(16); doc.setTextColor(71, 85, 105);
    doc.text("Bu sertifika,", 148, 85, { align: "center" });
    doc.setFont("times", "bolditalic"); doc.setFontSize(45); doc.setTextColor(2, 6, 23);
    doc.text(player.toUpperCase(), 148, 110, { align: "center" });
    doc.setLineWidth(0.5); doc.setDrawColor(203, 213, 225); doc.line(80, 115, 216, 115);
    doc.setFont("helvetica", "normal"); doc.setFontSize(14);
    doc.text(`adli ogrencinin "${activeCourse.title}" egitimini`, 148, 130, { align: "center" });
    doc.text("basariyla tamamladigini ve %100 tam puan aldigini belgelemektedir.", 148, 140, { align: "center" });
    doc.setFontSize(12); doc.setFont("helvetica", "bold");
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 50, 175, { align: "center" });
    doc.text("Kurucu Yonetim", 246, 175, { align: "center" });
    doc.setFont("times", "italic"); doc.text("NO Sistem", 246, 165, { align: "center" });
    doc.save(`${player}_Sertifika_${activeCourse.id}.pdf`);
  };

  if (!player) {
    return (
      <div className="page-wrapper auth-bg">
        <Head><title>Giriş | NÖ Akademi</title></Head>
        <button className="back-btn" onClick={() => router.push('/anasayfa')}>← Ana Sayfa</button>
        <div className="glass-container">
          <h1 style={{color:'#3b82f6', fontSize:'3.5rem', margin:'0 0 10px 0'}}>🎓</h1>
          <h2>Akademiye Hoş Geldin!</h2>
          <p style={{color:'#94a3b8', marginBottom:'30px'}}>Sertifikaya hangi isim yazılacak?</p>
          <button className="player-btn ozgur" onClick={() => setPlayer('Özgür')}>Özgür 👨🏻‍🎓</button>
          <button className="player-btn nisa" onClick={() => setPlayer('Nisa')}>Nisa 👩🏻‍🎓</button>
        </div>
        <style jsx>{`
          .page-wrapper { min-height: 100vh; background: #020617; display: flex; justify-content: center; align-items: center; font-family: 'Inter', sans-serif;}
          .glass-container { background: #0f172a; padding: 40px; border-radius: 24px; text-align: center; border: 1px solid #1e293b; color: white; width: 100%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);}
          .player-btn { width: 100%; padding: 15px; margin: 10px 0; border: none; border-radius: 12px; font-size: 1.2rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
          .ozgur { background: #3b82f6; color: white; }
          .nisa { background: #ec4899; color: white; }
          .player-btn:hover { transform: scale(1.05); }
          .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; color: white; border: 1px solid #334155; padding: 10px 20px; border-radius: 10px; cursor: pointer; z-index: 100;}
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Head><title>NÖ Akademi | Geleceğini Şekillendir</title></Head>

      <button className="back-btn" onClick={() => router.push('/anasayfa')}>
        <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
      </button>

      <div className="main-container">
        
        {/* MENÜ EKRANI */}
        {mode === 'menu' && (
          <div className="menu-screen slide-in">
            <div className="header">
              <h1>🎓 NÖ Akademi</h1>
              <p>Hoş geldin, <strong>{player}</strong>. Eğitim arşivine göz at!</p>
            </div>
            
            <div className="course-list">
              {COURSES.map(course => {
                const hasCert = allCertificates.some(c => c.player_name === player && c.course_id === course.id);

                return (
                  <div key={course.id} className={`course-card ${hasCert ? 'completed' : ''}`}>
                    <div className="course-info">
                      <span className="cat-badge">{course.category}</span>
                      <h3>{course.title} {hasCert && '✅'}</h3>
                      <p>{course.description}</p>
                    </div>
                    {hasCert ? (
                      <button className="start-btn success" onClick={() => startCourse(course)}>Tekrar Öğren 🔄</button>
                    ) : (
                      <button className="start-btn" onClick={() => startCourse(course)}>Eğitime Başla ▶</button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* GURUR TABLOSU */}
            <div className="fame-wall">
              <h2>🏆 Gurur Tablosu</h2>
              <div className="fame-grid">
                <div className="fame-col">
                  <h3 style={{color: '#3b82f6'}}>👨🏻‍🎓 Özgür'ün Sertifikaları</h3>
                  <ul>
                    {allCertificates.filter(c => c.player_name === 'Özgür').length === 0 && <li className="empty-li">Henüz sertifika yok...</li>}
                    {allCertificates.filter(c => c.player_name === 'Özgür').map(c => (
                      <li key={c.id}>📜 {c.course_title}</li>
                    ))}
                  </ul>
                </div>
                <div className="fame-col">
                  <h3 style={{color: '#ec4899'}}>👩🏻‍🎓 Nisa'nın Sertifikaları</h3>
                  <ul>
                    {allCertificates.filter(c => c.player_name === 'Nisa').length === 0 && <li className="empty-li">Henüz sertifika yok...</li>}
                    {allCertificates.filter(c => c.player_name === 'Nisa').map(c => (
                      <li key={c.id}>📜 {c.course_title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EĞİTİM EKRANI (İNTERAKTİF SLAYT) */}
        {mode === 'lesson' && activeCourse && (
          <div className="lesson-screen fade-in">
            
            <div className="lesson-header">
              <button className="quit-btn" onClick={() => setMode('menu')}>✕ Çık</button>
              <div className="lesson-progress-bar">
                <div 
                  className="lesson-progress-fill" 
                  style={{ width: `${((lessonStep) / activeCourse.steps.length) * 100}%` }}
                ></div>
              </div>
              <span className="step-counter">{lessonStep + 1} / {activeCourse.steps.length}</span>
            </div>

            <div className="step-card">
              <div className="step-icon">{activeCourse.steps[lessonStep].icon}</div>
              <h2>{activeCourse.steps[lessonStep].title}</h2>
              <p className="step-content">{activeCourse.steps[lessonStep].content}</p>
            </div>

            <div className="lesson-footer">
              <button className="next-step-btn" onClick={nextLessonStep}>
                {lessonStep + 1 === activeCourse.steps.length ? "Hazırım, Sınava Geç 📝" : "Sonraki Adım ➔"}
              </button>
            </div>

          </div>
        )}

        {/* SINAV EKRANI */}
        {mode === 'exam' && activeCourse && (
          <div className="exam-screen fade-in">
            <div className="exam-header">
              <span className="progress">Soru {currentQ + 1} / {activeCourse.questions.length}</span>
              <h2>Sertifika Sınavı</h2>
              <button className="quit-btn" onClick={() => setMode('menu')}>✕ Çık</button>
            </div>
            
            {/* ZAMANLAYICI ÇUBUĞU */}
            <div className="timer-bar">
              <div className={`timer-fill ${timeLeft <= 5 ? 'danger' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
            </div>
            <div className="time-text">Kalan Süre: {timeLeft}s</div>
            
            <div className="question-box">
              <h3>{activeCourse.questions[currentQ].q}</h3>
            </div>
            
            <div className="options">
              {activeCourse.questions[currentQ].options.map((opt, i) => {
                let btnClass = "option-btn";
                if (selectedOpt !== null) {
                  if (opt === activeCourse.questions[currentQ].answer) {
                    btnClass += " correct"; 
                  } else if (opt === selectedOpt) {
                    btnClass += " wrong"; 
                  } else {
                    btnClass += " disabled"; 
                  }
                }

                return (
                  <button key={i} className={btnClass} onClick={() => handleAnswer(opt)}>
                    <span className="opt-letter">{['A', 'B', 'C', 'D'][i]}</span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BAŞARISIZLIK EKRANI */}
        {mode === 'fail' && (
          <div className="fail-screen fade-in">
            <h1 className="fail-icon">❌</h1>
            <h2>Sertifika Alınamadı!</h2>
            <p>Sertifika almak için <strong>100 tam puan</strong> yapmalısın.</p>
            <p className="fail-score">Senin Puanın: %{Math.round((score / activeCourse.questions.length) * 100)}</p>
            <button className="retry-btn" onClick={() => startCourse(activeCourse)}>Dersleri Tekrar Et 🔄</button>
            <br/>
            <button className="cancel-text-btn" onClick={() => setMode('menu')}>Menüye Dön</button>
          </div>
        )}

        {/* SERTİFİKA EKRANI (PDF İNDİRMELİ) */}
        {mode === 'certificate' && (
          <div className="certificate-screen fade-in">
            <div className="certificate">
              <div className="cert-inner">
                <div className="cert-logo">🎓 NÖ AKADEMİ</div>
                <h1>BAŞARI SERTİFİKASI</h1>
                <p className="cert-text">Bu sertifika,</p>
                <h2 className="cert-name">{player.toUpperCase()}</h2>
                <p className="cert-text">adlı öğrencinin <strong>"{activeCourse.title}"</strong> eğitimini başarıyla tamamladığını ve yapılan sınavda <strong>100 Tam Puan</strong> aldığını belgelemektedir.</p>
                
                <div className="cert-footer">
                  <div className="signature">
                    <span className="date">{new Date().toLocaleDateString('tr-TR')}</span>
                    <hr/>
                    <span>Veriliş Tarihi</span>
                  </div>
                  <div className="seal">🏆</div>
                  <div className="signature">
                    <span className="sign-font">NÖ Sistem</span>
                    <hr/>
                    <span>Kurucu Yönetim</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cert-actions">
              <button className="download-btn" onClick={downloadPDF}>📥 PDF Olarak İndir</button>
              <button className="claim-btn" onClick={() => { fetchCertificates(); setMode('menu'); }}>Gurur Tablosuna Dön</button>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .page-wrapper { min-height: 100vh; background: #020617; color: white; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: flex-start; padding: 60px 20px 20px 20px; position: relative; }
        .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 10px 18px; border-radius: 12px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: 600; transition: 0.2s; z-index: 1000; }
        .back-btn:hover { background: #3b82f6; color: white; border-color: #3b82f6; }

        .main-container { width: 100%; max-width: 700px; margin-top: 20px;}

        /* Animasyonlar */
        .fade-in { animation: fadeIn 0.4s ease-out; }
        .slide-in { animation: slideIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Menü Stilleri */
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #3b82f6; font-size: 2.5rem; margin-bottom: 5px; }
        .header p { color: #94a3b8; }
        
        .course-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px;}
        .course-card { background: #0f172a; border: 1px solid #1e293b; padding: 25px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; transition: 0.3s; }
        .course-card:hover { border-color: #3b82f6; transform: translateY(-3px); box-shadow: 0 10px 30px rgba(59,130,246,0.1); }
        .course-card.completed { border-color: #10b981; background: rgba(16,185,129,0.05); }
        .cat-badge { background: rgba(59,130,246,0.1); color: #3b82f6; padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; }
        .course-info h3 { margin: 10px 0 5px 0; color: #f8fafc; font-size: 1.3rem; }
        .course-info p { margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.4; }
        
        .start-btn { background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; white-space: nowrap; transition: 0.2s; }
        .start-btn:hover { background: #2563eb; }
        .start-btn.success { background: #0f172a; color: #10b981; border: 1px solid #10b981;}
        .start-btn.success:hover { background: #10b981; color: white;}

        /* Gurur Tablosu */
        .fame-wall { background: #1e293b; border: 1px dashed #fbbf24; border-radius: 20px; padding: 25px; text-align: left;}
        .fame-wall h2 { color: #fbbf24; margin-top: 0; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 15px;}
        .fame-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;}
        .fame-col { background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid #334155;}
        .fame-col h3 { margin-top: 0; font-size: 1.1rem; margin-bottom: 15px;}
        .fame-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;}
        .fame-col li { background: #1e293b; padding: 10px; border-radius: 8px; font-size: 0.9rem; color: #e2e8f0; border-left: 3px solid #fbbf24;}
        .empty-li { border: none !important; background: transparent !important; color: #64748b !important; font-style: italic;}

        /* --- YENİ EĞİTİM (SLAYT) STİLLERİ --- */
        .lesson-screen { background: #0f172a; padding: 30px; border-radius: 24px; border: 1px solid #1e293b; text-align: center; }
        .lesson-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; gap: 15px;}
        .lesson-progress-bar { flex: 1; height: 10px; background: #1e293b; border-radius: 5px; overflow: hidden; }
        .lesson-progress-fill { height: 100%; background: #10b981; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .step-counter { color: #64748b; font-weight: bold; font-size: 0.9rem;}
        
        .step-card { background: #1e293b; padding: 40px 30px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border-top: 4px solid #3b82f6;}
        .step-icon { font-size: 5rem; margin-bottom: 20px; }
        .step-card h2 { color: #f8fafc; font-size: 1.8rem; margin: 0 0 15px 0; }
        .step-content { color: #cbd5e1; font-size: 1.2rem; line-height: 1.8; margin: 0; }
        
        .lesson-footer { display: flex; justify-content: center; }
        .next-step-btn { background: #3b82f6; color: white; border: none; padding: 18px 40px; border-radius: 16px; font-weight: bold; font-size: 1.2rem; cursor: pointer; transition: 0.2s; width: 100%; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3); }
        .next-step-btn:hover { background: #2563eb; transform: translateY(-2px); }
        .quit-btn { background: transparent; color: #64748b; border: 1px solid #334155; padding: 8px 15px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;}
        .quit-btn:hover { background: #ef4444; color: white; border-color: #ef4444;}

        /* Sınav Stilleri */
        .exam-screen { background: #0f172a; padding: 30px; border-radius: 24px; border: 1px solid #1e293b; text-align: center; }
        .exam-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; color: #94a3b8; }
        .progress { background: #1e293b; padding: 5px 12px; border-radius: 10px; font-weight: bold; font-size: 0.9rem;}
        
        .timer-bar { width: 100%; height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .timer-fill { height: 100%; background: #3b82f6; transition: width 1s linear, background 0.3s; }
        .timer-fill.danger { background: #ef4444; }
        .time-text { font-size: 0.8rem; color: #64748b; text-align: right; margin-bottom: 20px; font-weight: bold; }

        .question-box { background: #1e293b; padding: 30px 20px; border-radius: 16px; margin-bottom: 25px; border-left: 5px solid #3b82f6; }
        .question-box h3 { margin: 0; font-size: 1.3rem; line-height: 1.5; color: white; }
        
        .options { display: flex; flex-direction: column; gap: 12px; }
        .option-btn { display: flex; align-items: center; background: #020617; border: 2px solid #334155; border-radius: 12px; padding: 15px 20px; cursor: pointer; transition: 0.2s; text-align: left; }
        .option-btn:hover:not(.disabled) { background: #1e293b; border-color: #3b82f6; }
        .opt-letter { background: #1e293b; color: #94a3b8; font-weight: bold; font-size: 1rem; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-right: 15px; flex-shrink: 0; }
        .opt-text { color: #e2e8f0; font-size: 1.1rem; font-weight: 500; }
        
        .correct { background: rgba(16, 185, 129, 0.1) !important; border-color: #10b981 !important; }
        .correct .opt-letter { background: #10b981; color: white; }
        .wrong { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; }
        .wrong .opt-letter { background: #ef4444; color: white; }
        .disabled { opacity: 0.5; cursor: not-allowed; }

        /* Başarısızlık Ekranı */
        .fail-screen { text-align: center; background: #0f172a; padding: 40px; border-radius: 24px; border: 1px dashed #ef4444; }
        .fail-icon { font-size: 4rem; margin: 0; }
        .fail-screen h2 { color: #ef4444; margin: 10px 0; }
        .fail-screen p { color: #94a3b8; font-size: 1.1rem; }
        .fail-score { font-size: 1.5rem !important; font-weight: bold; color: white !important;}
        .retry-btn { margin-top: 20px; background: #3b82f6; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; width: 100%; }
        .cancel-text-btn { background: transparent; color: #64748b; border: none; margin-top: 15px; text-decoration: underline; cursor: pointer;}

        /* Sertifika Tasarımı */
        .certificate-screen { text-align: center; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .certificate { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); margin-bottom: 20px; background-image: radial-gradient(#f8fafc 20%, transparent 20%), radial-gradient(#f1f5f9 20%, transparent 20%); background-position: 0 0, 5px 5px; background-size: 10px 10px; }
        .cert-inner { border: 8px double #fbbf24; padding: 40px 30px; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; }
        .cert-logo { font-size: 1.2rem; font-weight: 900; color: #1e293b; letter-spacing: 2px; margin-bottom: 20px; }
        .cert-inner h1 { font-family: 'Georgia', serif; color: #020617; font-size: 2.2rem; margin: 0 0 20px 0; letter-spacing: 1px; }
        .cert-text { color: #475569; font-size: 1rem; line-height: 1.6; max-width: 80%; }
        .cert-name { font-family: 'Brush Script MT', cursive, serif; font-size: 3.5rem; color: #b45309; margin: 15px 0; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; min-width: 300px; }
        .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; margin-top: 40px; padding: 0 20px; }
        .signature { text-align: center; color: #1e293b; font-size: 0.9rem; font-weight: bold; width: 120px; }
        .signature hr { border: none; border-top: 2px solid #1e293b; margin: 5px 0; }
        .sign-font { font-family: 'Brush Script MT', cursive; font-size: 1.5rem; color: #000; }
        .seal { font-size: 3.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); }
        
        .cert-actions { display: flex; gap: 15px; justify-content: center; }
        .download-btn { background: #10b981; color: white; border: none; padding: 15px 25px; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
        .download-btn:hover { background: #059669; transform: translateY(-3px); }
        .claim-btn { background: #1e293b; color: white; border: 1px solid #334155; padding: 15px 25px; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: 0.2s; }
        .claim-btn:hover { background: #334155; }

        @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 600px) {
          .course-card { flex-direction: column; text-align: center; }
          .start-btn { width: 100%; }
          .fame-grid { grid-template-columns: 1fr; }
          .step-card { padding: 25px 15px; }
          .step-icon { font-size: 4rem; }
          .step-card h2 { font-size: 1.4rem; }
          .step-content { font-size: 1rem; }
          .cert-inner { padding: 20px 10px; }
          .cert-inner h1 { font-size: 1.5rem; }
          .cert-name { font-size: 2.5rem; min-width: 200px; }
          .seal { font-size: 2.5rem; }
          .cert-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}