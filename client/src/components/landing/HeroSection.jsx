import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);

const HeroSection = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box id="home" className="lp-hero">
      <Box className="lp-hero-container">
        <MotionBox
          className="lp-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionText
            className="lp-hero-title"
            variants={itemVariants}
          >
            Connect Anonymously, Chat Freely
          </MotionText>
          <MotionText
            className="lp-hero-subtitle"
            variants={itemVariants}
          >
            Join thousands in anonymous conversations. No profiles, no judgment, 
            just genuine connections.
          </MotionText>
          <MotionBox
            className="lp-hero-buttons"
            variants={itemVariants}
          >
            <motion.button
              className="lp-btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                Start Chatting Now
              </Link>
            </motion.button>
            <motion.button
              className="lp-btn-secondary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToFeatures}
            >
              Learn More
            </motion.button>
          </MotionBox>
        </MotionBox>

        <MotionBox
          className="lp-hero-image"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <svg
            className="lp-hero-illustration"
            viewBox="0 0 500 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="250" cy="200" r="150" fill="url(#gradient1)" opacity="0.1" />
            <defs>
              <linearGradient id="gradient1" x1="100" y1="100" x2="400" y2="300">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <path
              d="M180 150 L320 150 L320 250 L180 250 Z"
              fill="#6366f1"
              opacity="0.2"
              rx="12"
            />
            <path
              d="M220 170 L280 170"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M220 190 L280 190"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M220 210 L280 210"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M220 230 L280 230"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M140 280 L360 280 L360 320 L140 320 Z"
              fill="#0ea5e9"
              opacity="0.2"
              rx="12"
            />
            <path
              d="M180 300 L320 300"
              stroke="#0ea5e9"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="120" cy="120" r="20" fill="#8b5cf6" opacity="0.3" />
            <circle cx="380" cy="280" r="25" fill="#8b5cf6" opacity="0.2" />
            <circle cx="100" cy="300" r="15" fill="#0ea5e9" opacity="0.2" />
          </svg>
        </MotionBox>
      </Box>
    </Box>
  );
};

export default HeroSection;