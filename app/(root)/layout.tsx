import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <main className="font-work-sans">
        <Navbar />

        {children}
        <Footer />
    </main>
  );
}