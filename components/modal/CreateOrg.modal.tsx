import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
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
} from "@chakra-ui/react";
import { storage } from "../../firebase.config";
import {
  ref as fireRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CREATE_ORGANIZATION } from "../../graphql/createOrganization.graphql";

type CreateOrganizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const toast = useToast()
  const router = useRouter()
  const [createOrganization, { data, error }] =
    useMutation(CREATE_ORGANIZATION)
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [newOrgId, setNewOrgId] = useState<string>("")
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [created, setCreated] = useState<boolean>(false)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile: File | null = e.target.files ? e.target.files[0] : null
    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"]
      if (selectedFile && !validImageTypes.includes(selectedFile.type)) {
        alert("Please select a valid image type (jpg, png, gif).")
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      let fileURL: string | null = null;
      if (file) {
        const fileRef = fireRef(storage, file?.name);
        await uploadBytesResumable(fileRef, file);
        fileURL = await getDownloadURL(fileRef);
      }
      const response = await createOrganization({
        variables: {
          createOrganizationInput: {
            name: name,
            description: description,
            img: fileURL,
          },
        },
      });
      setNewOrgId(response.data.createOrganization.id);
      setCreated(true);
      toast({
        title: "Organization created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating organization, please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const visitOrg = () => {
    if(!newOrgId) {
      setCreated(false)
      onClose()
    }
    router.push(`dashboard?id=${newOrgId}`);
  };
  if (created) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>
            {t("myOrganizations.create_organization.title")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Organization created successfully</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={visitOrg}>
              {t("myOrganizations.create_organization.visit")}
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {t("myOrganizations.create_organization.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>
          {t("myOrganizations.create_organization.title")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>
              {t("myOrganizations.create_organization.name")}
            </FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
					    disabled={loading}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>
              {t("myOrganizations.create_organization.description")}
            </FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </FormControl>
          <FormControl mb={4} alignItems="center" justifyContent="center">
            <FormLabel>
              {t("myOrganizations.create_organization.image")}
            </FormLabel>
            <Input
              type="file"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="fileInput"
            />
            <Button as="label" htmlFor="fileInput" colorScheme="cyan">
              {file ? file.name : t("myOrganizations.create_organization.pickImage")}
            </Button>
            {image && (
              <Image
                src={image}
                alt="Organization"
                boxSize="100px"
                borderRadius="full"
                mt={4}
                mx="auto"
              />
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
            {t("myOrganizations.create_organization.create")}
          </Button>
          <Button onClick={onClose}>
            {t("myOrganizations.create_organization.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateOrganizationModal;
