import { createSchema } from 'graphql-yoga'
import { createServer } from 'node:http'
import { createYoga , createPubSub, Repeater, pipe, map } from 'graphql-yoga'

const pubSub = createPubSub()

const messages = []
const subscribers = []
const onMessagesUpdates = (fn) => subscribers.push(fn)
export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Message {
        user: String!,
        id: ID!,
        content: String!
    }
    type Query {
      messages: [Message!]
    }
    type Mutation {
        postMessage(user: String!, content: String!): [Message]
    }
    type Subscription {
        messages: [Message!]
    }
  `,
  resolvers: {
    Query: {
      messages: () => messages
    },
    Mutation: {
        postMessage: (parents, {user, content}) => {
            let id = messages.length
            messages.push({
                id,
                user,
                content
            })
            
            
            pubSub.publish("messages", messages)
            // subscribers.forEach((fn) => fn());
            return messages
        }
    },
    Subscription: {
        messages: {
            subscribe:  () => {
              
        // const channel = Math.random().toString(36).slice(2, 15);
        // onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        // setTimeout(() => pubsub.publish(channel, { messages }), 0);
        // return pubsub.asyncIterator(channel); 
         return pipe(
              Repeater.merge([
                // cause an initial event so the
                // globalCounter is streamed to the client
                // upon initiating the subscription
                undefined,
                // event stream for future updates
                // onMessagesUpdates(() => pubSub.subscribe("message", messages))
                pubSub.subscribe('messages')
              ]),
              // map all stream values to the latest globalCounter
              map(() => messages)
         )
        //  return pubSub.subscribe('messages')
            },
            resolve: (payload) => {
                console.log('payload', payload)
                return payload
            }
        }
    }

  },
  context : {
    pubSub
  }
})

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ 
    schema,
    graphqlEndpoint: "/"
 })
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})