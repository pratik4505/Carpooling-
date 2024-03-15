import React from "react";
import Hero from "../components/Home/Hero";
import AboutUs from "../components/Home/AboutUs";
import Footer from "../components/Home/Footer";
import Services from "../components/Home/Services";
import ContactForm from "../components/Home/ContactForm";
import FAQ from "../components/Home/FAQ";

export default function Home() {
  return (
    <div>
      <Hero />
      {/* <AboutUs /> */}
      <Services />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
}
