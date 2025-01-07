import React from "react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="max-w-sm">
                        <img
                            src="/logo.png"
                            alt="HRSync Logo"
                            className="h-24 mb-4"
                        />
                        <p className="text-gray-600 text-sm leading-relaxed">
                            İnsan kaynakları süreçlerinizi kolaylaştırmak ve verimliliği arttırmak için yenilikçi çözümler sunar. Tüm İK
                            ihtiyaçlarınızı tek platformda yönetin ve iş gücünüzle geleceğe odaklanın.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a
                                href="#"
                                className="text-gray-600 hover:text-green-600 transition"
                                aria-label="Facebook"
                            >
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-green-600 transition"
                                aria-label="Instagram"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-green-600 transition"
                                aria-label="LinkedIn"
                            >
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a
                                href="#"
                                className="text-gray-600 hover:text-green-600 transition"
                                aria-label="Twitter"
                            >
                                <i className="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-gray-900 font-semibold mb-4">Şirket</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#steps"
                                        className="text-gray-600 hover:text-green-600 transition"
                                    >
                                        Nasıl Çalışır?
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#features"
                                        className="text-gray-600 hover:text-green-600 transition"
                                    >
                                        Özellikler
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#solutions"
                                        className="text-gray-600 hover:text-green-600 transition"
                                    >
                                        Çözümlerimiz
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonials"
                                        className="text-gray-600 hover:text-green-600 transition"
                                    >
                                        Kullanıcı Görüşleri
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-semibold mb-4">İletişim</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="mailto:info@adlkurumsal.com.tr"
                                        className="text-gray-600 hover:text-green-600 transition"
                                    >
                                        info@adlkurumsal.com.tr
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4 flex justify-between items-center flex-col lg:flex-row gap-4 lg:gap-0">
                    <p className="text-gray-600 text-sm">
                        <a
                            href="https://www.adlkurumsal.com.tr/"
                            target="_blank"
                            className="text-gray-600 underline hover:text-green-600 transition">
                            ADL Kurumsal Hizmetleri
                        </a> A.Ş. tarafından desteklenmektedir.
                    </p>
                    <p className="text-gray-600 text-sm">
                        Bütün hakları saklıdır © 2025
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;