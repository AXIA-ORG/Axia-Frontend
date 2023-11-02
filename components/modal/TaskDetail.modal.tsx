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
  Image,
  Tooltip,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { CREATE_TASK } from "../../graphql/createTask.graphql";
import { FiChevronDown, FiChevronUp, FiAlertTriangle } from "react-icons/fi";
import { TaskModel } from "../../models/taskModel";
type TaksDetailProps = {
  task: TaskModel;
  isOpen: boolean;
  onClose: () => void;
  category: string;
  orgId: string;
  onComplete: () => void;
};

const TaskDetail: React.FC<TaksDetailProps> = ({
  task,
  isOpen,
  onClose,
  category,
  orgId,
  onComplete,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [createBaseTask, { data, error }] = useMutation(CREATE_TASK);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [prioritySelected, setPrioritySelected] = useState<string>("Medium");
  const [value, setValue] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  );

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
    if (priority === "low") return "/images/LevelMin.png";
    if (priority === "medium") return "/images/LevelMid.png";
    if (priority === "high") return "/images/LevelMax.png";
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
            {task?.title ?? "Task"}
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
              {task.category}
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
              {`${task.value} Points`}
            </Badge>
            <Image
              src={getImage(task.priority!)}
              alt="Level"
              boxSize="100px"
              maxW={"40px"}
              maxH={"30px"}
            />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={6}>
          <Flex flexDirection="row">
            <Box flex="3">
              <FormControl mb={4}>
                <FormLabel>{t("dashboard.createTask.description")}</FormLabel>
                <Textarea
                  value={task.description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={254}
                  isReadOnly={true}
                />
              </FormControl>
              <Heading
                fontSize={{ base: "md", sm: "sm", md: "md" }}
                fontWeight="bold"
                bgGradient="linear(to-l, #3107DA, #5E39F1)"
                bgClip="text"
                mb={4}
              >
                {t("dashboard.detailTask.activity")}
              </Heading>
              <Box p={4} border="0.1px solid gray" boxShadow="lg" rounded="lg">
                <NotificationItem
                  avatar="/images/standarAvatar.png" // Cambia a la dirección de tu imagen
                  text="SoyEzio accepted CryptoReudMD applications to this task"
                  date="Oct 22, 2023 11:15 AM"
                />
                <NotificationItem
                  avatar="/images/standarAvatar.png" // Cambia a la dirección de tu imagen
                  text="CryptoReudMD applied to this task"
                  date="Oct 21, 2023 5:05 PM"
                />
              </Box>
            </Box>

            <Box flex="1" ml={7}>
              <Badge
                w={"100%"}
                colorScheme="purple"
                mr={2}
                fontSize={12}
                rounded={"full"}
                padding={1}
                textAlign={"center"}
                mb={4}
              >
                {task.status}
              </Badge>

              <Badge
                w={"100%"}
                colorScheme="purple"
                mr={2}
                fontSize={12}
                rounded={"full"}
                padding={1}
                mb={4}
                textAlign={"center"}
              >
                {"11/29/2023"}
              </Badge>
              <Badge
                w={"100%"}
                colorScheme="purple"
                mr={2}
                fontSize={12}
                rounded={"full"}
                padding={1}
                textAlign={"center"}
              >
                {"Pending"}
              </Badge>
              <Tooltip
                hasArrow
                label={
                  <Box>
                    <VStack spacing={2} align="start">
                      <Box display="flex" alignItems="center">
                        <Avatar
                          size="sm"
                          name="Rens"
                          src="/images/standarAvatar.png"
                        />
                        <Text ml={2}>{getRandomName()}</Text>
                      </Box>
                      <Text>Has started a dispute</Text>
                      <Text>{randomPastDateWithTime()}</Text>
                    </VStack>
                  </Box>
                }
                bg="gray.600"
                color="white"
                fontSize="md"
                borderRadius="lg"
                p={2}
                placement="right"
                arrowSize={10}
                arrowShadowColor="gray.500"
              >
                <IconButton
                  mt={4}
                  aria-label="alert"
                  variant="ghost"
                  icon={<FiAlertTriangle size={"34px"} />}
                  size={"lg"}
                />
              </Tooltip>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetail;

const NotificationItem = ({ avatar, text, date }: any) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <img
      src={avatar}
      alt="Avatar"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        marginRight: "10px",
      }}
    />
    <div style={{ flex: 1 }}>
      <p>{text}</p>
      <small>{date}</small>
    </div>
  </div>
);



function getRandomName() {
  const names = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah", "Isaac", "Julia"];

  const randomIndex = Math.floor(Math.random() * names.length);

  return names[randomIndex];
}


function randomPastDateWithTime(): string {
  const currentDate = new Date();
  const oneDayInMillis = 24 * 60 * 60 * 1000;

  // Un número aleatorio entre 1 y 5 para determinar los días a restar
  const randomDays = Math.floor(Math.random() * 5) + 1;

  currentDate.setTime(currentDate.getTime() - randomDays * oneDayInMillis);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
    "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Obtener la hora y los minutos
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');

  return `${months[currentDate.getMonth()]} ${currentDate.getDate()} ${hours}:${minutes}`;
}