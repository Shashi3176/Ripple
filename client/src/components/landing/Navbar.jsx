import { useState, useEffect, useCallback } from "react";
import { Box, Button, Text, useColorModeValue } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaBars } from "react-icons/fa";

const MotionBox = motion(Box);

const Navbar = () => {
  const [isSolid, setIsSolid] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [useLocation().pathname]);

  useEffect(() => {
    const handleScroll = () => setIsSolid(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <MotionBox
      className={`lp-navbar ${isSolid ? "solid" : "transparent"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box className="lp-navbar-container">
        <Link to="/" className="lp-logo" style={{ textDecoration: "none" }}>
          Ripple
        </Link>

        <Box className="lp-nav-links">
          <Box className="lp-nav-link" onClick={() => scrollToSection("home")}>Home</Box>
          <Box className="lp-nav-link" onClick={() => scrollToSection("features")}>Features</Box>
          <Box className="lp-nav-link" onClick={() => scrollToSection("how-it-works")}>How It Works</Box>
          <Button as={Link} to="/login" className="lp-btn-primary" size="md">
            Get Started
          </Button>
        </Box>

        <Box display={{ base: "block", md: "none" }}>
          <Button
            as="button"
            className="lp-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            minHeight="48px"
            minWidth="48px"
            p={3}
          >
            {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </Button>
        </Box>
      </Box>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionBox
            className="lp-mobile-menu"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <Box className="lp-mobile-menu-header">
              <Text className="lp-mobile-menu-title">Menu</Text>
              <Button
                as="button"
                className="lp-mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                minHeight="40px"
                minWidth="40px"
                p={2}
              >
                <FaTimes size={20} />
              </Button>
            </Box>
            <Box className="lp-mobile-menu-links">
              <Box className="lp-mobile-nav-link" onClick={() => scrollToSection("home")}>
                Home
              </Box>
              <Box className="lp-mobile-nav-link" onClick={() => scrollToSection("features")}>
                Features
              </Box>
              <Box className="lp-mobile-nav-link" onClick={() => scrollToSection("how-it-works")}>
                How It Works
              </Box>
              <Button as={Link} to="/login" className="lp-btn-primary" size="lg" width="100%" mt={3}>
                Get Started
              </Button>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

export default Navbar;