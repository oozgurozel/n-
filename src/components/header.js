import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Link bileşenini import et

export default function Header() {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobil menü durumu için yeni state

    const toggleServices = () => {
        setIsServicesOpen(!isServicesOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen); // Mobil menü durumunu değiştir
    };

    return (
        <header className="sticky top-0 z-50 bg-black">
            <div
                className="container mx-auto px-6 lg:px-12 py-4 flex justify-between items-center border border-[#B99671]"
                style={{
                    backgroundColor: 'rgba(218, 197, 167, 0.15)',
                    maxWidth: '900px',
                    padding: '10px 20px',
                    margin: '20px auto 0',
                }}
            >
                {/* Logo */}
                <div className="cekenlogo flex-shrink-0">
                    <Image
                        src="/ccken.png"
                        alt="Çeken Hukuk Logo"
                        width={180}
                        height={60}
                    />
                </div>

                {/* Navigation (Desktop) */}
                <nav className="hidden md:flex space-x-6 text-sm font-semibold items-center text-[#B99671]">
                    <Link href="/">
                        <span className="hover:text-white uppercase font-satoshi">Anasayfa</span>
                    </Link>
                    <Link href="/aboutus">
                        <span className="hover:text-white uppercase font-satoshi">Hakkımızda</span>
                    </Link>
                    <div className="relative">
                        <button
                            onClick={toggleServices}
                            className="hover:text-white uppercase flex items-center font-satoshi"
                        >
                            Hizmetlerimiz
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 ml-2 transform ${isServicesOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Hizmetler Accordion İçeriği */}
                        {isServicesOpen && (
                            <div
                                className="absolute left-1/2 transform -translate-x-[59%] mt-8 w-max text-[#B99671] border border-[#B99671] p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-sm"
                                style={{
                                    backgroundColor: '#DAC5A726', // Hizmetler arka planı %15 saydamlık
                                    zIndex: 100,
                                }}
                            >
                                <Link href="/cezahukuku">
                                    <span className="hover:text-white font-satoshi">Ceza Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">Ticaret Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">Borçlar Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">Miras Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">Uluslararası Ticaret Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">İcra ve İflas Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">İdare Hukuku</span>
                                </Link>
                                <Link href="#">
                                    <span className="hover:text-white font-satoshi">Sendikalar Hukuku</span>
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link href="/avukatlar">
                        <span className="hover:text-white uppercase font-satoshi">Avukatlar</span>
                    </Link>
                    <Link href="/blog">
                        <span className="hover:text-white uppercase font-satoshi">Blog</span>
                    </Link>
                    <a
                        href="#contact"
                        className="bg-[#B99671] text-black py-2 px-4 border border-black hover:bg-white hover:text-black font-satoshi"
                    >
                        İLETİŞİM
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <button onClick={toggleMobileMenu} className="md:hidden text-[#B99671]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black text-[#B99671] py-4 px-6">
                    <div className="flex flex-col space-y-4 text-sm font-semibold items-center">
                        <Link href="/">
                            <span className="hover:text-white uppercase font-satoshi">Anasayfa</span>
                        </Link>
                        <Link href="/aboutus">
                            <span className="hover:text-white uppercase font-satoshi">Hakkımızda</span>
                        </Link>
                        <div className="relative">
                            <button
                                onClick={toggleServices}
                                className="hover:text-white uppercase flex items-center font-satoshi"
                            >
                                Hizmetlerimiz
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-4 h-4 ml-2 transform ${isServicesOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Mobil Hizmetler Accordion İçeriği */}
                            {isServicesOpen && (
                                <div className="mt-2 ml-4 flex flex-col space-y-2">
                                    <Link href="/cezahukuku">
                                        <span className="hover:text-white font-satoshi">Ceza Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">Ticaret Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">Borçlar Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">Miras Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">Uluslararası Ticaret Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">İcra ve İflas Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">İdare Hukuku</span>
                                    </Link>
                                    <Link href="#">
                                        <span className="hover:text-white font-satoshi">Sendikalar Hukuku</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <Link href="/avukatlar">
                            <span className="hover:text-white uppercase font-satoshi">Avukatlar</span>
                        </Link>
                        <Link href="/blog">
                            <span className="hover:text-white uppercase font-satoshi">Blog</span>
                        </Link>
                        <a
                            href="#contact"
                            className="bg-[#B99671] text-black py-2 px-4 border border-black hover:bg-white hover:text-black font-satoshi"
                        >
                            İLETİŞİM
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}