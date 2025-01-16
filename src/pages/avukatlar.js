import Header from "@/components/header";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Head from 'next/head';
export default function Home() {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Çeken Hukuk",
              url: "https://www.cekenhukuk.com.tr/avukatlar",
              description: "Çeken Hukuk İle Adli İşlemler Daha Kolay",
              publisher: {
                "@type": "Organization",
                name: "Çeken Hukuk",
                logo: {
                  "@type": "ImageObject",
                  url: "/ceken.png",
                },
              },
            }),
          }}
        />
        <title>Avukatlarımız</title>
        <meta
          name="description"
          content="Çeken Hukuk İle Adli Tüm İşlemleriniz Daha Şeffaf Ve Net"
        />
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@500&display=swap" rel="stylesheet" />
        <meta name="keywords" content="Çeken Hukuk Hakkımızda Hizmetlerimiz Avukatlarımız Ve Blog" />
        <meta name="author" content="Çeken Hukuk" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Çeken Hukuk İle Çözüm" />
        <meta property="og:description" content="Çeken Hukuk Uzman Kadrosu İle Yanınızda" />
        <meta property="og:image" content="/ceken.png" />
        <meta property="og:url" content="https://www.cekenhukuk.com.tr/avukatlar" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Çeken Hukuk İle Daha Kolay" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Çeken Hukuk İle Daha Başarılı" />
        <meta name="twitter:description" content="Çeken Hukuk Biliği Avukatlarla Yanınızda" />
        <meta name="twitter:image" content="/ceken.png" />
        <link rel="canonical" href="https://www.cekenhukuk.com.tr/avukatlar" />
      </Head>
      <Header />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        margin: '30px 0',
      }}>
        <h2 style={{ color: '#DAC5A7', fontSize: '2.4em', fontFamily: 'Satoshi, sans-serif', marginTop: '50px' }}>Avukatlarımız</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(218, 197, 167, 0.15)',
            padding: '25px 20px 35px 20px',
            width: '280px',
            border: '2px solid #DAC5A726',
          }}>
            <img src="./acı.webp.png" alt="Erdoğan Sapanoğlu" style={{ width: '240px', height: 'auto' }} />
            <p style={{ color: '#DAC5A7', marginTop: '20px', textAlign: 'center', fontSize: '1.1em' }}>Erdoğan Sapanoğlu</p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(218, 197, 167, 0.15)',
            padding: '25px 20px 35px 20px',
            width: '280px',
            border: '2px solid #DAC5A726',
          }}>
            <img src="./arda.webp.png" alt="Arda Can Çeken" style={{ width: '240px', height: 'auto' }} />
            <p style={{ color: '#DAC5A7', marginTop: '20px', textAlign: 'center', fontSize: '1.1em' }}>Arda Can Çeken</p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(218, 197, 167, 0.15)',
            padding: '25px 20px 35px 20px',
            width: '280px',
            border: '2px solid #DAC5A726',
          }}>
            <img src="./merve.webp.png" alt="Merve Öztürkçü Gümüş" style={{ width: '240px', height: 'auto' }} />
            <p style={{ color: '#DAC5A7', marginTop: '20px', textAlign: 'center', fontSize: '1.1em' }}>Merve Öztürkçü Gümüş</p>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(218, 197, 167, 0.15)',
            padding: '25px 20px 35px 20px',
            width: '280px',
            border: '2px solid #DAC5A726',
          }}>
            <img src="./ESMA.jpg" alt="Esma Betül Herdem" style={{ width: '240px', height: 'auto' }} />
            <p style={{ color: '#DAC5A7', marginTop: '20px', textAlign: 'center', fontSize: '1.1em' }}>Esma Betül Herdem</p>
          </div>
        </div>
      </div>
      <Contact />
      <Footer />
    </>
  );
}