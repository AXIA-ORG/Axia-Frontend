import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation signUp($signUpInput: SignUpInput!) {
    signUp(signUpInput: $signUpInput) {
      token
      user {
        address
        id
        isActive
        nickname
        roles
      }
    }
  }
`;
