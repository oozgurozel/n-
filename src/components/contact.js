import React, { useState } from "react";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const createMailtoLink = () => {
        const mailto =
            `mailto:your-email@example.com` +
            `?subject=${encodeURIComponent(formData.subject)}` +
            `&body=${encodeURIComponent(
                `Ad Soyad: ${formData.name}\nEmail: ${formData.email}\n\nMesaj: ${formData.message}`
            )}`;
        return mailto;
    };

    return (
        <section id="contact" className="bg-contact-background bg-no-repeat bg-cover bg-white scroll-m-28">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="container mx-auto text-center flex flex-col gap-4 p-8">
                    <div className="mb-4">
                        <div className="inline-block border border-[#00A76F7A] text-[#00A76F] text-sm font-semibold px-4 py-2 rounded-full">
                            İletişim
                        </div>
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 max-w-2xl mx-auto leading-tight">
                        Bize Ulaşın, İK Çözümleriniz İçin İlk Adımı Atın
                    </h2>
                </div>
                <form className="mt-8 space-y-8">
                    <div className="grid grid-cols-1 gap-y-8">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ad Soyad*"
                            required
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#007867] focus:border-[#007867]"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email*"
                            required
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#007867] focus:border-[#007867]"
                        />
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Konu*"
                            required
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#007867] focus:border-[#007867]"
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Mesajınız*"
                            rows="4"
                            required
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-[#007867] focus:border-[#007867]"
                        ></textarea>
                    </div>
                    <a
                        href={createMailtoLink()}
                        className="block w-full text-center bg-[#007867] text-white font-semibold py-3 px-4 rounded-lg shadow hover:bg-[#007867] transition duration-300"
                    >
                        Gönder
                    </a>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;