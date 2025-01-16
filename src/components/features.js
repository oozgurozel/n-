export default function AboutUs() {
    return (
        <section id="about-us" className="relative bg-black text-[#B99671] py-24 scroll-mt-24">
            <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 lg:px-16">
             
                <div className="flex-1">
                    <img
                        src="/cekennofis.png" 
                        alt="Çeken Hukuk Ofisi"
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                <div
                    className="flex-1 p-12 shadow-lg"
                    style={{
                        backgroundColor: 'rgba(218, 197, 167, 0.15)', 
                        borderRadius: '0px', 
                        minHeight: '969px', 
                        maxWidth: '2000px', 
                    }}
                >
                    <h2 className="text-4xl font-Gambetta mb-6">Hakkımızda</h2>
                    <p className="text-lg leading-relaxed" style={{ lineHeight: '2.1' }}>
                        Çeken Hukuk Bürosu 2019 yılında Ankara’da kurulmuştur. Çeken Hukuk Bürosu bünyesinde
                        konusunda uzman avukatlardan kurulu bir hukuk ve danışmanlık bürosu olarak
                        faaliyetlerine devam etmektedir.
                    </p>
                    <p className="text-lg leading-relaxed mt-6" style={{ lineHeight: '2.1' }}>
                        Çeken Hukuk Bürosu hukukun her alanında Türk, yabancı ve çok uluslu gerçek ve tüzel kişi
                        müvekkillerine başarıyla hukuki danışmanlık hizmetleri vermekte ve müvekkillerini ulusal ve
                        uluslararası alanlarda başarıyla temsil etmektedir.
                    </p>
                    <p className="text-lg leading-relaxed mt-6" style={{ lineHeight: '2.1' }}>
                        Hukuk Büromuz hukukun her alanında faaliyet göstermekte birlikte ağırlıklı olarak faaliyet
                        gösterdiği Deniz Hukuku, İcra ve İflas Hukuku, Ticaret Hukuku, Şirketler Hukuku, İş Hukuku,
                        Borçlar Hukuku, Basın Hukuku, Medeni Hukuk, Eşya Hukuku, İdare Hukuku, Vergi Hukuku,
                        Ceza Hukuku alanlarında bu alan üzerine yoğunlaşmış avukat ve akademisyenlerin
                        yönetiminde kurduğu ihtisas departmanları ile müvekkillerine üst düzeyde ve nitelikli
                        avukatlık hizmetleri vermektedir.
                    </p>
                </div>
            </div>
        </section>
    );
}
