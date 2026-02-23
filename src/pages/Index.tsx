import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Products from "@/components/Products";
import PriceSimulator from "@/components/PriceSimulator";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Products />
        <PriceSimulator />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

    </div>
  );
};

export default Index;
