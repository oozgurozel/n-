import React from "react";

const Footer = () => {
    return (
        <footer className="border-t border-gray-700 py-8 mt-24" style={{ backgroundColor: '#DAC5A70F' }}>
            <div className="container mx-auto px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="max-w-sm">
                        <img
                            src="/ceken.png"
                            alt="HRSync Logo"
                            className="h-24 mb-4"
                        />
                        <p className="text-[#B99671] text-sm leading-relaxed">
                            Müvekkillerimize ve müşavir şirketlerimize hem geniş hukuki alanlarımızla hem de iş takibi, verimlilik, şeffafiyet, etkinlik ve önleyici hukuk çerçevesinde üst seviyede bir hukuki hizmet ve memnuniyet sunuyoruz.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a
                                href="#"
                                className="text-[#B99671] hover:text-green-600 transition"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="text-[#B99671] hover:text-green-600 transition"
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="#"
                                className="text-[#B99671] hover:text-green-600 transition"
                                aria-label="LinkedIn"
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a
                                href="#"
                                className="text-[#B99671] hover:text-green-600 transition"
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-[#B99671] font-semibold mb-4">MENÜ</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#steps"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        ANA SAYFA
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#features"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        HAKKIMIZDA
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#solutions"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        HİZMETLERİMİZ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonials"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        AVUKATLAR
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonials"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        BLOK
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[#B99671] font-semibold mb-4">HİZMETLERİMİZ</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        CEZA HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                       className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                       TİCARET HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                      className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                       AİLE VE KİŞİLER HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                       className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        DERNEKLER HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        BASIN VE MEDYA HUKUKU
                                    </a>
                                </li>
                               
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-[#B99671] font-semibold mb-4"></h3>
                            <ul className="space-y-2">
                            <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                       EŞYA HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                       className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        MİRAS HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                        className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        İCRA VE MİRAS HUKUKU
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                         className="text-[#DAC5A799] hover:text-green-600 transition"
                                    >
                                        İŞ VE SOSYAL GÜVENLİK HUKUKU
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 flex justify-between items-center flex-col lg:flex-row gap-4 lg:gap-0">
                    <p className="text-[#B99671] text-sm">
                        <a
                            href="https://www.adlkurumsal.com.tr/"
                            target="_blank"
                            className="text-[#B99671] underline hover:text-green-600 transition">
                            Copyright © 2025 Tüm Hakları Saklıdır.
                        </a> 
                    </p>
                    <p className="text-[#B99671] text-sm">
                        
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;