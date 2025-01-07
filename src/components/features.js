export default function Steps() {
    return (
        <section id="features" className="mt-24 scroll-m-24">
            <div className="container mx-auto text-center flex flex-col gap-4 p-8">
                <div className="mb-4">
                    <div className="inline-block border border-[#00A76F7A] text-[#00A76F] text-sm font-semibold px-4 py-2 rounded-full">
                        Özellikler
                    </div>
                </div>
                <h2 className="text-5xl font-extrabold text-gray-900 max-w-xl mx-auto leading-tight mb-3">
                    İK Yönetiminde Yeni Nesil{' '}
                    <span className="text-[#00A76F]">Özellikler</span>
                </h2>
                <h4 className="text-[#637381] text-base leading-relaxed max-w-2xl font-semibold mx-auto mb-20">
                    HRSync ile İK süreçlerinizi kolaylaştırın, verimliliği artırın ve zamandan tasarruf edin. Tüm özelliklerimizi keşfedin!
                </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 lg:px-32 max-w-[1440px] mx-auto">
                <div className="md:col-span-1">
                    <img
                        src="/features/features1.png"
                        alt="Cinsiyet Dağılımı"
                        className="w-full h-full"
                    />
                </div>

                <div className="md:col-span-2">
                    <img
                        src="/features/features2.png"
                        alt="İzin Bilgileri"
                        className="w-full h-full"
                    />
                </div>

                <div className="md:col-span-2">
                    <img
                        src="/features/features3.png"
                        alt="Kişisel Planlama"
                        className="w-full h-full"
                    />
                </div>

                <div className="md:col-span-1">
                    <img
                        src="/features/features4.png"
                        alt="Çalışan Erişilebilirliği"
                        className="w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
}