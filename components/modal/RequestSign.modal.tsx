import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export function RequestSignModal() {
  const { t } = useTranslation();
  return (
    <Modal isCentered isOpen={true} onClose={() => {}}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent borderRadius={"20px"}>
        <ModalHeader textAlign="center" fontSize={"2xl"}>
          {t("signUp.sign_message")}
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}
