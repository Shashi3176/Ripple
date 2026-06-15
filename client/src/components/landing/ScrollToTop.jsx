import { Box, Button, useColorMode, IconButton } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp, FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Box className="lp-scroll-to-top">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Box className="lp-scroll-actions">              
              <motion.button
                className="lp-scroll-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowUp />
              </motion.button>
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
