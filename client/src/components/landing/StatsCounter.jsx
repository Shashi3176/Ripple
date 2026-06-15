import { useState, useEffect, useRef } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaUsers, FaCommentDots, FaDoorOpen, FaStar } from "react-icons/fa";

const MotionBox = motion(Box);

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
};

const StatItem = ({ icon, value, suffix, label, index }) => {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <MotionBox
      ref={ref}
      className="lp-stat-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Box className="lp-stat-icon">{icon}</Box>
      <Flex className="lp-stat-value" align="baseline" justify="center" gap="2px">
        <Text as="span">{count.toLocaleString()}</Text>
        {suffix && <Text as="span" className="lp-stat-suffix">{suffix}</Text>}
      </Flex>
      <Text className="lp-stat-label">{label}</Text>
    </MotionBox>
  );
};

const stats = [
  {
    icon: <FaUsers />,
    value: 10000,
    suffix: "+",
    label: "Active Users",
  },
  {
    icon: <FaCommentDots />,
    value: 50000,
    suffix: "+",
    label: "Messages Sent Daily",
  },
  {
    icon: <FaDoorOpen />,
    value: 1000,
    suffix: "+",
    label: "Chat Rooms Created",
  },
  {
    icon: <FaStar />,
    value: 4.8,
    suffix: "★",
    label: "Average Rating",
  },
];

const StatsCounter = () => {
  return (
    <Box className="lp-stats lp-section">
      <Box className="lp-section-container">
        <Box className="lp-stats-grid">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StatsCounter;
