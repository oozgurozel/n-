import React from "react";

const BlogPosts = () => {
    const blogPosts = [
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
              image: "/testimonials/blok.png",
        },
          {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
              image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
        {
            date: "23.01.2023",
            title: "Çifte Vatandaşlık",
            description:
                "Vatandaşlık Nedir? Vatandaşlık, bir ülkenin vatandaşı olarak, o ülkenin yasalarına ve örf ve adetlerine uymak, haklarını ve...",
            category: "BRANDING",
           image: "/testimonials/blok.png",
        },
    ];

    return (
       <section className="bg-black text-[#DAC5A726] py-20 relative">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-[#DAC5A7]">

                </h2>
                <div className="flex items-center gap-1 text-[#DAC5A7] font-bold">
                    <p></p>
                </div>
            </div>
                <div className="flex flex-wrap justify-center gap-8 ">
                    {blogPosts.map((post, index) => (
                        <div
                            key={index}
                            className="rounded-md border border-[#DAC5A726] max-w-md  transition-all duration-300 hover:shadow-lg hover:border-[#DAC5A750] group"
                            style={{ backgroundColor: 'rgba(218, 197, 167, 0.15)', padding: '40px 10' }} 
                        >
                            <div className="relative">
                                 <img
                                    src={post.image}
                                    alt="Blog Post Image"
                                     className="w-full object-cover rounded-t-md  "
                                     style={{height: "200px"}}
                                />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#DAC5A726] w-12 h-12 flex items-center justify-center group-hover:bg-[#DAC5A726] transition-transform duration-300  group-hover:rotate-[45deg] ">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.0003 4.83337L16.167 10L11.0003 15.1667" stroke="#DAC5A7" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16.167 10H4.00033" stroke="#DAC5A7" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-[#B99671] mb-2">{post.date}</p>
                                <h3 className="text-xl font-semibold text-[#DAC5A7] mb-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-[#B99671] mb-4">
                                    {post.description}
                                </p>
                                <button className="text-xs text-[#DAC5A7] border border-[#DAC5A726] py-1 px-3 rounded-md ">
                                    {post.category}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                  <div className="flex justify-center mt-12">
                    <button className="flex items-center gap-1 text-[#DAC5A7] font-bold">
                    </button>
                 </div>
            </div>
            <footer
    className="absolute bottom-0 w-full overflow-hidden border-t border-b border-[#B99671] py-4"
    style={{ backgroundColor: 'rgba(218, 197, 167, 0.15)' }}
>
    <div className="flex animate-marquee w-full">
        {[...Array(20)].map((_, index) => (
            <span key={index} className="whitespace-nowrap text-sm uppercase tracking-widest mx-2" style={{ color: '#B99671' }}>
                Çeken Hukuk <span className="mx-2">+++ </span>
            </span>
        ))}
    </div>
</footer>
        </section>

    );
};

export default BlogPosts;