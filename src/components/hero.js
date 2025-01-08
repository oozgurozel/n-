import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative bg-hero-background bg-cover bg-no-repeat mt-16">
            <div className="container flex flex-col lg:flex-row items-center sm:place-self-end xxl:place-self-center">
                <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight text-center max-w-lg">
                        Tüm İK Süreçleriniz için Tek Çözüm
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-green-700 to-green-500">
                            {' '}HRSync
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-lg text-center">
                        Çalışan bilgilerini yönetin, bordro ve yan hak işlemlerini kolaylaştırın. İşe alım süreçlerini hızlandırın, verimliliği artırın ve büyümeye odaklanın.
                    </p>
                    <div className="flex lg:flex-row gap-4 items-center justify-center max-w-lg">
                        <div className="flex items-center bg-black px-4 py-2 rounded-lg shadow hover:bg-gray-800 cursor-pointer">
                            <Image
                                src="/hero/apple.png"
                                alt="App Store"
                                width={24}
                                height={24}
                            />
                            <span className="ml-2 text-sm font-semibold text-white">App Store</span>
                        </div>
                        <div className="flex items-center border px-4 py-2 rounded-lg border-black hover:bg-gray-100 cursor-pointer">
                            <Image
                                src="/hero/google-play.png"
                                alt="Google Play"
                                width={24}
                                height={24}
                            />
                            <span className="ml-2 text-sm font-semibold text-gray-800">Google Play</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 flex justify-end">
                    <Image
                        src="/hero.png"
                        alt="HRSync Dashboard"
                        width={750}
                        height={840}
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
}