import { NextApiRequest, NextApiResponse } from "next";
import { ApolloClient, InMemoryCache, useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/login";
import { CREATE_USER } from "../../graphql/createUser.graphql";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      if (req.body.type === "login") {
        return await login(req, res);
      }
      else if (req.body.type === "createUser") {
        return await createUser(req, res);
     ; }
    }
  } catch (error) {
    res.status(500).json({ message: "error fetching" });
  }
}
async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await client.mutate({
      mutation: LOGIN,
      variables: {
        loginInput: {
          address: req.body.address,
        },
      },
    });
    if (response) {
      res.status(200).json({ message: "User Found", data: response.data });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        signUpInput: {
          address: req.body.address,
          nickname: req.body.nickname,
        },
      },
    });
    if (response) {
      res.status(200).json({ message: "User Found", data: response.data });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
