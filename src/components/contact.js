import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createMailtoLink = () => {
    const mailto =
      `mailto:info@cekenhukuk.com` +
      `?subject=Yeni İletişim Formu Gönderisi` +
      `&body=${encodeURIComponent(
        `Ad Soyad: ${formData.name}\nE-posta: ${formData.email}\n\nMesaj: ${formData.message}`
      )}`;
    return mailto;
  };

  return (
    <section
      id="contact"
      className="text-white py-16 flex items-center justify-center"
      style={{ backgroundColor: "#211F1C" }}
    >
      <div className="container mx-auto max-w-5xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col">
          <h2 className="text-4xl font-semibold mb-8 text-[#DAC5A7] text-left">
            Bizimle İletişime Geçin
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="İsim Soyisim"
              required
              className="w-full p-3 bg-[#33302B] border border-[#4D4A45] rounded-sm text-white focus:outline-none focus:border-[#DAC5A7] placeholder:text-[#7C7974]"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta"
              required
              className="w-full p-3 bg-[#33302B] border border-[#4D4A45] rounded-sm text-white focus:outline-none focus:border-[#DAC5A7] placeholder:text-[#7C7974]"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Mesaj"
              rows="4"
              required
              className="w-full p-3 bg-[#33302B] border border-[#4D4A45] rounded-sm text-white focus:outline-none focus:border-[#DAC5A7] placeholder:text-[#7C7974]"
            ></textarea>
            <a
              href={createMailtoLink()}
              className="inline-block py-3 text-center rounded-sm bg-[#B99671] text-white font-bold hover:bg-[#DAC5A7] transition duration-900 border border-[#B99671]"
              style={{ display: "block", width: "100%" }}
            >
              Mesaj Gönder
            </a>
          </form>

          <div className="mt-10 grid grid-cols-1 gap-4">
            <div
              className="flex items-center bg-[#33302B] rounded-sm p-3"
              style={{ gap: "0.5rem" }}
            >
              <div className="rounded-full bg-[#4D4A45] p-1 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.62 10.79C8.06 13.62 10.47 15.98 13.21 17.39L15.17 15.43C15.49 15.11 15.97 15 16.36 15H17C17.55 15 18 15.45 18 16V20C18 20.55 17.55 21 17 21H4C3.45 21 3 20.55 3 20V17C3 16.45 3.45 16 4 16H4.64C5.03 16 5.51 15.89 5.83 15.57L7.8 13.6C7.87 13.54 7.91 13.46 7.91 13.38V10C7.91 9.34 7.41 8.84 6.75 8.84H4C3.45 8.84 3 8.39 3 7.84V4C3 3.45 3.45 3 4 3H7C7.55 3 8 3.45 8 4V7.09C8 7.35 7.9 7.59 7.75 7.74L6.62 10.79ZM6 4.84V7L5.16 7.84H6ZM16.9 19.5V17H16.36L15.64 17.72L16.9 19.5Z"
                    fill="#DAC5A7"
                  />
                </svg>
              </div>
              <span className="text-[#DAC5A7] text-sm">0(312) 472 62 98</span>
            </div>
            <div
              className="flex items-center bg-[#33302B] rounded-sm p-3"
              style={{ gap: "0.5rem" }}
            >
              <div className="rounded-full bg-[#4D4A45] p-1 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    fill="#DAC5A7"
                  />
                  <path
                    d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2ZM12 16C11.1716 16 10.5 15.3284 10.5 14.5C10.5 13.6716 11.1716 13 12 13C12.8284 13 13.5 13.6716 13.5 14.5C13.5 15.3284 12.8284 16 12 16Z"
                    fill="#DAC5A7"
                  />
                </svg>
              </div>
              <span className="text-[#DAC5A7] text-sm">
                Konutkent Mahallesi 3029. Sk. 3/119 Çankaya/ANKARA
              </span>
            </div>
            <div
              className="flex items-center bg-[#33302B] rounded-sm p-3"
              style={{ gap: "0.5rem" }}
            >
              <div className="rounded-full bg-[#4D4A45] p-1 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V8M5 7H19C19.2652 7 19.5196 6.89464 19.7071 6.70711C19.8946 6.51957 20 6.26522 20 6V4C20 3.46957 19.7893 2.96086 19.4142 2.58579C19.0391 2.21071 18.5304 2 18 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V6C4 6.26522 4.10536 6.51957 4.29289 6.70711C4.48036 6.89464 4.73478 7 5 7Z"
                    stroke="#DAC5A7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="text-[#DAC5A7] text-sm"
                style={{ display: "inline-block", width: "100%" }}
              >
                info@cekenhukuk.com
              </span>
            </div>
          </div>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3061.9077971268207!2d32.65382717744589!3d39.87630317153156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d3393383cfe8cf%3A0xfd581d7703b6356d!2sKonutkent%2C%203029.%20Cad.%20No%3A3%20D%3A119%2C%2006810%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1737023923668!5m2!1str!2str"
            width="100%"
            height="623"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;