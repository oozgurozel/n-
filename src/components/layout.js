import { useState, useEffect } from 'react';
import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }) {
    const [showCookieBanner, setShowCookieBanner] = useState(true);
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true,
        analytics: false,
        preferences: false
    });

    useEffect(() => {
        const savedPreferences = localStorage.getItem('cookiePreferences');
        if (savedPreferences) {
            setCookiePreferences(JSON.parse(savedPreferences));
            setShowCookieBanner(false);
        }
    }, []);

    const handleCookieConsent = () => {
        localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
        setShowCookieBanner(false);

        if (cookiePreferences.analytics) {
            enableAnalytics();
        } else {
            disableAnalytics();
        }
    };

    const enableAnalytics = () => {
        window['ga-disable-G-EZNLP0ZBJJ'] = false;
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    };

    const disableAnalytics = () => {
        window['ga-disable-G-EZNLP0ZBJJ'] = true;
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    };

    const handleNecessaryClick = () => {
        alert("Gerekli seçimi kaldırılamaz. Gerekli çerezler, sayfada gezinme ve web-sitesinin güvenli alanlarına erişim gibi temel işlevleri sağlayarak web-sitesinin daha kullanışlı hale getirilmesine yardımcı olur. Web-sitesi bu çerezler olmadan doğru bir şekilde işlev gösteremez.");
    };

    const handleReject = () => {
        const rejectedPreferences = {
            necessary: true,
            analytics: false,
            preferences: false
        };
        localStorage.setItem('cookiePreferences', JSON.stringify(rejectedPreferences));
        setCookiePreferences(rejectedPreferences);
        setShowCookieBanner(false);
        disableAnalytics();
    };

    const acceptAll = () => {
        const acceptedPreferences = {
            necessary: true,
            analytics: true,
            preferences: true
        };
        localStorage.setItem('cookiePreferences', JSON.stringify(acceptedPreferences));
        setCookiePreferences(acceptedPreferences);
        setShowCookieBanner(false);
        enableAnalytics();
    };

    return (
        <>
            <Header />
            {children}
            <Footer />

            {showCookieBanner && (
                <div className="fixed bottom-0 left-0 right-0 bg-black border-gray-200 p-4 z-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 flex-1">
                                <img src="/ceken.png" alt="Kolay IK Logo" className="h-16" />
                                <div className="flex flex-col gap-4">
                                    <div className="text-sm text-[#B99671]">
                                        <b>Bu websitesinde çerezler kullanılmaktadır.</b> İçeriği ve reklamları kişiselleştirmek, sosyal medya özellikleri sunmak ve trafiği analiz etmek için çerezler kullanıyoruz. Sitemizi kullanımınızla ilgili bilgileri ayrıca sosyal medya, reklamcılık ve analiz iş ortaklarımızla paylaşabiliriz. İş ortaklarımız, bu bilgileri kendilerine sağladığınız veya hizmetlerini kullanırken topladıkları diğer bilgilerle birleştirebilir.
                                    </div>
                                    <div className="flex gap-6">
                                        <label className="flex items-center cursor-pointer text-[#B99671]">
                                            <input
                                                type="checkbox"
                                                checked={cookiePreferences.necessary}
                                                onClick={handleNecessaryClick}
                                                readOnly
                                                className="hidden"
                                            />
                                            <div className="w-5 h-5 border-2 border-[#B99671] rounded flex items-center justify-center mr-2">
                                                {cookiePreferences.necessary && (
                                                    <div className="w-3 h-3 bg-[#B99671] rounded"></div>
                                                )}
                                            </div>
                                            <span className="ml-2">Gerekli</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer text-[#B99671]">
                                            <input
                                                type="checkbox"
                                                checked={cookiePreferences.analytics}
                                                onChange={() => setCookiePreferences({ ...cookiePreferences, analytics: !cookiePreferences.analytics })}
                                                className="hidden"
                                            />
                                            <div className="w-5 h-5 border-2 border-[#B99671] rounded flex items-center justify-center mr-2">
                                                {cookiePreferences.analytics && (
                                                    <div className="w-3 h-3 bg-[#B99671] rounded"></div>
                                                )}
                                            </div>
                                            <span className="ml-2">İstatistikler</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer text-[#B99671]">
                                            <input
                                                type="checkbox"
                                                checked={cookiePreferences.preferences}
                                                onChange={() => setCookiePreferences({ ...cookiePreferences, preferences: !cookiePreferences.preferences })}
                                                className="hidden"
                                            />
                                            <div className="w-5 h-5 border-2 border-[#B99671] rounded flex items-center justify-center mr-2">
                                                {cookiePreferences.preferences && (
                                                    <div className="w-3 h-3 bg-[#B99671] rounded"></div>
                                                )}
                                            </div>
                                            <span className="ml-2">Tercihler</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-col items-center mt-2 gap-4">
                                    <button onClick={acceptAll} className="bg-[#B99671] w-full text-#B99671 px-4 py-2 rounded hover:bg-[#B99671] transition-colors">Tümünü Kabul Et</button>
                                    <button onClick={handleCookieConsent} className="bg-[#B99671] w-full text-#B99671 px-4 py-2 rounded hover:bg-[#B99671] transition-colors">Seçimleri Kaydet</button>
                                    <button onClick={handleReject} className="bg-[#B99671] w-full text-#B99671 px-4 py-2 rounded hover:bg-[#B99671] transition-colors">Reddet</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}