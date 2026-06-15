import { Box, Text, Heading, Container, Divider, Link as ChakraLink, Grid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaShieldAlt, FaBan, FaFlag, FaGavel, FaEnvelope } from "react-icons/fa";

const MotionBox = motion(Box);

const guidelines = [
  {
    icon: <FaHeart />,
    title: "Be Respectful",
    description: "Treat others as you would like to be treated. Harassment, bullying, and personal attacks are not tolerated. Everyone deserves a safe and welcoming environment.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Stay Safe",
    description: "Do not share personal information such as your real name, address, phone number, or financial details. Remember: you are anonymous by design.",
  },
  {
    icon: <FaBan />,
    title: "No Inappropriate Content",
    description: "Explicit, violent, or illegal content is strictly prohibited. Our AI moderation system actively filters and flags violations to keep the community clean.",
  },
  {
    icon: <FaFlag />,
    title: "Use the Report Feature",
    description: "If you encounter behavior that violates these guidelines, use the report feature. Our moderation team reviews all reports promptly and takes appropriate action.",
  },
  {
    icon: <FaGavel />,
    title: "Consequences",
    description: "Violations may result in warnings, temporary bans, or permanent account suspension, depending on severity. Repeated violations lead to stricter penalties.",
  },
  {
    icon: <FaEnvelope />,
    title: "Contact Us",
    description: "For questions about these guidelines, please contact us at ",
    isContact: true,
  },
];

const CommunityGuidelinesPage = () => {
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
    <Box minH="100vh" bg="var(--lp-bg-secondary)" py={16}>
      <Container maxW="4xl">
        <MotionBox
          bg="white"
          borderRadius="20px"
          p={{ base: 6, md: 12 }}
          boxShadow="xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Box textAlign="center" mb={8}>
            <Heading as="h1" size="2xl" mb={3} bgGradient="linear(135deg, var(--lp-primary), var(--lp-accent))" bgClip="text">
              Community Guidelines
            </Heading>
            <Text color="gray.500" fontSize="lg">Last updated: June 2026</Text>
          </Box>
          <Divider mb={10} />

          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              {guidelines.map((item, index) => (
                <MotionBox
                  key={index}
                  className="lp-feature-card"
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Box className="lp-feature-icon">
                    {item.icon}
                  </Box>
                  <Heading as="h2" size="md" mt={2} mb={3} color="var(--lp-text-primary)">
                    {item.title}
                  </Heading>
                  {item.isContact ? (
                    <Text color="gray.600" lineHeight="1.8">
                      {item.description}
                      <ChakraLink as="a" href="mailto:shashankssgm@gmail.com" color="blue.500" fontWeight="600">
                        shashankssgm@gmil.com
                      </ChakraLink>
                    </Text>
                  ) : (
                    <Text color="gray.600" lineHeight="1.8">{item.description}</Text>
                  )}
                </MotionBox>
              ))}
            </Grid>
          </MotionBox>

          <Box mt={12} textAlign="center">
            <Link to="/">
              <ChakraLink as="span" color="blue.500" fontWeight="600" cursor="pointer" fontSize="lg">
                ← Back to Home
              </ChakraLink>
            </Link>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default CommunityGuidelinesPage;
