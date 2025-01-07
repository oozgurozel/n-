import Image from "next/image";

export default function Steps() {
    return (
        <section id="steps" className="mt-24 scroll-m-32">
            <div className="container mx-auto text-center">
                <div className="mb-4">
                    <div className="inline-block border border-[#00A76F7A] text-[#00A76F] text-sm font-semibold px-4 py-2 rounded-full">
                        Nasıl Çalışır?
                    </div>
                </div>
                <h2 className="text-5xl font-extrabold text-gray-900 max-w-xl mx-auto leading-tight mb-20">
                    İK Süreçlerinizi{' '}
                    <span className="text-[#00A76F]">3 Adımda</span> Kolayca Yönetin
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-10 lg:gap-60 bg-no-repeat bg-top bg-steps-background">
                    <div className="bg-white rounded-lg relative">
                        <div className="rounded-full flex items-center justify-center">
                            <Image
                                src="/steps/step1.png"
                                alt="Kurulum ve Entegrasyon"
                                width={160}
                                height={160}
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-12 mb-4">
                            Kurulum ve Entegrasyon
                        </h3>
                        <p className="text-gray-600">
                            İhtiyaçlarınıza göre HRSync’i hızla kurun, mevcut sistemlerinizle
                            kolayca entegre edin.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg relative">
                        <div className="rounded-full flex items-center justify-center">
                            <Image
                                src="/steps/step2.png"
                                alt="Verilerinizi Yönetin"
                                width={190}
                                height={190}
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-12 mb-4">
                            Verilerinizi Yönetin
                        </h3>
                        <p className="text-gray-600">
                            Çalışan bilgileri, bordro, performans ve işe alım gibi tüm
                            verilerinizi tek bir platformda yönetin.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg relative">
                        <div className="rounded-full flex items-center justify-center">
                            <Image
                                src="/steps/step3.png"
                                alt="Takip ve Raporlama"
                                width={190}
                                height={190}
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mt-12 mb-4">
                            Takip ve Raporlama
                        </h3>
                        <p className="text-gray-600">
                            Gerçek zamanlı analiz ve raporlarla İK süreçlerinizi takip edin,
                            veriye dayalı kararlar alın.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}