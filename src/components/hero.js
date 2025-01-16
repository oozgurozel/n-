import React from 'react';

export default function Hero() {
    return (
        <section className="relative bg-black text-[#B99671] font-satoshi">
            {/* Ana İçerik */}
            <div className="container mx-auto flex flex-col items-center justify-center text-center py-80 px-6">
                {/* Hoşgeldiniz Metni */}
                <p className="text-lg uppercase tracking-widest text-[#B99671] mb-8">
                    Büromuza Hoşgeldiniz
                </p>

                {/* Ana Başlık */}
                <h1 className="text-4xl lg:text-6xl font-Gambetta leading-tight mb-6 text-[#B99671]">
                    Stratejik Çözümler ve Hukuki
                    <span className="block text-[#B99671]">Uzmanlıkla Yanınızdayız</span>
                </h1>

                {/* İletişim Butonu */}
                <a
                    href="#contact"
                    className="mt-6 inline-block bg-[#B99671] text-black font-semibold py-3 px-6 rounded-lg text-lg shadow-md hover:bg-white hover:text-black transition-all"
                >
                    İLETİŞİME GEÇ
                </a>
            </div>

         {/* Sürekli Kayarak Giden Metin */}
           <footer
             className="absolute bottom-0 w-full overflow-hidden border-t border-b border-[#B99671] py-4"
               style={{ backgroundColor: 'rgba(218, 197, 167, 0.15)' }} // Arka plan rengi %15 saydamlık
                  >
                  <div className="flex animate-marquee w-full">
                  {[...Array(20)].map((_, index) => (
                 <span key={index} className="whitespace-nowrap text-sm uppercase tracking-widest mx-2">
                Çeken Hukuk <span className="mx-2">+++ </span>
                </span>
             ))}
    </div>
</footer>
        </section>
    );
}
