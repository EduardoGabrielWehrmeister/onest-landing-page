import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Partners from "@/components/Partners";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Consultancy from "@/components/Consultancy";
import FAQ from "@/components/FAQ";
import Locations from "@/components/Locations";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <Partners />
      <Stats />
      <Testimonials />
      {/* <Consultancy /> */}
      {/* <Locations /> */}
      <Contact />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
