import React from "react";
import Image from "next/image";

const Solutions = () => {
    const solutions = [
        {
            title: "Bordro Yönetimi",
            description:
                "Bordro işlemlerinizi hızlı ve hatasız bir şekilde tek ekrandan yönetin.",
            icon: "/solutions/bordro.png",
        },
        {
            title: "Personel Yönetimi",
            description:
                "Çalışanların tüm bilgilerini tek bir platformda kolayca yönetin ve güncelleyin.",
            icon: "/solutions/personel.png",
        },
        {
            title: "Vardiya Yönetimi",
            description:
                "Çalışma saatlerini ve vardiyaları verimli bir şekilde planlayarak zaman yönetimini optimize edin.",
            icon: "/solutions/vardiya.png",
        },
        {
            title: "Raporlar & Analizler",
            description:
                "İK verilerinizi detaylı raporlar ve analizlerle inceleyin, veri odaklı kararlar alarak İK süreçlerinizi iyileştirin.",
            icon: "/solutions/raporlar.png",
        },
        {
            title: "İzin Yönetimi",
            description:
                "Çalışanların izin taleplerini kolayca yönetin, onaylayın ve izin süreçlerini şeffaf bir şekilde takip edin.",
            icon: "/solutions/izin.png",
        },
        {
            title: "Harcama Yönetimi",
            description:
                "Çalışanların harcama taleplerini takip edin, onaylayın ve bütçenizi kolayca yönetin.",
            icon: "/solutions/harcama.png",
        },
        {
            title: "Puantaj Yönetimi",
            description:
                "Çalışanların çalışma saatlerini, vardiyalarını ve fazla mesailerini pratik şekilde takip edin ve yönetin.",
            icon: "/solutions/puantaj.png",
        },
        {
            title: "Zimmet Yönetimi",
            description:
                "Çalışanlara teslim edilen ekipman ve demirbaşları kolayca takip edin, zimmet süreçlerini düzenli yönetin.",
            icon: "/solutions/zimmet.png",
        },
        {
            title: "Ajanda",
            description:
                "Toplantı, görev ve etkinlikleri tek bir ajandada planlayın, çalışanlarınız günlerini verimli yönetsin.",
            icon: "/solutions/ajanda.png",
        },
    ];

    return (
        <section id="solutions" className="scroll-m-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="container mx-auto text-center flex flex-col gap-4 p-8">
                    <div className="mb-4">
                        <div className="inline-block border border-[#00A76F7A] text-[#00A76F] text-sm font-semibold px-4 py-2 rounded-full">
                            Çözümler
                        </div>
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 max-w-xl mx-auto leading-tight mb-3">
                        İK Süreçlerinizi Kolaylaştıran {' '}
                        <span className="text-[#00A76F]">Çözümler</span>
                    </h2>
                    <h4 className="text-[#637381] text-base leading-relaxed max-w-2xl font-semibold mx-auto">
                        HRSync ile personel yönetiminden bordroya, performanstan zaman takibine tüm İK süreçlerinizi tek platformda yönetin.
                    </h4>
                </div>
                <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((solution, index) => (
                        <div
                            key={index}
                            className="p-6 bg-white border border-[#919EAB29] rounded-lg hover:shadow-lg transition"
                        >
                            <div className="flex items-center justify-center h-12 w-12 rounded-md shadow text-green-600">
                                <Image src={solution.icon} width={42} height={42} />
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-gray-900">
                                {solution.title}
                            </h3>
                            <p className="mt-2 text-base font-semibold text-gray-500">{solution.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Solutions;