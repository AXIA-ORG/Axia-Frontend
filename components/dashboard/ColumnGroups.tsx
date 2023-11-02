import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Heading,
  IconButton,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import useColumnDrop from "../../hooks/useColumnDrop";
import Task from "./Task";
import { ColumnType } from "../../enums/enums";
import { TaskModel } from "../../models/taskModel";
import { v4 as uuidv4 } from "uuid";
import CreateTaskModal from "../modal/CreateTask.modal";
import { useEffect } from "react";

const ColumnColorScheme: Record<ColumnType, string> = {
  Todo: "gray",
  "In Progress": "blue",
  Blocked: "red",
  Completed: "green",
};
type ColumnProps = {
  columnName: string;
  color: string;
  tasks: TaskModel[];
  orgId: string;
  refetchData: () => void;
  fieldsBase : string[];
};
function ColumnGroups({
  columnName,
  color,
  tasks,
  orgId,
  refetchData,
  fieldsBase
}: ColumnProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteTask = (id: string) => {};
  const addEmptyTask = () => {};
  const swapTasks = () => {};
  const updateTask = () => {};
  useEffect(() => {
    console.log("tasks are ", tasks);
  }, []);

  const ColumnTasks = tasks.map((task, index) => (
    <Task
      key={task.id}
      task={task}
      onUpdate={updateTask}
      onDelete={deleteTask}
      orgId={orgId}
    />
  ));
  const onComplete = async () => {
    onClose();
    refetchData();
  };
  return (
    <>
      <Box border="0.1px solid gray" boxShadow="lg" rounded="lg" bg={"transparent"}>
        <Heading fontSize="md" mb={4} letterSpacing="wide">
          <Badge px={2} py={1} rounded="lg" colorScheme={color}>
            {columnName}
          </Badge>
        </Heading>

        <Stack
          direction={{ base: "row", md: "column" }}
          h={{ base: 300, md: 600 }}
          p={4}
          mt={2}
          spacing={4}
          bgColor={useColorModeValue("gray.50", "gray.900")}
          rounded="lg"
          boxShadow="md"
          overflow="auto"
        >
          <>
            <IconButton
              size="xs"
              w="full"
              color={useColorModeValue("gray.500", "gray.400")}
              bgColor={useColorModeValue("gray.100", "gray.700")}
              _hover={{ bgColor: useColorModeValue("gray.200", "gray.600") }}
              py={2}
              variant="solid"
              onClick={onOpen}
              colorScheme="black"
              aria-label="add-task"
              icon={<AddIcon />}
            />
            {ColumnTasks}
          </>
        </Stack>
      </Box>
      <CreateTaskModal
        isOpen={isOpen}
        onClose={onClose}
        category={columnName}
        orgId={orgId}
        onComplete={onComplete}
        fieldsBase={fieldsBase}
      />
    </>
  );
}

export default ColumnGroups;
