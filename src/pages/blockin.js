import Header from "@/components/header";

import Testimonials from "@/components/testimonials";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Image from 'next/image';
import Head from 'next/head';
export default function Home() {

  const hexColor = "#DAC5A726";
  const decimalValue = parseInt(hexColor.substring(1), 16);
  const modResult = decimalValue % 15;
  const grayScaleValue = Math.round((modResult / 14) * 255);
  const backgroundColor = `rgb(${grayScaleValue}, ${grayScaleValue}, ${grayScaleValue})`;

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
              url: "https://www.cekenhukuk.com.tr",
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
        <title>Çeken Hukuk</title>
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
        <meta property="og:url" content="https://www.cekenhukuk.com.tr/blockin" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Çeken Hukuk İle Daha Kolay" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Çeken Hukuk İle Daha Başarılı" />
        <meta name="twitter:description" content="Çeken Hukuk Biliği Avukatlarla Yanınızda" />
        <meta name="twitter:image" content="/ceken.png" />
        <link rel="canonical" href="https://www.cekenhukuk.com.tr/blockin" />
        <link rel="icon" href="/chh.png" sizes="any" />
      </Head>
      <Header />
      <div style={{ padding: '110px 0 40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p style={{ color: '#B99671', fontSize: '0.9em' }}>23.01.2023</p>
            <h1 style={{ color: '#DAC5A7', fontSize: '2.5em', fontWeight: 'bold', marginBottom: '15px' }}>
              Hukuki Terimler: Yeni Başlayanlar İçin Temel Rehber
            </h1>
            <p style={{ color: '#B99671', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
              Bu rehber, özellikle yeni başlayanlar için temel hukuk terimlerini ve kavramlarını anlamanıza yardımcı olacak bilgiler sunuyor.
            </p>
          </div>
          <div style={{ margin: '40px 0' }}>
            <Image
              src="/ktp.png"
              alt="Hukuk Kitapları"
              width={1200}
              height={600}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h2 style={{ color: '#DAC5A7', fontSize: '1.8em', fontWeight: 'bold', marginBottom: '15px' }}>
              Hukuk Terminolojisi Neden Önemlidir?
            </h2>
            <p style={{ color: '#B99671', lineHeight: '1.6', marginBottom: '20px' }}>
              Hukuk dili, hukukun gücü ve içeriği kadar önemlidir. Doğru bir şekilde anlaşıldığında, yasal haklarınızı ve sorumluluklarınızı daha iyi kavrayabilirsiniz. Hukuk terminolojisine hakim olmak, hukuki belgeleri okumaktan avukatlarla etkili iletişim kurmaya kadar çok farklı durumlarda size yardımcı olabilir.
            </p>

            <h2 style={{ color: '#DAC5A7', fontSize: '1.8em', fontWeight: 'bold', marginBottom: '15px' }}>
              Temel Hukuk Kavramları ve Anlamları
            </h2>
            <ol style={{ color: '#B99671', lineHeight: '1.6', marginBottom: '30px', listStyleType: 'decimal' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Dava:</strong> Bir kişi ya da kurumun bir mahkemeye başvurarak yasal haklarını talep etmesi veya savunması için açılan hukuki süreçtir.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Sanık:</strong> Hakkında dava açılan ve suçla itham edilen kişiyi ifade eder.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Davacı ve Davalı:</strong> Davayı mahkemeye taşıyan taraf davacı, kendisine dava açılan taraf ise davalıdır.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Tebligat:</strong> Hukuki bir işle ilgili bilgilendirmenin resmi olarak yapılmasıdır.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Temyiz:</strong> Bir mahkeme kararının kanuna aykırı olduğunu iddia ederek daha üst bir merciiye başvurma hakkıdır.
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Mevzuat:</strong> Kanun, yönetmelik ve diğer hukuk kurallarının kapsayan hukuk kaynaklarıdır.
              </li>
              <li>
                <strong>Hukuki Yaptırım:</strong> Kanunlara aykırı hareket eden kişi ya da kurumlara uygulanan cezalar veya diğer hukuki sonuçlardır.
              </li>
            </ol>
            <h3 style={{ color: '#DAC5A7', fontSize: '1.4em', fontWeight: 'bold', marginBottom: '15px' }}>
              Hukuki Belgelerde Sıklıkla Karşılaşılan Terimler
            </h3>
            <ul style={{ color: '#B99671', lineHeight: '1.6', marginBottom: '30px', listStyleType: 'disc', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Sözleşme:</strong> Taraflar arasında yazılı ya da sözlü olarak yapılan hukuki anlaşma.</li>
              <li style={{ marginBottom: '10px' }}><strong>İhtarname:</strong> Bir tarafın, borcunu ödememesi halinde alacaklı tarafın yazılı uyarıda bulunması.</li>
              <li><strong>Tazminat:</strong> Uğranılan zararın karşılığı olarak ödenen bedel.</li>
            </ul>
            <h2 style={{ color: '#DAC5A7', fontSize: '1.8em', fontWeight: 'bold', marginBottom: '15px' }}>
              Hukuk Terminolojisine Hakim Olmak İçin İpuçları
            </h2>
            <ol style={{ color: '#B99671', lineHeight: '1.6', marginBottom: '30px', listStyleType: 'decimal' }}>
              <li style={{ marginBottom: '10px' }}><strong>Sürekli Kullanmaktan Çekinmeyin:</strong> Hukuki terimleri günlük konuşmalarınızda detaylı bir şekilde öğrenmek için hukuk sözlüklerinden yararlanın.</li>
              <li style={{ marginBottom: '10px' }}><strong>Kısa Hukuk Kurslarına Katılın:</strong> Birçok kurum, temel hukuk bilgisi edinmek isteyenler için eğitimler sunmaktadır.</li>
              <li><strong>Düzenli Kaynaklardan Okuma Yapın:</strong> Hukuk kitapları ve güvenilir hukuk blogları kavramları öğrenmenize yardımcı olacaktır.</li>
            </ol>
            <div style={{ borderTop: '1px solid #B99671', paddingTop: '20px' }}>
              <div style={{ backgroundColor: 'rgba(218, 197, 167, 0.15)', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ color: '#DAC5A7', fontSize: '1.8em', fontWeight: 'bold', marginBottom: '15px' }}>
                  Sonuç
                </h2>
                <p style={{ color: '#B99671', lineHeight: '1.6' }}>
                  Hukuk terimlerini anlamak, sadece bir hukukçunun değil, hukuki süreçlerle de ilgili olmak isteyen herkesin öğrenmesi gereken önemli bir beceridir. Bu rehberdeki temel kavramlar, bu yolda atacağınız ilk adımları kolaylaştırmayı amaçlamaktadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}