import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="site-page">
      <Navbar />
      <HeroSection />
      <Footer />
    </main>
  );
}