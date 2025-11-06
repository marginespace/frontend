import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    concat,
  } from '@apollo/client';
  
  const getHttpLink = (chain: string) => {
    let uri;
  
    switch (chain) {
      case 'avax':
        uri =
          'https://gateway.thegraph.com/api/subgraphs/id/55GxWT4mrRYLe5jsmTdmZTbNVwa3PtS3xytEd8pss9dg';
        break;
      case 'optimism':
        uri =
          'https://gateway.thegraph.com/api/subgraphs/id/7Jq95DPEkf5ov3W5gQBviho7QEvudWSrgzsrdWQtbQ1x';
        break;
      case 'bsc':
        uri =
          'https://gateway.thegraph.com/api/subgraphs/id/6ua4NdpX8REs7FV1jbv3pGV28FAS8rwj6oPmTn43cfKM';
        break;
      case 'base':
        uri =
          'https://gateway.thegraph.com/api/subgraphs/id/4K3wvwMGWTf7u4fXxXZs3uyxrvxu3f9b1LGe9GD7hVUK';
        break;
        default:
        uri =
          'https://gateway.thegraph.com/api/subgraphs/id/HryxfpTy7ELrJ4xXgKYmrLXCTRvsAgbWfg8XE4fugBD9';
        break;
    }
  
    return new HttpLink({ uri, fetch, headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`
    } });
  };
  
  // Setup Apollo client.
  const authLink = new ApolloLink((operation, forward) => {
    return forward(operation);
  });
  
  export const createApolloClient = (chain: string) => {
    const httpLink = getHttpLink(chain);
  
    return new ApolloClient({
      link: concat(authLink, httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
        watchQuery: {
          fetchPolicy: 'no-cache',
          nextFetchPolicy: 'no-cache',
        },
      },
    });
  };