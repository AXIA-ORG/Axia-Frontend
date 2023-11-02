import React, { useState } from "react";
import { Button, Box, Text, Flex, Center, VStack, Heading,   useColorModeValue, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay,useToast } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useMemo } from "react";
import useGenerateQrCode from "../../hooks/useGenerateQrCode";
import useCheckForResponse from "../../hooks/useVerificationResponse";
import { useQRCode } from "next-qrcode";
import { v4 as uuidv4 } from "uuid";



const VerifierModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    const headingColor = useColorModeValue('#3107DA', 'white');
    const buttonBgColor = useColorModeValue('#3107DA', 'white'); 
    const buttonHoverBgColor = useColorModeValue('#A83BDB', '#A83BDB');

  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const toast = useToast();

  const openVerifier = () => {
    setIsVerifierOpen(true);
  };

  const closeVerifier = () => {
    setIsVerifierOpen(false);
  };


  const sessionId = useMemo(() => uuidv4(), []);
  const { Canvas } = useQRCode();
  const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
  } = useGenerateQrCode(sessionId);

  const { data: verificationResponse } = useCheckForResponse(sessionId, !!qrCode);


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
      <ModalContent borderRadius="20px" alignItems="center">
        <ModalHeader textAlign="center" fontSize="2xl" m={4} color={headingColor}>
          Prove that you are part of this DAO
        </ModalHeader>
        <ModalBody flexDirection="column" alignItems="center" style={{ top: "50%", transform: "translateY(-50%)" }}>
          <Button
            width="240"
            mt={4}
            bg="linear-gradient(#8a46ff,#6e38cc)"
            size="lg"
            color={"white"}
            _hover={{
                bg: "#A83BDB", 
              }}
            onClick={openVerifier}
          >
            Open Verifier
          </Button>
        </ModalBody>
      </ModalContent>

      {isVerifierOpen && (
        <Modal isOpen={isVerifierOpen} onClose={closeVerifier}  closeOnOverlayClick={true}>
          <ModalContent borderRadius="20px"  maxW="70%" p={4} maxH="90%">
            <ModalHeader textAlign="center" fontSize="2xl" color={headingColor}>
              Prove that you are part of this DAO
            </ModalHeader>
            <ModalBody flexDirection="column" alignItems="center">
            <VStack  spacing={2}>
      <Box
        bgGradient="radial(indigo.400, purple.400, pink.400)"
        rounded="full"
        opacity="0.1"
        w="50%"
        h="64"
        pos="absolute"
        blur="3xl"
        top="8"
        left="25%"
        zIndex="-1"
      />

      <Text fontSize="md" maxW="2xl" textAlign="center">
        Scan the QR code below with the Polygon ID app to prove that you are part of this DAO
      </Text>

      {qrCodeError ? (
        <Text className="text-center">
          Something went wrong generating the QR code.
        </Text>
      ) : loadingQrCode ? (
        <Text className="text-center">Loading...</Text>
      ) : (
        <Center>
          <Canvas text={JSON.stringify(qrCode)} options={{ width: 300 }} />
        </Center>
      )}

      <Text  fontSize="md" maxW="xl" textAlign="center">
        Your current status:{" "}
        {verificationResponse ? (
          <span >
            <CheckIcon color="green.400"/> Verified. Redirecting to your Member dashboard...
          </span>
        ) : (
          <span>
            <CloseIcon color="red.400" /> Not verified
          </span>
        )}
      </Text>

      <Heading fontSize="xl" fontWeight="semibold" transition="color" color={headingColor}>
        How can I get a Verified Credential?
      </Heading>

      <Text fontSize="md" maxW="2xl" textAlign="center">
      {"If you haven't received a claim link, please get in touch with your DAO admin.This will allow you to claim your DAO credential, after you get it, you can return to this page to prove your membership."}
      </Text>
      <Text fontSize="sm" maxW="2xl" textAlign="center" fontWeight={"600"}>
        Download the app:
      </Text>

      <VStack spacing={4} >
      <Flex gap={6}>
    <Button
      bg="linear-gradient(#8a46ff,#3107DA)"
      color={"white"}
      _hover={{
        bg: "#3107DA",
      }}
      onClick={() =>
        window.open("https://apps.apple.com/us/app/polygon-id/id1629870183")
      }
    >
      Download for iOS
    </Button>

    <Button
        bg="linear-gradient(#8a46ff,#A83BDB)"
        color={"white"}
        _hover={{
            bg: "#A83BDB",
          }}
      onClick={() =>
        window.open(
          "https://play.google.com/store/apps/details?id=com.polygonid.wallet&pli=1"
        )
      }
    >
      Download for Android
    </Button>
  </Flex>
      </VStack>
    </VStack>
            
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Modal>
  );
};

export default VerifierModal;