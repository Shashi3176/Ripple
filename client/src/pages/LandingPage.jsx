import { Box } from "@chakra-ui/react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import StatsCounter from "../components/landing/StatsCounter";
import CallToActionSection from "../components/landing/CallToActionSection";
import Footer from "../components/landing/Footer";

import "../Pages/landing.css";

import SkipToContent from "../components/landing/SkipToContent";
import ScrollToTop from "../components/landing/ScrollToTop";

const LandingPage = () => {
  return (
    <>
      <SkipToContent />
      <Box minH="100vh" bg="white" overflowX="hidden">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          {/* <StatsCounter /> */}
          <CallToActionSection />
        </main>
        <Footer />
      </Box>
      <ScrollToTop />
    </>
  );
};

export default LandingPage;
