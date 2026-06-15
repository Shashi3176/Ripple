import { Box, Text, Heading, Container, Divider, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <Box minH="100vh" bg="var(--lp-bg-secondary)" py={16}>
      <Container maxW="3xl">
        <Box bg="white" borderRadius="20px" p={{ base: 6, md: 12 }} boxShadow="lg">
          <Heading as="h1" size="xl" mb={2}>Privacy Policy</Heading>
          <Text color="gray.500" mb={8}>Last updated: June 2026</Text>
          <Divider mb={8} />

          <Heading as="h2" size="md" mt={6} mb={3}>1. Introduction</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            Ripple ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our anonymous chat service.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>2. Information We Collect</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            We collect minimal information necessary to provide our service: your email address for account creation, and chat messages which are temporarily stored and automatically deleted after 2 hours. We do not collect real names, phone numbers, or other personal identifiers.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>3. How We Use Your Information</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            Your information is used solely to provide and improve the chat service. We use AI-powered moderation to maintain a safe environment. We never sell or share your personal data with third parties.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>4. Data Retention</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            All chat rooms and messages automatically expire after 2 hours. Account data is retained until you request deletion.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>5. Contact Us</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            For privacy-related inquiries, please contact us at{" "}
            <ChakraLink as="a" href="mailto:support@ripple.com" color="blue.500">
              support@ripple.com
            </ChakraLink>
            .
          </Text>

          <Box mt={10}>
            <Link to="/">
              <ChakraLink as="span" color="blue.500" fontWeight="600" cursor="pointer">
                ← Back to Home
              </ChakraLink>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
