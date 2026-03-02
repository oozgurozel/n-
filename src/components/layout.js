import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }) {
    return (
        <>
            {/* Header buraya gelebilir, eğer import ettiysen ekleyebilirsin: <Header /> */}
            
            <main>
                {children}
            </main>

            {/* Footer buraya gelebilir, eğer import ettiysen ekleyebilirsin: <Footer /> */}
        </>
    );
}