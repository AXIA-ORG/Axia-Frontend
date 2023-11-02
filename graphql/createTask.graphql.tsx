import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateBaseTask($createBaseTaskInput: CreateBaseTaskInput!) {
    createBaseTask(createBaseTaskInput: $createBaseTaskInput) {
      id
      title
      description
      status
      category
      value
      createdAt
      depending
    }
  }
`;
