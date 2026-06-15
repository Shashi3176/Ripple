import { extendTheme } from "@chakra-ui/react";

const customTheme = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
      },
      body: {
        overflowX: "hidden",
      },
      ":focus-visible": {
        outline: "2px solid #6366f1",
        outlineOffset: "2px",
      },
    },
  },
  colors: {
    brand: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
  },
};

export default extendTheme(customTheme);
