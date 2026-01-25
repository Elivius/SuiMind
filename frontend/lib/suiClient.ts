import { SuiGraphQLClient } from '@mysten/sui/graphql';

export const gqlClient = new SuiGraphQLClient({
  url: process.env.NEXT_PUBLIC_GQL_URL as string,
});