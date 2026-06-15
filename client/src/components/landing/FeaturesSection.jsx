import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaTheaterMasks,
  FaBolt,
  FaLock,
  FaHourglassHalf,
  FaGlobe,
  FaComment,
} from "react-icons/fa";

const MotionBox = motion(Box);

const features = [
  {
    icon: <FaTheaterMasks />,
    title: "100% Anonymous",
    description: "No real names, no profiles. Just you and your unique anonymous identity.",
  },
  {
    icon: <FaBolt />,
    title: "Instant Connections",
    description: "Match with random people instantly or join public chat rooms. Start chatting in seconds.",
  },
  {
    icon: <FaLock />,
    title: "Safe & Moderated",
    description: "AI-powered content moderation keeps conversations respectful and safe for everyone.",
  },
  {
    icon: <FaHourglassHalf />,
    title: "Temporary Rooms",
    description: "All chat rooms expire after 2 hours. Fresh conversations, no digital footprint.",
  },
  {
    icon: <FaGlobe />,
    title: "Public & Private",
    description: "Browse public rooms or get matched with a random stranger for 1-on-1 chat.",
  },
  {
    icon: <FaComment />,
    title: "Real-time Messaging",
    description: "Fast, reliable messaging with typing indicators and instant delivery.",
  },
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <Box id="features" className="lp-features lp-section">
      <Box className="lp-section-container">
        <Text className="lp-section-title">
          Why Choose Ripple?
        </Text>
        <Text className="lp-section-subtitle">
          Experience chat like never before
        </Text>
        
        <MotionBox
          className="lp-features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <MotionBox
              key={index}
              className="lp-feature-card"
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Box className="lp-feature-icon">
                {feature.icon}
              </Box>
              <Text className="lp-feature-title">
                {feature.title}
              </Text>
              <Text className="lp-feature-description">
                {feature.description}
              </Text>
            </MotionBox>
          ))}
        </MotionBox>
      </Box>
    </Box>
  );
};

export default FeaturesSection;