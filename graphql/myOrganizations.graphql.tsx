import { gql } from "@apollo/client";

export const FETCH_ORGANIZATIONS = gql`
  query OrganizationOfUser {
    organizationOfUser {
      name
      id
    }
  }
`;
