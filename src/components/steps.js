import React from "react";

const Testimonials = () => {
    const fakeTestimonials = [
        {
            quote: "Ceza Hukuku",
            description:
                "Ceza hukuku, işlenen suçların yasal olarak cezalandırılmasıyla ilgilenen bir hukuk dalıdır. Suç işlemekten hüküm giymiş...",
        },
        {
            quote: "Ticaret Hukuku",
            description:
                " Ticaret hukuku, ticaret ilişkileriyle ilgili hukuki kuralların tümünü ifade eder. Ticaret hukuku, ticaret yapılan ülkenin...",
        },
        {
            quote: "Aile ve Kişiler Hukuku",
            description: "Aile hukuku, bireylerin aile yapısıyla ilgili haklarını düzenler.",
        },
        {
            quote: "İcra ve İflas Hukuku",
            description:
                "İcra ve iflas hukuku, Türkiye'de mal varlığın tahsil edilmesi ve borçların kullanılması için kullanılan hukuki verilere verilen isimdir...",
        },
        {
            quote: "İş ve Sosyal Güvenlik Hukuku",
            description:
                "İş ve sosyal güvenlik hukuku, istihdam ve işverenlerin hak ve yükümlülüklerini düzenleyen hukuk dalıdır. Bu alan...",
        },
    ];

    return (
        <section id="testimonials" className="pb-20 overflow-hidden mt-20 scroll-m-32">
            <div
                className="marquee overflow-hidden relative"
                onMouseEnter={(e) => e.currentTarget.classList.add("paused")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("paused")}
            >
                <div className="track flex items-center justify-start gap-6 absolute whitespace-nowrap">
                    {fakeTestimonials.concat(fakeTestimonials).map(
                        (testimonial, index) => (
                            <div
                                key={index}
                                className="p-6 min-w-[400px] max-w-[400px] rounded-xl shadow hover:shadow-lg transition inline-block"
                                style={{
                                    backgroundColor: "#DAC5A726",
                                    border: "2px solid #DAC5A726",
                                    borderRadius: "0",
                                }}
                            >
                                <blockquote>
                                    <p
                                        className="text-lg font-semibold"
                                        style={{
                                            color: "#B99671",
                                        }}
                                    >
                                        “{testimonial.quote}”
                                    </p>
                                    <p
                                        className="mt-2 whitespace-pre-wrap"
                                        style={{
                                            color: "#B99671",
                                        }}
                                    >
                                        {testimonial.description}
                                    </p>
                                </blockquote>
                                <div className="mt-4 flex items-center">
                                    <div className="ml-4">
                                        <p
                                            className="text-sm font-medium"
                                            style={{
                                                color: "#B99671",
                                            }}
                                        >
                                            {testimonial.name}
                                        </p>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: "#B99671",
                                            }}
                                        >
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
                onMouseEnter={(e) => e.currentTarget.classList.add("paused")}
                onMouseLeave={(e) => e.currentTarget.classList.remove("paused")}
            >
                <div className="track2 flex items-center justify-start gap-6 absolute whitespace-nowrap">
                    {fakeTestimonials.concat(fakeTestimonials).map(
                        (testimonial, index) => (
                            <div
                                key={index}
                                className="p-6 min-w-[400px] max-w-[400px] rounded-xl shadow hover:shadow-lg transition inline-block"
                                style={{
                                    backgroundColor: "#DAC5A726",
                                    border: "2px solid #DAC5A726",
                                    borderRadius: "0",
                                }}
                            >
                                <blockquote>
                                    <p
                                        className="text-lg font-semibold"
                                        style={{
                                            color: "#B99671",
                                        }}
                                    >
                                        “{testimonial.quote}”
                                    </p>
                                    <p
                                        className="mt-2 whitespace-pre-wrap"
                                        style={{
                                            color: "#B99671",
                                        }}
                                    >
                                        {testimonial.description}
                                    </p>
                                </blockquote>
                                <div className="mt-4 flex items-center">
                                    <div className="ml-4">
                                        <p
                                            className="text-sm font-medium"
                                            style={{
                                                color: "#B99671",
                                            }}
                                        >
                                            {testimonial.name}
                                        </p>
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: "#B99671",
                                            }}
                                        >
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;