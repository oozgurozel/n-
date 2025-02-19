const Lawyers = () => {
    const lawyers = [
      { name: "Erdoğan Sapanoğlu", img: "./acı.webp.png" },
      { name: "Arda Can Çeken", img: "./arda.webp.png" },
      { name: "Merve Öztürkçü Gümüş", img: "./merve.webp.png" },
      { name: "Esma Betül Herdem", img: "./ESMA.jpg" },
    ];
  
    return (
      <div className="flex flex-col items-center p-8 my-8">
        <h2 className="text-[#DAC5A7] text-3xl font-satoshi mt-12">Avukatlarımız</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {lawyers.map((lawyer, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[rgba(218,197,167,0.15)] p-6 w-[280px] max-w-full border-2 border-[#DAC5A726]"
            >
              <img src={lawyer.img} alt={lawyer.name} className="w-full h-auto" />
              <p className="text-[#DAC5A7] mt-5 text-center text-lg">{lawyer.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Lawyers;