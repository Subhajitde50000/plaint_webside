import SharedNavbar from "@/components/Navbar";
import AICare from "@/components/home/AICare";
import Categories from "@/components/home/Categories";
import Community from "@/components/home/Community";
import Footer from "@/components/home/Footer";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import WhatsAppWidget from "@/components/home/WhatsAppWidget";

export default function Home() {
  return (
    <>
      <SharedNavbar cartCount={3} />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <AICare />
        <Community />
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}

