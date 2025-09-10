import React from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#0C0F16] text-[#EAEAEA] overflow-x-hidden">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        {/* Temporarily commenting out problematic sections */}
        {/* <AboutSection />
        <BlogSection />
        <BookingSection />
        <ContactSection /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;

