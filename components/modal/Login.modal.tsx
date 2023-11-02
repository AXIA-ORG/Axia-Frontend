import { useState } from "react";
import { FaUserNinja, FaUserAstronaut, FaUsers } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Input,
  useToast,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";

interface LoginModalProps {
  isOpen: boolean;
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  nickname: string;
  createUser: () => void;
  signUpStep: number;
  pickRole: (role: string) => void;
  errorCreating: string;
  seterrorCreating: React.Dispatch<React.SetStateAction<string>>;
}

export function LoginModal({
  isOpen,
  setNickname,
  nickname,
  createUser,
  signUpStep,
  pickRole,
  errorCreating,
  seterrorCreating
}: LoginModalProps) {
  const toast = useToast();
  const { t } = useTranslation();
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNickname(value);
    seterrorCreating("")
  };
  const [selectedButton, setSelectedButton] = useState<string>("daoContributor");
  const onContinue = () => {
    if (nickname.length < 3) {
      toast({
        title: "Please input a correct nickname.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      createUser();
    }
  };
  const onContinueRole = () => {
    pickRole(selectedButton);
  };
  if (signUpStep === 0)
    return (
      <Modal isCentered isOpen={isOpen} onClose={() => {}}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent borderRadius={"20px"}>
          <ModalHeader textAlign="center" fontSize={"2xl"} >
            {t("signUp.choose_nickname")}
          </ModalHeader>
          <ModalBody flexDirection="column" alignItems="center" mb={4}>
            <Input
              placeholder="Nickname"
              size="lg"
              mb={4}
              borderRadius="25px"
              bg="linear-gradient(#3107DA,#5b1bcb)"
              onChange={(e) => onChangeInput(e)}
              value={nickname}
            />
            <Button
              width="100%"
              mt={4}
              bg="linear-gradient(#8a46ff,#6e38cc)"
              size="lg"
              onClick={onContinue}
            >
              {t("signUp.continue")}
            </Button>
          </ModalBody>
          {errorCreating !== "" && (
            <Text textAlign="center" whiteSpace="normal" color={'red.700'} mb={4}>
              {errorCreating}
            </Text>
          )}
        </ModalContent>
      </Modal>
    );
  return (
    <Modal isCentered isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent borderRadius={"20px"}>
        <ModalHeader textAlign="center" fontSize={"2xl"}>
          {t("signUp.role_title")}
        </ModalHeader>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={4}
        >
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Button
              borderRadius="full"
              width="80px"
              height="80px"
              onClick={() => {
                setSelectedButton("daoManager");
              }}
              mb={2}
              bg={
                selectedButton === "daoManager"
                  ? "linear-gradient(#8a46ff,#6e38cc)"
                  : "gray.300"
              }
            >
              <Icon as={FaUserNinja} fontSize="2xl" />
            </Button>
            <Text width="100px" textAlign="center" whiteSpace="normal">
              {t("signUp.button_options.dao_manager")}
            </Text>
          </Flex>

          <Flex
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Button
              borderRadius="full"
              width="80px"
              height="80px"
              onClick={() => {
                setSelectedButton("daoContributor");
              }}
              mb={2}
              bg={
                selectedButton === "daoContributor"
                  ? "linear-gradient(#8a46ff,#6e38cc)"
                  : "gray.300"
              }
            >
              <Icon as={FaUserAstronaut} fontSize="2xl" />
            </Button>
            <Text width="100px" textAlign="center" whiteSpace="normal">
              {t("signUp.button_options.dao_contributor")}
            </Text>
          </Flex>
        </Flex>
        <ModalBody flexDirection="column" alignItems="center" mb={4}>
          <Button
            width="100%"
            mt={4}
            bg="linear-gradient(#8a46ff,#6e38cc)"
            size="lg"
            onClick={onContinueRole}
          >
            {t("signUp.continue")}
          </Button>
          <Text mt={2} fontSize="sm" color="gray.200" textAlign={"center"}>
            {'* You can change this later in "My Profile".'}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
