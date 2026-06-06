import Footer from "@/components/common/Footer";
import EnquiryEntry from "@/components/enquiry/EnquiryEntry";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="site-page">
      <HeroSection />
      <Footer />
      <EnquiryEntry />
    </main>
  );
}
