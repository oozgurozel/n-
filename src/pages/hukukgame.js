import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// KATEGORİLERE AYRILMIŞ DEV SORU BANKASI (Toplam 40 Soru)
const HUKUK_SORULARI = {
  "Anayasa Hukuku": [
    { q: "Türkiye Cumhuriyeti Anayasası'na göre kanun yapma yetkisi kime aittir?", options: ["Cumhurbaşkanı", "Anayasa Mahkemesi", "TBMM", "Adalet Bakanlığı"], answer: "TBMM" },
    { q: "Siyasi partilerin mali denetimini kim yapar?", options: ["Sayıştay", "Anayasa Mahkemesi", "Yargıtay", "İçişleri Bakanlığı"], answer: "Anayasa Mahkemesi" },
    { q: "Temel hak ve hürriyetler en fazla hangi yolla sınırlandırılabilir?", options: ["Kanun", "Cumhurbaşkanlığı Kararnamesi", "Yönetmelik", "Genelge"], answer: "Kanun" },
    { q: "Cumhurbaşkanı seçilebilmek için kural olarak kaç yaşını doldurmuş olmak gerekir?", options: ["35", "40", "45", "50"], answer: "40" },
    { q: "Anayasa Mahkemesi kaç üyeden oluşur?", options: ["11", "15", "17", "21"], answer: "15" },
    { q: "Hakimler ve Savcılar Kurulu'nun (HSK) başkanı kimdir?", options: ["Cumhurbaşkanı", "Yargıtay Başkanı", "Adalet Bakanı", "Anayasa Mahkemesi Başkanı"], answer: "Adalet Bakanı" },
    { q: "TBMM genel seçimleri kural olarak kaç yılda bir yapılır?", options: ["3", "4", "5", "7"], answer: "5" },
    { q: "Aşağıdakilerden hangisi Anayasa'nın değiştirilemez maddelerinden biridir?", options: ["Seçim Sistemi", "Milletvekili Sayısı", "Devletin Şeklinin Cumhuriyet Olduğu", "Bakanlıkların İsimleri"], answer: "Devletin Şeklinin Cumhuriyet Olduğu" },
    { q: "Yönetmelikler hangi hukuki metinlerin uygulanmasını göstermek amacıyla çıkarılır?", options: ["Sadece Kanun", "Kanun ve Cumhurbaşkanlığı Kararnamesi", "Sadece Anayasa", "Genelgeler"], answer: "Kanun ve Cumhurbaşkanlığı Kararnamesi" },
    { q: "Milletvekili düşme kararlarına karşı iptal davası hangi mahkemeye açılır?", options: ["Yargıtay", "Danıştay", "Anayasa Mahkemesi", "İdare Mahkemesi"], answer: "Anayasa Mahkemesi" }
  ],
  "Medeni Hukuk": [
    { q: "Türk Medeni Kanunu'na göre olağan erginlik (reşit olma) yaşı kaçtır?", options: ["16", "17", "18", "21"], answer: "18" },
    { q: "Bir kimsenin sağ ve tam doğmak koşuluyla hak ehliyetini kazandığı an hangisidir?", options: ["Ana rahmine düştüğü an", "Doğum anı", "Reşit olduğu an", "Nüfusa kaydedildiği an"], answer: "Ana rahmine düştüğü an" },
    { q: "Evlenme vaadiyle yapılan hukuki işleme ne ad verilir?", options: ["Nikah", "Sözleşme", "Nişanlanma", "Evlat Edinme"], answer: "Nişanlanma" },
    { q: "Miras bırakanın terekesi üzerinde hak iddia eden kanuni mirasçıların saklı paylarına ne ad verilir?", options: ["Mahfuz Hisse", "Vasiyet", "Miras Şirketi", "Tenkis"], answer: "Mahfuz Hisse" },
    { q: "Ayırt etme gücüne sahip küçükler (18 yaş altı) ehliyet bakımından hangi gruba girer?", options: ["Tam Ehliyetliler", "Sınırlı Ehliyetliler", "Sınırlı Ehliyetsizler", "Tam Ehliyetsizler"], answer: "Sınırlı Ehliyetsizler" },
    { q: "Boşanma davalarında yetkili mahkeme neresidir?", options: ["Yargıtay", "Sadece davacının yerleşim yeri mahkemesi", "Eşlerden birinin yerleşim yeri veya son 6 aydır birlikte oturdukları yer mahkemesi", "Sadece nikahın kıyıldığı yer mahkemesi"], answer: "Eşlerden birinin yerleşim yeri veya son 6 aydır birlikte oturdukları yer mahkemesi" },
    { q: "Olağanüstü zamanaşımı ile taşınmaz mülkiyetinin kazanılması için zilyetliğin davasız aralıksız en az kaç yıl sürmesi gerekir?", options: ["5 yıl", "10 yıl", "15 yıl", "20 yıl"], answer: "20 yıl" },
    { q: "Bir kişinin yerleşim yeri (ikametgahı) aynı anda en fazla kaç tane olabilir?", options: ["1", "2", "3", "Sınırsız"], answer: "1" },
    { q: "Dernek kurmak için en az kaç gerçek veya tüzel kişi gerekir?", options: ["3", "5", "7", "11"], answer: "7" },
    { q: "Hukuki işlemlerde irade ile beyan arasındaki bilmeden yaratılan uyumsuzluğa ne denir?", options: ["Muvazaa", "Hata (Yanılma)", "Hile (Aldatma)", "Gabin"], answer: "Hata (Yanılma)" }
  ],
  "Ceza Hukuku": [
    { q: "Suçluluğu hükmen sabit oluncaya kadar kimsenin suçlu sayılamayacağı ilkesine ne ad verilir?", options: ["Masumiyet Karinesi", "Kanunsuz Suç Olmaz", "Şüpheden Sanık Yararlanır", "Eşitlik İlkesi"], answer: "Masumiyet Karinesi" },
    { q: "Bir kişinin kendisine veya başkasına yönelmiş haksız bir saldırıyı defetmek zorunluluğuyla işlediği fiile ne denir?", options: ["Zaruret Hali", "Meşru Müdafaa", "Haksız Tahrik", "Gönüllü Vazgeçme"], answer: "Meşru Müdafaa" },
    { q: "Türk Ceza Kanunu'na göre ceza sorumluluğu kaç yaşını doldurmakla başlar?", options: ["10", "12", "15", "18"], answer: "12" },
    { q: "Neticeyi öngörmeyerek, dikkat ve özen yükümlülüğüne aykırı davranarak bir suçun işlenmesine ne denir?", options: ["Kast", "Olası Kast", "Taksir", "Bilinçli Taksir"], answer: "Taksir" },
    { q: "Ceza sorumluluğunun şahsiliği ilkesi ne anlama gelir?", options: ["Herkes kendi suçundan sorumludur", "Tüzel kişiler hapse atılabilir", "Aile bireyleri de cezalandırılır", "Cezalar şahsa özel affedilebilir"], answer: "Herkes kendi suçundan sorumludur" },
    { q: "Kanunu bilmemek mazeret sayılır mı?", options: ["Evet, her zaman", "Hayır, mazeret sayılmaz", "Sadece yabancılar için sayılır", "Sadece ağır cezalarda sayılır"], answer: "Hayır, mazeret sayılmaz" },
    { q: "İştirak halinde işlenen suçlarda 'Azmettiren' kişiye verilecek ceza kural olarak nedir?", options: ["Yarı oranında indirilir", "Fail gibi cezalandırılır", "Sadece para cezası verilir", "Cezalandırılmaz"], answer: "Fail gibi cezalandırılır" },
    { q: "Kişinin işlediği fiilin hukuki anlam ve sonuçlarını algılayamaması durumunda hangi yeteneği eksiktir?", options: ["Kusur yeteneği (İsnadiyet)", "Hak ehliyeti", "Taraf ehliyeti", "Fiil ehliyeti"], answer: "Kusur yeteneği (İsnadiyet)" },
    { q: "Suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesine ne ad verilir?", options: ["Kast", "Taksir", "İhmal", "Teşebbüs"], answer: "Kast" },
    { q: "Ağırlaştırılmış müebbet hapis cezası nerede infaz edilir?", options: ["Açık Cezaevi", "Kapalı Cezaevi", "Sıkı Güvenlikli Ceza İnfaz Kurumu", "Yarı Açık Cezaevi"], answer: "Sıkı Güvenlikli Ceza İnfaz Kurumu" }
  ],
  "İdare Hukuku": [
    { q: "İdarenin bütünlüğü ilkesini sağlayan hukuki araç aşağıdakilerden hangisidir?", options: ["Hiyerarşi ve İdari Vesayet", "Yetki Genişliği", "Merkezden Yönetim", "Yerinden Yönetim"], answer: "Hiyerarşi ve İdari Vesayet" },
    { q: "Kamu hizmetlerinin kesintisiz olarak devam etmesi ilkesine ne ad verilir?", options: ["Uyarlama", "Süreklilik", "Eşitlik", "Bedelsizlik"], answer: "Süreklilik" },
    { q: "Devlet memurlarına verilen en ağır disiplin cezası hangisidir?", options: ["Aylıktan Kesme", "Kademe İlerlemesinin Durdurulması", "Devlet Memurluğundan Çıkarma", "Kınama"], answer: "Devlet Memurluğundan Çıkarma" },
    { q: "Belediye başkanı halk tarafından kaç yıllık bir süre için seçilir?", options: ["3", "4", "5", "7"], answer: "5" },
    { q: "Köylerde köyün başı ve yürütme organı kimdir?", options: ["Kaymakam", "Vali", "Köy İhtiyar Heyeti", "Köy Muhtarı"], answer: "Köy Muhtarı" },
    { q: "Devlet memurlarının haftalık çalışma süresi genel kural olarak kaç saattir?", options: ["35", "40", "45", "48"], answer: "40" },
    { q: "İdari işlemlerin yetki, şekil, sebep, konu ve maksat yönlerinden hukuka aykırı olması durumunda açılan dava nedir?", options: ["Tam Yargı Davası", "İptal Davası", "Tazminat Davası", "Tespit Davası"], answer: "İptal Davası" },
    { q: "Kamu tüzel kişilerinin, kamu yararı amacıyla özel mülkiyette bulunan taşınmazlara zorla el koymasına ne denir?", options: ["İstimval", "Kamulaştırma (İstimlak)", "Müsadere", "Geçici İşgal"], answer: "Kamulaştırma (İstimlak)" },
    { q: "Aşağıdakilerden hangisi yerinden yönetim kuruluşları arasında yer alır?", options: ["Bakanlıklar", "Valilikler", "Belediyeler", "Kaymakamlıklar"], answer: "Belediyeler" },
    { q: "Başkent teşkilatının hiyerarşik en üst amiri kimdir?", options: ["Cumhurbaşkanı", "Bakan", "Vali", "Genel Müdür"], answer: "Cumhurbaşkanı" }
  ]
};

const CATEGORY_ICONS = {
  "Anayasa Hukuku": "📜",
  "Medeni Hukuk": "👨‍👩‍👧‍👦",
  "Ceza Hukuku": "⚖️",
  "İdare Hukuku": "🏛️"
};

export default function HukukOyunu() {
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    const savedScores = localStorage.getItem('hukuk_scores');
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, []);

  const saveScoreToMemory = (category, newScore) => {
    const currentBest = bestScores[category] || 0;
    const finalScoreToSave = Math.max(currentBest, newScore);
    
    const updatedScores = { ...bestScores, [category]: finalScoreToSave };
    setBestScores(updatedScores);
    localStorage.setItem('hukuk_scores', JSON.stringify(updatedScores));
  };

  useEffect(() => {
    if (!selectedCategory || showResult || selectedOpt) return;
    
    if (timeLeft === 0) {
      handleAnswer(null); 
      return;
    }
    
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedOpt, selectedCategory]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentQ(0);
    setCorrectCount(0);
    setShowResult(false);
    setTimeLeft(15);
    setSelectedOpt(null);
  };

  const handleAnswer = (option) => {
    setSelectedOpt(option);
    const questions = HUKUK_SORULARI[selectedCategory];
    const correct = option === questions[currentQ].answer;
    
    setIsCorrect(correct);
    if (correct) setCorrectCount(prev => prev + 1);

    setTimeout(() => {
      setSelectedOpt(null);
      setIsCorrect(null);
      setTimeLeft(15);
      
      if (currentQ + 1 < questions.length) {
        setCurrentQ(prev => prev + 1);
      } else {
        const finalScore = Math.round(((correctCount + (correct ? 1 : 0)) / questions.length) * 100);
        saveScoreToMemory(selectedCategory, finalScore);
        setShowResult(true);
      }
    }, 2000);
  };

  const quitToCategories = () => {
    setSelectedCategory(null);
  };

  const calculateFinalScore = () => {
    const totalQ = HUKUK_SORULARI[selectedCategory].length;
    return Math.round((correctCount / totalQ) * 100);
  };

  return (
    <div className="game-wrapper">
      <Head><title>Adalet Terazisi | Hukuk Branşları</title></Head>

      <button className="back-btn" onClick={() => router.push('/anasayfa')}>
        <span>←</span> <span className="hide-mobile">Ana Sayfa</span>
      </button>

      <div className="game-container">
        
        {!selectedCategory ? (
          <div className="category-screen">
            <div className="cat-header">
              <h1>⚖️ Adalet Terazisi</h1>
              <p>Kendini hangi hukuk dalında test etmek istersin?</p>
            </div>
            
            <div className="category-grid">
              {Object.keys(HUKUK_SORULARI).map(cat => {
                const myScore = bestScores[cat]; 
                
                return (
                  <div key={cat} className="cat-card" onClick={() => handleCategorySelect(cat)}>
                    {myScore !== undefined && (
                      <div className={`score-badge ${myScore >= 80 ? 'gold' : myScore >= 50 ? 'silver' : 'bronze'}`}>
                        🏆 %{myScore}
                      </div>
                    )}
                    
                    <span className="cat-icon">{CATEGORY_ICONS[cat]}</span>
                    <h3>{cat}</h3>
                    <p>{HUKUK_SORULARI[cat].length} Soru</p>
                  </div>
                );
              })}
            </div>
            
            {Object.keys(bestScores).length > 0 && (
              <div className="transcript">
                <h4>📜 Hukuk Karnen</h4>
                <div className="transcript-list">
                  {Object.entries(bestScores).map(([key, value]) => (
                    <div key={key} className="transcript-item">
                      <span>{key}</span>
                      <strong className={value >= 60 ? 'pass' : 'fail'}>{value} Puan</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : !showResult ? (
          <>
            <div className="header">
              <div className="header-info">
                <span className="cat-badge">{CATEGORY_ICONS[selectedCategory]} {selectedCategory}</span>
                <h2>Soru {currentQ + 1} / {HUKUK_SORULARI[selectedCategory].length}</h2>
              </div>
              <button className="quit-btn" onClick={quitToCategories}>Vazgeç</button>
            </div>

            <div className="timer-bar">
              <div className={`timer-fill ${timeLeft <= 5 ? 'danger' : ''}`} style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
            </div>
            <div className="time-text">Kalan Süre: {timeLeft}s</div>

            <div className="question-card">
              <h3>{HUKUK_SORULARI[selectedCategory][currentQ].q}</h3>
            </div>

            <div className="options-grid">
              {HUKUK_SORULARI[selectedCategory][currentQ].options.map((opt, i) => {
                let btnClass = "option-btn";
                if (selectedOpt) {
                  if (opt === HUKUK_SORULARI[selectedCategory][currentQ].answer) btnClass += " correct";
                  else if (opt === selectedOpt) btnClass += " wrong";
                  else btnClass += " disabled";
                }
                return (
                  <button key={i} className={btnClass} onClick={() => handleAnswer(opt)} disabled={selectedOpt !== null}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="result-card">
            <div className="icon">{CATEGORY_ICONS[selectedCategory]}</div>
            <h2>Duruşma Sona Erdi!</h2>
            <div className="final-score">
              <span>{selectedCategory} Puanınız:</span>
              <div className="score-circle">{calculateFinalScore()}</div>
            </div>
            <p className="message">
              {calculateFinalScore() === 100 ? "Mükemmel! Hakimliğe hazırsın. 🧑‍⚖️" : 
               calculateFinalScore() >= 60 ? "Tebrikler, bu branşta iyisin! 📜" : 
               "Bu alanda biraz daha içtihat okuman gerek! 📚"}
            </p>
            <div className="result-actions">
              <button className="restart-btn" onClick={() => handleCategorySelect(selectedCategory)}>Tekrar Oyna</button>
              <button className="change-cat-btn" onClick={quitToCategories}>Başka Kategori Seç</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .game-wrapper { min-height: 100vh; background: #020617; color: white; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; position: relative; }

        .back-btn { position: fixed; top: 20px; left: 20px; background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 10px 18px; border-radius: 12px; cursor: pointer; display: flex; gap: 8px; align-items: center; font-weight: 600; transition: 0.2s; z-index: 1000; }
        .back-btn:hover { background: #3b82f6; color: white; border-color: #3b82f6; }

        .game-container { width: 100%; max-width: 550px; background: #0f172a; padding: 30px; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 15px 35px rgba(0,0,0,0.5); text-align: center; }

        .cat-header h1 { color: #fbbf24; font-size: 2.2rem; margin: 0 0 10px 0; }
        .cat-header p { color: #94a3b8; margin-bottom: 30px; }
        
        .category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .cat-card { background: #1e293b; border: 1px solid #334155; padding: 25px 15px; border-radius: 16px; cursor: pointer; transition: 0.3s; display: flex; flex-direction: column; align-items: center; position: relative; }
        .cat-card:hover { border-color: #fbbf24; transform: translateY(-5px); background: rgba(251, 191, 36, 0.05); }
        .cat-icon { font-size: 3rem; margin-bottom: 10px; }
        .cat-card h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: #e2e8f0; }
        .cat-card p { margin: 0; font-size: 0.8rem; color: #64748b; font-weight: bold; background: #020617; padding: 4px 10px; border-radius: 20px; }

        .score-badge { position: absolute; top: -10px; right: -10px; padding: 5px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; color: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 10; border: 2px solid #0f172a; }
        .gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .silver { background: linear-gradient(135deg, #cbd5e1, #94a3b8); }
        .bronze { background: linear-gradient(135deg, #f87171, #ef4444); color: white; }

        .transcript { background: #1e293b; border: 1px dashed #334155; padding: 20px; border-radius: 16px; text-align: left; }
        .transcript h4 { color: #fbbf24; margin: 0 0 15px 0; font-size: 1.2rem; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 10px; }
        .transcript-list { display: flex; flex-direction: column; gap: 10px; }
        .transcript-item { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 10px 15px; border-radius: 10px; font-size: 0.95rem; }
        .transcript-item span { color: #e2e8f0; font-weight: 500; }
        .pass { color: #10b981; }
        .fail { color: #ef4444; }

        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #1e293b; }
        .header-info { text-align: left; }
        .cat-badge { display: inline-block; background: rgba(251, 191, 36, 0.15); color: #fbbf24; padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; margin-bottom: 10px; }
        .header-info h2 { margin: 0; color: #e2e8f0; font-size: 1.4rem; }
        .quit-btn { background: transparent; color: #64748b; border: 1px solid #334155; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
        .quit-btn:hover { background: #ef4444; color: white; border-color: #ef4444; }
        .timer-bar { width: 100%; height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .timer-fill { height: 100%; background: #3b82f6; transition: width 1s linear, background 0.3s; }
        .timer-fill.danger { background: #ef4444; }
        .time-text { font-size: 0.8rem; color: #64748b; text-align: right; margin-bottom: 20px; font-weight: bold; }
        .question-card { background: #1e293b; padding: 25px 20px; border-radius: 16px; border-left: 5px solid #fbbf24; margin-bottom: 25px; min-height: 100px; display: flex; align-items: center; justify-content: center; }
        .question-card h3 { margin: 0; font-size: 1.2rem; line-height: 1.5; color: #f8fafc; }
        .options-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .option-btn { background: #020617; color: #e2e8f0; border: 2px solid #334155; padding: 15px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: 0.2s; text-align: center; }
        .option-btn:hover:not(.disabled) { background: #1e293b; border-color: #fbbf24; }
        .correct { background: #10b981 !important; border-color: #059669 !important; color: white !important; }
        .wrong { background: #ef4444 !important; border-color: #b91c1c !important; color: white !important; }
        .disabled { opacity: 0.5; cursor: not-allowed; }
        .result-card .icon { font-size: 4rem; margin-bottom: 10px; }
        .result-card h2 { color: #fbbf24; font-size: 2rem; margin-bottom: 10px; }
        .final-score { margin: 20px 0; }
        .final-score span { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .score-circle { width: 130px; height: 130px; margin: 15px auto; border: 6px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; font-weight: 900; background: rgba(16, 185, 129, 0.1); color: white;}
        .message { color: #e2e8f0; font-size: 1.1rem; margin-bottom: 30px; line-height: 1.5; }
        .result-actions { display: flex; flex-direction: column; gap: 10px; }
        .restart-btn { background: #fbbf24; color: #000; font-weight: bold; font-size: 1.1rem; padding: 15px; border: none; border-radius: 12px; cursor: pointer; transition: 0.2s; }
        .restart-btn:hover { background: #f59e0b; }
        .change-cat-btn { background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .change-cat-btn:hover { background: #1e293b; color: white; }

        @media (max-width: 500px) {
          .hide-mobile { display: none; }
          .game-container { padding: 20px; border-radius: 16px; border: none; }
          .category-grid { grid-template-columns: 1fr; }
          .question-card h3 { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}