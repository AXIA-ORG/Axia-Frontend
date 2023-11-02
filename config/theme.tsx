import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    ModalContent: {
      baseStyle: {
        borderRadius: "40px", // Rounded borders
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "25px", // Rounded borders for the button
      },
    },
    Input : {
      baseStyle: {
        borderRadius: "25px", // Rounded borders for the button
      },
    }
  },
  styles: {
    global: (props : { colorMode: string; }) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "white",
      },
    })
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  }
});