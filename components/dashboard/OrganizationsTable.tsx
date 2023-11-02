import {
  Avatar,
  Button,
  Card,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect,  useState  } from "react";
import { Organization } from "../../types/organization.types";
import { useTranslation } from "react-i18next";
type MyOrganizationsTableProps = {
  orgs: Organization[];
  myOrgs: Organization[];
};
import VerifierModal from "../modal/Verifier.modal";

const OrganizationsTable = ({ orgs, myOrgs }: MyOrganizationsTableProps) => {
  const { t } = useTranslation();
  const isMemberOfOrg = (orgId: string) => {
    return myOrgs.some((myOrg) => myOrg.id === orgId);
  };

  const [isVerifierModalOpen, setVerifierModalOpen] = useState(false);

  return (
    <Card>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>{t("myOrganizations.table.tableInfo")}</TableCaption>
          <Thead>
            <Tr>
              <Th></Th>
              <Th>{t("myOrganizations.table.organization")}</Th>
              <Th isNumeric>{t("myOrganizations.table.contributors")}</Th>
              <Th isNumeric>{t("myOrganizations.table.moderators")}</Th>
              <Th>{t("myOrganizations.table.actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orgs.map((org, index) => (
              <Tr key={index}>
                <Td>
                  <Avatar
                    size="sm"
                    name={org.name}
                    src={org.img || "/images/standarAvatar.png"}
                  />
                </Td>
                <Td>{org.name}</Td>
                <Td isNumeric>{org?.organizationUsers?.length ?? ''}</Td>
                <Td isNumeric>{org.moderatorsNumber}</Td>
                <Td>
                  {!isMemberOfOrg(org.id) ? (
                    <Button 
                      colorScheme="blue" 
                      size="sm" 
                      mr={2}
                      w="130px" 
                      textAlign="center"
                      onClick={() => setVerifierModalOpen(true)}
                    >
                      {t("myOrganizations.table.requestJoin")}
                    </Button>
                  ) : (
                    <Button 
                      colorScheme="teal" 
                      size="sm"
                      w="130px" 
                      textAlign="center"
                    >
                      {t("myOrganizations.table.seeDetails")}
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <VerifierModal isOpen={isVerifierModalOpen} onClose={() => setVerifierModalOpen(false)} />
    </Card>
  );
};

export default OrganizationsTable;
