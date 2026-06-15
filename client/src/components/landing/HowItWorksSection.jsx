import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaUserPlus, FaSearch, FaComment, FaRandom } from "react-icons/fa";

const MotionBox = motion(Box);

const steps = [
  {
    number: "01",
    icon: <FaUserPlus />,
    title: "Create Anonymous Profile",
    description: "Sign up with just email and password. Get assigned a unique anonymous name instantly.",
  },
  {
    number: "02",
    icon: <FaSearch />,
    title: "Find Your Chat",
    description: "Browse public chat rooms or click 'Random Chat' to get matched with a stranger.",
  },
  {
    number: "03",
    icon: <FaComment />,
    title: "Start Chatting",
    description: "Send messages, join conversations, and connect with others completely anonymously.",
  },
  {
    number: "04",
    icon: <FaRandom />,
    title: "Switch Anytime",
    description: "Not feeling the vibe? Find a new chat partner or join a different room with one click.",
  },
];

const StepCard = ({ step, index }) => {
  return (
    <MotionBox
      className="lp-step-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
    >
      <MotionBox
        className="lp-step-number"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.1, type: "spring", stiffness: 200 }}
      >
        {step.number}
      </MotionBox>
      <Box className="lp-step-icon">
        {step.icon}
      </Box>
      <Text className="lp-step-title">
        {step.title}
      </Text>
      <Text className="lp-step-description">
        {step.description}
      </Text>
    </MotionBox>
  );
};

const HowItWorksSection = () => {
  return (
    <Box id="how-it-works" className="lp-how-it-works lp-section">
      <Box className="lp-section-container">
        <Text className="lp-section-title">
          How It Works
        </Text>
        <Text className="lp-section-subtitle">
          Get started in four simple steps.
        </Text>
        
        <Box className="lp-timeline-wrapper">
          <MotionBox
            className="lp-timeline-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          
          <Box className="lp-steps">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HowItWorksSection;