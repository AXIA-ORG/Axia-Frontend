import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import {
  Heading,
  Button,
  Box,
  Flex,
  useDisclosure,
  Card,
  CardBody,
  Input,
  CardHeader,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { Organization } from "../../types/organization.types";
import CreateOrganizationModal from "../modal/CreateOrg.modal";
import OrganizationsTable from "./OrganizationsTable";
import { FETCH_ALL_ORGANIZATIONS } from "../../graphql/allOrganizations.graphql";
import { FETCH_ORGANIZATIONS } from "../../graphql/myOrganizations.graphql";

const MyOrganizations = () => {
  const { t, i18n } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useQuery(FETCH_ALL_ORGANIZATIONS);
  const { data : myOrgsData } = useQuery(FETCH_ORGANIZATIONS);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [myOrgs, setMyOrgs] = useState<Organization[]>([]);
  useEffect(() => {
    if (!data) return;
    console.log('all orgs are ', data.findAllOrgs);
    
    setOrgs(data.findAllOrgs);
  }, [data]);
  useEffect(() => {
    if (!myOrgsData) return;
    console.log('my orgs are ', myOrgsData.organizationOfUser);
    
    setMyOrgs(myOrgsData.organizationOfUser);
  }, [myOrgsData]);

  return (
    <>
      <Box mt={4} mb={8}>
        <Card>
          <CardBody>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                fontSize={{ base: "3xl", sm: "1xl", md: "3xl" }}
                fontWeight="bold"
                bgGradient="linear(to-l, #7928CA, #FF0080)"
                bgClip="text"
                flex="1"
                mr="2"
              >
                {t("myOrganizations.title")}
              </Heading>
              <Flex flex="1" justify="flex-end" alignItems="center">
                <Input
                  placeholder="Filter by Name"
                  size="lg"
                  variant="filled"
                  width="60%"
                  marginRight="20px"
                />
                <Button
                  onClick={onOpen}
                  colorScheme="blue"
                  variant="solid"
                  leftIcon={<AddIcon />}
                  width="40%"
                >
                  {t("myOrganizations.create")}
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Box>
      <Box mt={8}>
        {orgs && orgs.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <Heading
                  fontSize={{ base: "2xl", sm: "1xl", md: "2xl" }}
                  fontWeight="bold"
                  bgGradient="linear(to-l, #7928CA, #FF0080)"
                  bgClip="text"
                  flex="1"
                  mr="2"
                  textAlign={"center"}
                >
                  {t("myOrganizations.publicOrganizations")}
                </Heading>
              </CardHeader>
              <CardBody>
                <OrganizationsTable orgs={orgs} myOrgs={myOrgs}/>
              </CardBody>
            </Card>
          </>
        ) : (
          <Box>
            <Heading
              fontSize={{ base: "4xl", sm: "2xl", md: "4xl" }}
              fontWeight="normal"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              textAlign={"center"}
              mt={"100px"}
            >
              {t("myOrganizations.noItems")}
            </Heading>
          </Box>
        )}
      </Box>
      <CreateOrganizationModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default MyOrganizations;
