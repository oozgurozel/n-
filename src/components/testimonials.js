import React from "react";

const Testimonials = () => {
    const fakeTestimonials = [
        {
            quote: "İşe Alımda ve Bordroda Hız Kazanın",
            description:
                "HRSync, işe alım ve bordro süreçlerimizi inanılmaz derecede hızlandırdı.",
            name: "Ayşe K.",
            role: "İK Müdürü",
            avatar: "/testimonials/avatar.png",
        },
        {
            quote: "Verimlilikte Yeni Bir Dönem",
            description:
                "Tüm İK verilerini tek bir platformda toplamak, işimizin verimliliğini artırdı.",
            name: "Mehmet T.",
            role: "CEO",
            avatar: "/testimonials/avatar.png",
        },
        {
            quote: "Performans Yönetiminde Şeffaflık",
            description:
                "Performans değerlendirme süreçleri artık çok daha kolay ve şeffaf.",
            name: "Elif Y.",
            role: "İnsan Kaynakları Uzmanı",
            avatar: "/testimonials/avatar.png",
        },
        {
            quote: "Harika Destek Ekibi",
            description:
                "HRSync her sorunumuza hızlı ve etkili çözümler sundular.",
            name: "Ali D.",
            role: "Operasyon Müdürü",
            avatar: "/testimonials/avatar.png",
        },
        {
            quote: "Zaman Kazandırıyor",
            description:
                "HRSync sayesinde süreçlerimizi optimize ederek büyük ölçüde zaman kazandık. Tavsiye ederim!",
            name: "Zeynep L.",
            role: "İnsan Kaynakları Direktörü",
            avatar: "/testimonials/avatar.png",
        },
    ];

    return (
        <section id="testimonials" className="pb-20 overflow-hidden mt-20 scroll-m-32">
            <div>
                <div className="container mx-auto text-center flex flex-col gap-4 p-8">
                    <div className="mb-4">
                        <div className="inline-block border border-[#00A76F7A] text-[#00A76F] text-sm font-semibold px-4 py-2 rounded-full">
                            Müşteri Görüşleri
                        </div>
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 max-w-xl mx-auto leading-tight mb-3">
                        Müşterilerimiz Ne Diyor?
                    </h2>
                    <h4 className="text-[#637381] text-base leading-relaxed max-w-2xl font-semibold mx-auto mb-10">
                        HRSync ile İK süreçlerini dönüştüren işletmelerin başarı hikayelerini keşfedin.
                    </h4>
                </div>
                <div
                    className="marquee overflow-hidden relative"
                    onMouseEnter={(e) =>
                        e.currentTarget.classList.add("paused")
                    }
                    onMouseLeave={(e) =>
                        e.currentTarget.classList.remove("paused")
                    }
                >
                    <div className="track flex items-center justify-start gap-6 absolute whitespace-nowrap">
                        {fakeTestimonials.concat(fakeTestimonials).map(
                            (testimonial, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white border border-[#EFF0F6] min-w-[400px] max-w-[400px] rounded-xl shadow hover:shadow-lg transition inline-block"
                                >
                                    <blockquote>
                                        <p className="text-lg font-semibold text-gray-900">
                                            “{testimonial.quote}”
                                        </p>
                                        <p className="mt-2 text-gray-500 whitespace-pre-wrap">
                                            {testimonial.description}
                                        </p>
                                    </blockquote>
                                    <div className="mt-4 flex items-center">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                        />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div
                    className="marquees overflow-hidden relative"
                    onMouseEnter={(e) =>
                        e.currentTarget.classList.add("paused")
                    }
                    onMouseLeave={(e) =>
                        e.currentTarget.classList.remove("paused")
                    }
                >
                    <div className="track2 flex items-center justify-start gap-6 absolute whitespace-nowrap">
                        {fakeTestimonials.concat(fakeTestimonials).map(
                            (testimonial, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white border border-[#EFF0F6] min-w-[400px] max-w-[400px] rounded-xl shadow hover:shadow-lg transition inline-block"
                                >
                                    <blockquote>
                                        <p className="text-lg font-semibold text-gray-900">
                                            “{testimonial.quote}”
                                        </p>
                                        <p className="mt-2 text-gray-500 whitespace-pre-wrap">
                                            {testimonial.description}
                                        </p>
                                    </blockquote>
                                    <div className="mt-4 flex items-center">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                        />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;