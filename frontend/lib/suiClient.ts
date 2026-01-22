import { SuiGraphQLClient } from '@mysten/sui/graphql';

// You create it ONCE here
export const gqlClient = new SuiGraphQLClient({
  url: process.env.NEXT_PUBLIC_GQL_URL as string,
});