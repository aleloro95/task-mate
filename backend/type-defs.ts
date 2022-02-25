import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  enum TaskStatus {
    completed
    active
  }

  type Task {
    id: Int!
    title: String!
    status: TaskStatus!
  }

  type Query {
    getTasks(status: TaskStatus): [Task!]!
    getIndividualTask(id: Int!): Task
  }

  input CreateTaskInput {
    title: String!
  }

  input UpdateTaskInput {
    id: Int!
    title: String
    status: TaskStatus
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task
    updateTask(input: UpdateTaskInput): Task
    deleteTask(id: Int!): Task
  }
`