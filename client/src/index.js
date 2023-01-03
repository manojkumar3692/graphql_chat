  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
  import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
  import { createClient } from "graphql-ws";

  import './index.css';
  import App from './App';
  import reportWebVitals from './reportWebVitals';
  const link = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:4000/",
    }),
  );
  const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
    link,
  });
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
      <ApolloProvider client={client}>
      <App />
      </ApolloProvider>
  );

  reportWebVitals();
