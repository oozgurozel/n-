import Header from "@/components/header";
import Contact from "@/components/contact";
import Image from 'next/image';
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
              url: "https://www.cekenhukuk.com.tr/cezahukuku",
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
        <title>Ceza Hukuku</title>
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
        <meta property="og:url" content="https://www.cekenhukuk.com.tr" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Çeken Hukuk İle Daha Kolay" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Çeken Hukuk İle Daha Başarılı" />
        <meta name="twitter:description" content="Çeken Hukuk Biliği Avukatlarla Yanınızda" />
        <meta name="twitter:image" content="/ceken.png" />
        <link rel="canonical" href="https://www.cekenhukuk.com.tr/cezahukuku" />
        <link rel="icon" href="/chh.png" sizes="any" />
      </Head>
      <Header />
      <h2 style={{ color: "#B99671", fontSize: "2.5em", textAlign: "center", marginBottom: '20px', marginTop: '60px' }}>
        <br></br>
        Ceza Hukuku
      </h2>
      <div
        className="main-content" // Ana div'e bir class verdik
        style={{
          maxWidth: "1200px",
          margin: "20px auto",
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        <div className="image-container" style={{ flex: 1, maxWidth: '600px' }}>
          <Image
            src="/cezah.png"
            alt="Ceza Hukuku"
            width={600}
            height={450}
            style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', height: 'auto' }}
          />
        </div>
        <div
          className="text-container" // Metin div'ine bir class verdik
          style={{
            flex: 1,
            backgroundColor: "rgba(185, 150, 113, 0.15)",
            padding: "20px",
            minHeight: 'auto',
          }}
        >
          <br></br>
          <p style={{ color: "#B99671", lineHeight: "1.6" }}>
            Ceza hukuku, toplumsal dengenin korunmasını amaçlayan, suç olarak tanımlanan
            davanışları düzenleyen ve bu davranışlarının sonuçlarını belirleyen bir hukuk dalıdır. Bu alan,
            toplum düzenini bozan eylemleri önlemek, faillerini cezalandırmak ve mağdurları korumak
            gibi temel işlevlere sahiptir. Suç işlediği iddia edilen bireyler, suçlulukları kesin olarak
            kanıtlanana kadar masum kabul edilir ve yargılama süreci boyunca adil bir şekilde
            savunma hakkına sahiptir.
          </p>
          <br />
          <p style={{ color: "#B99671", lineHeight: "1.6" }}>
            Ceza davalarında, devlet veya hükümet adına hareket eden savcı, sanığın suçluluğunu
            kanıtlamakla yükümlüdür. Mahkeme süreci, delillerin toplanması ve incelenmesi, tanık
            ifadelerinin dinlenmesi ve tarafların beyanlarının değerlendirilmesiyle yürütülür. Suçun
            ciddiyeti ve yargılamayı yapan mahkemenin yetki alanına göre, verilecek cezalar değişiklik
            gösterebilir. Bu cezalar arasında para cezaları, hapis cezaları, kamu hizmeti gibi yaptırımlar
            yer alabilir. Ayrıca, bazı durumlarda rehabilitasyon programları veya denetimli serbestlik
            uygulanabilir.
          </p>
          <br />
          <p style={{ color: "#B99671", lineHeight: "1.6" }}>
            Ceza hukukunun temel hedefleri arasında suçların önlenmesi, adaletin sağlanması ve
            toplumsal caydırıcılığın arttırılması yer alır. Bu bağlamda, ceza hukuku bireylerin haklarının
            korunması ve hukukun üstünlüğünün tesis edilmesinde önemli bir rol oynar. Aynı zamanda,
            ceza yaptırımları, yalnızca bir cezalandırma aracı değil, aynı zamanda suçlunun topluma
            yeniden kazandırılmasını hedefleyen bir yöntem olarak da kullanılır.
          </p>
        </div>
      </div>
      <footer
        className="w-full overflow-hidden border-t border-b border-[#B99671] py-4"
        style={{ backgroundColor: 'rgba(218, 197, 167, 0.15)' }}
      >
        <div className="flex animate-marquee w-full">
          {[...Array(20)].map((_, index) => (
            <span key={index} className="whitespace-nowrap text-sm uppercase tracking-widest mx-2" style={{ color: '#B99671' }}>
              Çeken Hukuk <span className="mx-2">+++ </span>
            </span>
          ))}
        </div>
      </footer>
      <Contact />
      <style jsx>{`
        /* Web görünümü için varsayılan stiller (zaten inline olarak tanımlı) */
        .main-content {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        /* Mobil görünüm için medya sorgusu */
        @media (max-width: 768px) {
          .main-content {
            flex-direction: column; /* Mobil'de alt alta sırala */
            align-items: stretch; /* İçeriklerin genişliği tam olsun */
          }

          .image-container {
            max-width: 100%; /* Resim konteyneri tam genişlik */
            margin-bottom: 20px; /* Resim ile metin arasına boşluk */
          }
        }
      `}</style>
    </>
  );
}