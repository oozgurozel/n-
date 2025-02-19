import Header from "@/components/header";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Head from 'next/head';
import Lawyers from "@/components/lawyers";
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
<link rel="icon" href="/chh.png" sizes="any" />
</Head>
     <Lawyers/>
      <Contact />

    </>
  );
}