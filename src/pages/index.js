
import Login from "@/components/login"
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
              name: "NÖ",
              url: "https://www.noezel.com.tr",
              description: "NÖ",
              publisher: {
                "@type": "Organization",
                name: "NÖ",
                logo: {
                  "@type": "ImageObject",
                  url: "/nozel.png",
                },
              },
            }),
          }}
        />
        <title>NÖ</title>
        <meta
          name="description"
          content="NÖ"
        />
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@500&display=swap" rel="stylesheet" />
        <meta name="keywords" content="NÖ Hakkımızda Hizmetlerimiz Avukatlarımız Ve Blog" />
        <meta name="author" content="NÖ" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="NÖ" />
        <meta property="og:description" content="NÖ" />
        <meta property="og:image" content="/nozel.png" />
        <meta property="og:url" content="https://www.noezel.com.tr" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NÖ" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NÖ" />
        <meta name="twitter:description" content="NÖ" />
        <meta name="twitter:image" content="/nozel.png" />
        <link rel="canonical" href="https://www.noezel.com.tr" />
        <link rel="icon" href="/NÖ.png" sizes="any" />
      </Head>
      <Login />

    </>
  );
}
