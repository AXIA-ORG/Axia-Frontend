import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  ScaleFade,
  Text,
  VStack,
  useColorMode,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { TaskModel } from "../../models/taskModel";
import { AutoResizeTextarea } from "./AutoResizeTextArea";
import { TaskStatus } from "../../enums/enums";
import { useTranslation } from "react-i18next";
import TaskDetail from "../modal/TaskDetail.modal";
import TakeTask from "../modal/takeTask.modal";

type TaskProps = {
  task: TaskModel;
  onUpdate: (id: TaskModel["id"], updatedTask: TaskModel) => void;
  onDelete: (id: TaskModel["id"]) => void;
  orgId?: string;
};

export default function Task({
  task,
  onUpdate: handleUpdate,
  onDelete: handleDelete,
  orgId,
}: TaskProps) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [takeTask, setTakeTask] = useState(false);
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    handleUpdate(task.id, { ...task, title: newTitle });
  };

  const handleDeleteClick = () => {
    handleDelete(task.id);
  };
  const getImage = (priority: string) => {
    if (priority === "low") return "/images/LevelMin.png";
    if (priority === "medium") return "/images/LevelMid.png";
    if (priority === "high") return "/images/LevelMax.png";
  };
  const handleTakeTask = () => {
    setTakeTask(true);
  };
  const seeTaskDetails = () => {};
  type StatusInfo = {
    text: string;
    colorScheme: string;
    onClick: (e: React.MouseEvent) => void;
  };
  type StatusMapType = {
    [key in TaskStatus]: StatusInfo;
  };
  const statusMap: StatusMapType = {
    [TaskStatus.ACTIVE]: {
      text: t("dashboard.task.actionButtonActive"),
      colorScheme: "purple",
      onClick: (e) => {
        e.stopPropagation();
        handleTakeTask();
      },
    },
    [TaskStatus.PROCESS]: {
      text: t("dashboard.task.actionButtonProcess"),
      colorScheme: "blue",
      onClick: (e) => {
        e.stopPropagation();
        seeTaskDetails();
      },
    },
    [TaskStatus.FINISHED]: {
      text: t("dashboard.task.actionButtonFinished"),
      colorScheme: "green",
      onClick: (e) => {
        e.stopPropagation();
        seeTaskDetails();
      },
    },
    [TaskStatus.PAUSED]: {
      text: t("dashboard.task.actionButtonPaused"),
      colorScheme: "orange",
      onClick: (e) => {
        e.stopPropagation();
        seeTaskDetails();
      },
    },
  };

  const checkStatus = (status: TaskStatus): JSX.Element => {
    const { text, colorScheme, onClick } = statusMap[status];
    return (
      <Button
        size="sm"
        borderRadius="full"
        colorScheme={colorScheme}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  };
  const onComplete = async () => {};
  function randomFutureDate(): string {
    const currentDate = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    currentDate.setTime(currentDate.getTime() + oneDayInMillis);

    const randomDays = Math.floor(Math.random() * 10);

    currentDate.setTime(currentDate.getTime() + randomDays * oneDayInMillis);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${months[currentDate.getMonth()]} ${currentDate.getDate()}`;
  }
  const onTakeTask = () => {
    console.log("take task");
    handleUpdate(task.id, { ...task, status: TaskStatus.PROCESS });
  }
  return (
    <>
      <Box
        onClick={onOpen}
        as="div"
        role="group"
        position="relative"
        rounded="lg"
        w={"100%"}
        p={4}
        boxShadow="lg"
        cursor="pointer"
        bgColor={colorMode === "dark" ? "gray.800" : "white"}
        border="0.1px solid gray"
      >
        <Flex justify="space-between" alignItems="center" mb={2}>
          <Text
            fontWeight="semibold"
            flex="1"
            mr={4}
            fontSize="l"
            isTruncated
            overflow="hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {task.title}
          </Text>
          {task.status && checkStatus(task.status)}
        </Flex>

        <Flex justify="space-between" alignItems="center">
          <Button size="xs" borderRadius="full" colorScheme="purple" px={2}>
            {randomFutureDate()}
          </Button>
          <Flex alignItems="center">
            <Text fontWeight="semibold" mr={2}>
              {task.value}
            </Text>
            <Image
              src={getImage(task.priority!)}
              alt="Level"
              boxSize="40px"
              maxW={"25px"}
              maxH={"20px"}
            />
          </Flex>
        </Flex>
      </Box>
      {isOpen && (
        <TaskDetail
          task={task}
          isOpen={isOpen}
          onClose={onClose}
          category={task.category}
          orgId={orgId!}
          onComplete={onComplete}
        />
      )}
      {takeTask && 
        <TakeTask 
          isOpen={takeTask} 
          onDone={onTakeTask}
          onClose={() => {setTakeTask(false)}}
        />
      }
    </>
  );
}
