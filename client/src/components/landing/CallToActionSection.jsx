import { Box, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const CallToActionSection = () => {
  return (
    <Box className="lp-cta">
      <MotionBox
        className="lp-cta-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >      
        <Text className="lp-cta-title">
          Ready to Start Your Anonymous Journey?
        </Text>
        <Text className="lp-cta-subtitle">
          Join users having genuine conversations every day
        </Text>

        <motion.button
          className="lp-cta-button"
          whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)" }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
            Get Started Free
          </Link>
        </motion.button>

      </MotionBox>
    </Box>
  );
};

export default CallToActionSection;
