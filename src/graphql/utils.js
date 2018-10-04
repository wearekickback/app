import { PubSub } from 'graphql-subscriptions'

export const pubsub = new PubSub()

export const subscriptionResolver = (event, resolve) => ({
  resolve,
  subscribe: pubsub.asyncIterator(event),
})
