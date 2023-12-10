import { gql } from "@apollo/client";

export const GET_NONCE = gql`
  query GetNonce($address: String!) {
    requestNonce(address: $address)
  }
`;