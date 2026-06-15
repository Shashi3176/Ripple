import { Box, Text, Heading, Container, Divider, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const TermsOfServicePage = () => {
  return (
    <Box minH="100vh" bg="var(--lp-bg-secondary)" py={16}>
      <Container maxW="3xl">
        <Box bg="white" borderRadius="20px" p={{ base: 6, md: 12 }} boxShadow="lg">
          <Heading as="h1" size="xl" mb={2}>Terms of Service</Heading>
          <Text color="gray.500" mb={8}>Last updated: June 2026</Text>
          <Divider mb={8} />

          <Heading as="h2" size="md" mt={6} mb={3}>1. Acceptance of Terms</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            By accessing or using Ripple, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>2. Use of Service</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            Ripple is intended for users 13 years of age and older. You are responsible for all content you post and your interactions with other users.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>3. Prohibited Conduct</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            Harassment, hate speech, explicit content, spam, and illegal activities are strictly prohibited. Our AI moderation system and human moderators enforce these rules.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>4. Account Termination</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>5. Disclaimer</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            The service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.
          </Text>

          <Heading as="h2" size="md" mt={6} mb={3}>6. Contact Us</Heading>
          <Text color="gray.600" lineHeight="1.8" mb={4}>
            For questions about these terms, please contact us at{" "}
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

export default TermsOfServicePage;
