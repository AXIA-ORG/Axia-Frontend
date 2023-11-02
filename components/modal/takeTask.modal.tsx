import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Image,
  useToast,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
type TakeTaskProps = {
  isOpen: boolean;
  onDone: () => void;
  onClose: () => void;
};
export default function TakeTask({isOpen, onDone, onClose}: TakeTaskProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>
          Take Task
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure about taking this task?</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="purple" mr={3} onClick={onDone}>
            Take
          </Button>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
