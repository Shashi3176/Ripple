import { Box, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaDiscord,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

const MotionBox = motion(Box);

const socialLinks = [
  { icon: <FaGithub />, href: "https://github.com/Shashi3176", label: "GitHub" },
  { icon: <FaEnvelope />, href: "mailto:shashankssgm@gmail.com", label: "Email" },
];

const Footer = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box className="lp-footer">
      <Box className="lp-footer-container">
        <Box className="lp-footer-top">
          <Box className="lp-footer-brand">
            <Text className="lp-footer-logo">Ripple</Text>
            <Text className="lp-footer-description">
              Anonymous chat for genuine connections. No profiles, no judgment—just real conversations.
            </Text>
            <Flex className="lp-footer-social">
              {socialLinks.map((link, i) => (
                <Box
                  key={i}
                  as="a"
                  href={link.href}
                  aria-label={link.label}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                >
                  {link.icon}
                </Box>
              ))}
            </Flex>
          </Box>

          <Box>
            <Text className="lp-footer-heading">Product</Text>
            <Box className="lp-footer-links">
              <Box
                as="a"
                href="#features"
                className="lp-footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("features");
                }}
              >
                Features
              </Box>
              <Box
                as="a"
                href="#how-it-works"
                className="lp-footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("how-it-works");
                }}
              >
                How It Works
              </Box>
              <Link to="/guidelines" className="lp-footer-link">
                Community Guidelines
              </Link>              
            </Box>
          </Box>

          <Box>
            <Text className="lp-footer-heading">Get Started</Text>
            <Box className="lp-footer-links">
              <Link to="/login" className="lp-footer-link">
                Sign Up
              </Link>
              <Link to="/chats" className="lp-footer-link">
                Browse Rooms
              </Link>
              <Link to="/random-chat" className="lp-footer-link">
                Random Chat
              </Link>
            </Box>
          </Box>          
        </Box>

        <Box className="lp-footer-bottom">          
          <Text className="lp-footer-tagline">
            Made with ❤️ for anonymous chatters
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
