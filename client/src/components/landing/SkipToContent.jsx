import { Link as ChakraLink } from "@chakra-ui/react";

const SkipToContent = () => {
  return (
    <ChakraLink
      as="a"
      href="#main-content"
      className="lp-skip-link"
    >
      Skip to main content
    </ChakraLink>
  );
};

export default SkipToContent;
