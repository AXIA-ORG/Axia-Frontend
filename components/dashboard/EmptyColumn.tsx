import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Heading,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const addCategory = async () => {};

function EmptyColumn() {
  return (
    <Box
    bgColor={'transparent'}
    >
      <Heading fontSize="md" mb={4} letterSpacing="wide">
        <Badge px={2} py={1} rounded="lg" colorScheme={'blue'}> 
          {'Add new category'}
        </Badge>
      </Heading>

      <Stack
        bgColor={'transparent'}

        direction={{ base: "row", md: "column" }}
        h={{ base: 300, md: 600 }}
        p={4}
        mt={2}
        spacing={4}
        rounded="lg"
        // boxShadow="md"
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
            onClick={addCategory}
            colorScheme="black"
            aria-label="add-task"
            icon={<AddIcon />}
          />
        </>
      </Stack>
    </Box>
  );
}

export default EmptyColumn;
