import "@/styles/globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Layout from '@/components/layout'
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    console.log(router)
    if (router.asPath === "/sikca-sorulanlar") {
      router.replace("/"); 
    }
  }, [router]);

  return (
    <Layout>
    <Component {...pageProps} />
  </Layout>
  )
}

