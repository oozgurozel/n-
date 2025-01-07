import Image from 'next/image';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/logo.png"
                        alt="HRSync Logo"
                        width={180}
                        height={60}
                    />
                </div>

                <nav className="hidden md:flex space-x-8 font-semibold text-sm items-center">
                    <a href="#solutions" className="text-gray-700 hover:text-green-600">
                        Çözümlerimiz
                    </a>
                    <a href="#steps" className="text-gray-700 hover:text-green-600">
                        Nasıl Çalışır?
                    </a>
                    <a href="#features" className="text-gray-700 hover:text-green-600">
                        Özellikler
                    </a>
                    <a href="#testimonials" className="text-gray-700 hover:text-green-600">
                        Kullanıcı Görüşleri
                    </a>
                    <a
                        href="#contact"
                        className="hidden md:inline-block bg-gray-800 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-gray-900"
                    >
                        İletişim
                    </a>
                </nav>

                <button className="md:hidden text-gray-700 hover:text-green-600">
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
        </header>
    );
}