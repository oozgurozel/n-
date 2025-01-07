import Hero from "@/components/hero"
import Header from "@/components/header"
import Steps from "@/components/steps"
import Features from "@/components/features"
import Solutions from "@/components/solutions";
import Testimonials from "@/components/testimonials";
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
              name: "HRSync",
              url: "https://hrsync.com",
              description: "HRSync ile İK süreçlerinizi kolaylaştırın.",
              publisher: {
                "@type": "Organization",
                name: "HRSync",
                logo: {
                  "@type": "ImageObject",
                  url: "/logo.png",
                },
              },
            }),
          }}
        />
        <title>HRSync - İK Süreçlerinizi Kolaylaştırın</title>
        <meta
          name="description"
          content="HRSync ile çalışan bilgilerini yönetin, bordro işlemlerini kolaylaştırın ve işe alım süreçlerini hızlandırın. Verimliliğinizi artırın!"
        />
        <meta name="keywords" content="İK yazılımı, bordro yönetimi, işe alım, çalışan yönetimi, HRSync" />
        <meta name="author" content="HRSync" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="HRSync - Tüm İK Süreçleriniz için Tek Çözüm" />
        <meta property="og:description" content="Çalışan bilgilerini yönetin, bordro ve yan hak işlemlerini kolaylaştırın. İşe alım süreçlerini hızlandırın." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://hrsync.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HRSync - İK Süreçleriniz için Çözüm" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HRSync - İK Süreçleriniz için Çözüm" />
        <meta name="twitter:description" content="HRSync ile çalışan bilgilerini yönetin ve süreçlerinizi kolaylaştırın." />
        <meta name="twitter:image" content="/logo.png" />
        <link rel="canonical" href="https://hrsync.com" />
      </Head>

      <Header />
      <Hero />
      <Steps />
      <Features />
      <Solutions />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
