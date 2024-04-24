import gql from 'graphql-tag'

// Subscription
export const SUBSCRIPTION_POST = gql`
subscription {
  post{
    mutation
    data{
      id
      title
      author
    }
  }
}
`
