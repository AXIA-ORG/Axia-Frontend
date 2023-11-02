import { gql } from "@apollo/client";

export const ORGANIZATION_DETAIL = gql`
  query FindOrganization($findOrganizationId: ID!) {
    findOrganization(id: $findOrganizationId) {
      id
      name
      description
      baseTasks {
        id
        title
        description
        status
        value
        createdAt
        depending
        category
        priority
      }
      epochs {
        description
        duration
        endDate
        id
        isActive
        startDate
        tasks {
          id
          title
          description
          status
          value
          createdAt
          depending
        }
      }
      fieldsBase
      img
      organizationUsers {
        id
        nickname
        role
      }
      moderatorsNumber
    }
  }
`;
