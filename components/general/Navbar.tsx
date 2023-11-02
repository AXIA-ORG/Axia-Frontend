import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
interface Props {
  children: React.ReactNode;
}

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Nav() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isConnected, isDisconnected } = useAccount();
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/eng_flag.png");

  useEffect(() => {
    if (isConnected) setLoaded(true);
    if (isDisconnected) setLoaded(false);
  }, [isConnected, isDisconnected]);

  useEffect(() => {
    setImageSrc(
      i18n.language === "en" ? "/images/eng_flag.png" : "/images/esp_flag.png"
    );
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Image src={"/images/logo.png"} maxH={'100px'}  alt="Logo" mt={4} />
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                {loaded && <ConnectButton />}
                <Button
                  px={8}
                  bg={useColorModeValue("#1b5a9e", "#1b5a9e")}
                  color={"white"}
                  rounded={"md"}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  onClick={() => router.push("/dashboard")}
                >
                  Connect
                </Button>
                {loaded && (
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                )}
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton as={Button}>
                  <Image
                    src={imageSrc}
                    alt={"lang flag"}
                    boxSize="30px" // Ajusta el tamaño según prefieras
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => changeLanguage("en")}>
                    English
                  </MenuItem>
                  <MenuItem onClick={() => changeLanguage("es")}>
                    Español
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
