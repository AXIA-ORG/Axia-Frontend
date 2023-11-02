import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import {
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Container,
  SimpleGrid,
  Flex,
  Spinner,
  Avatar,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { ORGANIZATION_DETAIL } from "../../graphql/organizationDetail.graphql";
import { Organization } from "../../types/organization.types";
import ColumnGroups from "./ColumnGroups";
import EmptyColumn from "./EmptyColumn";

type KanbanComponentProps = {
  id: string;
};

const KanbanComponent = ({ id }: KanbanComponentProps) => {
  const { t } = useTranslation();
  const [orgInfo, setOrgInfo] = useState<Organization | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { loading, error, data, refetch } = useQuery(ORGANIZATION_DETAIL, {
    variables: { findOrganizationId: id },
  });
  useEffect(() => {
    if (!data) return;
    setOrgInfo(data.findOrganization);
  }, [data]);

  function getRandomNamedColor(): string {
    const colors = [
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "pink",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <>
      <Box>
        <Flex justifyContent="start" alignItems="center" mt={4}>
          <Avatar
            size={"md"}
            src={orgInfo?.img}
            mr={4}
          />
          <Heading
            fontSize={{ base: "4xl", sm: "2xl", md: "4xl" }}
            fontWeight="bold"
            bgGradient="linear(to-l, #3107DA, #5E39F1)"
            bgClip="text"
            mr={4}
          >
            {`${orgInfo?.name} - ${t("dashboard.taskboardTitle")} `}
          </Heading>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  isActive={isOpen}
                >
                  Filter by
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSelectedPriority("high")}>
                    High priority
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedPriority("medium")}>
                    Medium priority
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedPriority("low")}>
                    Low priority
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedStatus("active")}>
                    Is Active
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedStatus("finished")}>
                    Is Finished
                  </MenuItem>
                  <MenuItem onClick={() => setSelectedStatus("process")}>
                    In Process
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedPriority(null);
                      setSelectedStatus(null);
                    }}
                  >
                    Show all
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>

        <Container maxWidth="container.lg" px={4} py={10}>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 12, md: 4 }}
          >
            <>
              {orgInfo?.fieldsBase &&
                orgInfo?.fieldsBase.map((category, index) => {
                  const filteredTasks = orgInfo?.baseTasks.filter(
                    (task) =>
                      task.category.toLowerCase() === category.toLowerCase() &&
                      (!selectedPriority ||
                        task.priority?.toLowerCase() ===
                          selectedPriority.toLowerCase()) &&
                      (!selectedStatus ||
                        task.status?.toLowerCase() ===
                          selectedStatus.toLowerCase())
                  );

                  return (
                    <ColumnGroups
                      key={index}
                      orgId={orgInfo.id}
                      columnName={category}
                      color={getRandomNamedColor()}
                      tasks={filteredTasks}
                      refetchData={refetch}
                      fieldsBase={orgInfo?.fieldsBase!}
                    />
                  );
                })}
              <EmptyColumn />
            </>
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
};

export default KanbanComponent;
