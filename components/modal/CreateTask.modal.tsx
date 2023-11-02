import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import DatePicker from "react-datepicker";
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
  useToast,
  Text,
  Box,
  useColorModeValue,
  Select,
  Flex,
  Heading,
  IconButton,
  Badge,
  Image
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { CREATE_TASK } from "../../graphql/createTask.graphql";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
type CreateOrganizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  orgId: string;
  onComplete: () => void;
  fieldsBase: string[];
};

const CreateTaskModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  category,
  orgId,
  onComplete,
  fieldsBase,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [createBaseTask, { data, error }] = useMutation(CREATE_TASK);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [prioritySelected, setPrioritySelected] = useState<string>("Medium");
  const [bgColor1, setBgColor1] = useState(useColorModeValue("gray.300", "gray.700"));
  const [bgColor2, setBgColor2] = useState(useColorModeValue("gray.200", "gray.500"));
  const [bgColor3, setBgColor3] = useState(useColorModeValue("gray.100", "gray.600"));
  const [value, setValue] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  );
  useEffect(() => {
    if (fieldsBase.includes(category)) {
      setCategorySelected(category);
    } else if (fieldsBase.length > 0) {
      setCategorySelected(fieldsBase[0]);
    }
  }, [fieldsBase, category]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(e.target.value) < 0) return setValue(0);
    else if (e.target.value === "") setValue(0);
    else if (parseFloat(e.target.value) > 10) return setValue(10);
    else setValue(parseFloat(e.target.value));
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (title === "" || description === "" || value <= 0) {
        toast({
          title: t("dashboard.createTask.error.fillAllFields"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      } else if (startDate < new Date(Date.now() + 12 * 60 * 60 * 1000)) {
        toast({
          title: t("dashboard.createTask.error.fillAllFields"),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      } else {
        await createBaseTask({
          variables: {
            createBaseTaskInput: {
              title: title,
              description: description,
              category: categorySelected,
              value: value,
              createdAt: new Date(),
              organizationId: orgId,
              priority: prioritySelected.toLowerCase(),
            },
          },
        });
        setCreated(true);
        toast({
          title: t("dashboard.createTask.createdSuccessfully"),
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: t("dashboard.createTask.error.errorCreatingTask"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleReset = () => {
    restoreAll();
    onClose();
  };
  const handleComplete = () => {
    setLoadingComplete(true);
    restoreAll();
    onComplete();
  };
  const restoreAll = () => {
    setTitle("");
    setDescription("");
    setValue(1);
    setStartDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));
    setLoading(false);
    setCreated(false);
  };
  const getImage = (priority: string) => {
    if (priority === "Low") return "/images/LevelMin.png";
    if (priority === "Medium") return "/images/LevelMid.png";
    if (priority === "High") return "/images/LevelMax.png";
  };
  if (created) {
    return (
      <Modal isOpen={isOpen} onClose={handleComplete}>
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
            <Text>{t("dashboard.createTask.createdSuccessfully")}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              onClick={handleComplete}
              isLoading={loadingComplete}
            >
              {t("dashboard.createTask.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleReset} size={"2xl"}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>
          <Heading
            fontSize={{ base: "lg", sm: "md", md: "2xl" }}
            fontWeight="bold"
            bgGradient="linear(to-l, gray, gray)"
            bgClip="text"
          >
            {"+ "}
            {t("dashboard.createTask.modalTitle")}
          </Heading>
          <Flex mt={2}>
            <Badge
              w={"25%"}
              colorScheme="purple"
              mr={2}
              fontSize={15}
              rounded={"full"}
              padding={1}
              textAlign={"center"}
            >
              {categorySelected}
            </Badge>
            <Badge
              w={"25%"}
              colorScheme="purple"
              mr={2}
              fontSize={15}
              rounded={"full"}
              padding={1}
              textAlign={"center"}
            >
              {`${value} Points`}
            </Badge>
            <Image
              src={getImage(prioritySelected)}
              alt="Level"
              boxSize="100px"
              maxW={"40px"}
              maxH={"30px"}
            />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="row">
            <Box flex="3">
              <FormControl mb={4}>
                <FormLabel>{t("dashboard.createTask.title")}</FormLabel>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  maxLength={50}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>{t("dashboard.createTask.description")}</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  maxLength={254}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>{t("dashboard.createTask.value")}</FormLabel>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => handleValueChange(e)}
                  disabled={loading}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>{t("dashboard.createTask.dueDate")}</FormLabel>
                <Box
                  border="1px solid"
                  borderColor={bgColor1}
                  p={2}
                  borderRadius="md"
                  w="100%"
                >
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date as Date);
                    }}
                    calendarClassName="date-picker-calendar"
                    wrapperClassName="date-picker-wrapper"
                  />
                </Box>
              </FormControl>
            </Box>

            <Box flex="1" ml={7}>
              <Flex align="center" justify="space-between" w={"100%"}>
                <Heading
                  fontSize={{ base: "md", sm: "sm", md: "md" }}
                  fontWeight="bold"
                  bgGradient="linear(to-l, #3107DA, #5E39F1)"
                  bgClip="text"
                >
                  {t("dashboard.createTask.category")}
                </Heading>
                <IconButton
                  ml={0}
                  aria-label="Toggle organizations"
                  icon={showCategories ? <FiChevronUp /> : <FiChevronDown />}
                  onClick={() => setShowCategories(!showCategories)}
                />
              </Flex>
              {showCategories &&
                fieldsBase.map((category, index) => (
                  <Box
                    key={index}
                    _hover={{
                      bgColor: bgColor2,
                    }}
                    cursor={"pointer"}
                    color={"gray.400"}
                    rounded={"md"}
                    bgColor={
                      category === categorySelected
                        ? bgColor3
                        : "transparent"
                    }
                    onClick={() => setCategorySelected(category)}
                  >
                    {category}
                  </Box>
                ))}

              <Flex align="center" justify="space-between" w={"100%"}>
                <Heading
                  fontSize={{ base: "md", sm: "sm", md: "md" }}
                  fontWeight="bold"
                  bgGradient="linear(to-l, #3107DA, #5E39F1)"
                  bgClip="text"
                >
                  Priority
                </Heading>
                <IconButton
                  ml={0}
                  aria-label="Toggle organizations"
                  icon={showCategories ? <FiChevronUp /> : <FiChevronDown />}
                  onClick={() => setShowCategories(!showCategories)}
                />
              </Flex>
              <Box
                _hover={{
                  bgColor: bgColor2,
                }}
                cursor={"pointer"}
                color={"gray.400"}
                rounded={"md"}
                bgColor={
                  "High" === prioritySelected
                    ? bgColor3
                    : "transparent"
                }
                onClick={() => setPrioritySelected("High")}
              >
                High
              </Box>
              <Box
                _hover={{
                  bgColor: bgColor2,
                }}
                cursor={"pointer"}
                color={"gray.400"}
                rounded={"md"}
                bgColor={
                  "Medium" === prioritySelected
                    ? bgColor3
                    : "transparent"
                }
                onClick={() => setPrioritySelected("Medium")}
              >
                Medium
              </Box>
              <Box
                _hover={{
                  bgColor: bgColor2,
                }}
                cursor={"pointer"}
                color={"gray.400"}
                rounded={"md"}
                bgColor={
                  "Low" === prioritySelected
                    ? bgColor3
                    : "transparent"
                }
                onClick={() => setPrioritySelected("Low")}
              >
                Low
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            {t("dashboard.createTask.create")}
          </Button>
          <Button onClick={handleReset}>
            {t("dashboard.createTask.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTaskModal;
