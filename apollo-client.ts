import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import Cookie from "js-cookie";

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // reemplaza por tu endpoint de GraphQL
});

const authLink = setContext((_, { headers }) => {
  const token = Cookie.get("jwt");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;