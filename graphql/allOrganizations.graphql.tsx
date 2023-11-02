import { gql } from "@apollo/client";

export const FETCH_ALL_ORGANIZATIONS = gql`
  query FindAllOrgs {
    findAllOrgs {
      id
      name
      img
      moderatorsNumber
      organizationUsers {
        id
        role
        nickname
      }
    }
  }
`;
