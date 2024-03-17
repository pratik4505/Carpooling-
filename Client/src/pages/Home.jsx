import React from "react";
import Hero from "../components/Home/Hero";
import About from "../components/Home/About";
import Footer from "../components/Home/Footer";
import Services from "../components/Home/Services";
import ContactForm from "../components/Home/ContactForm";
import FAQ from "../components/Home/FAQ";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
}
