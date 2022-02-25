import {
  MutationUpdateTaskArgs,
  Resolvers,
  TaskStatus
} from "../generated/graphql-backend"
import mysql from "serverless-mysql"
import { UserInputError } from "apollo-server-micro"
import { OkPacket } from "mysql"

// TS INTERFACES AND TYPES
export interface ApolloContext {
  db: mysql.ServerlessMysql
}

interface TaskDbRow {
  id: number
  title: string
  task_status: TaskStatus
}

type GetTasksResult = TaskDbRow[]

type GetIndividualTaskResult = TaskDbRow[]

// GENERAL FUNCTIONS //
const getTaskById = async (id: number, db: mysql.ServerlessMysql) => {
  const query = "SELECT id, title, task_status FROM tasks WHERE id = ?"
  let tasks = await db.query<GetIndividualTaskResult>(query, id)
  let output = tasks.length
    ? { id, title: tasks[0].title, status: tasks[0].task_status }
    : null
  return output
}

// RESOLVERS //
export const resolvers: Resolvers<ApolloContext> = {
  Query: {
    async getTasks(parent, args, context) {
      const { status } = args
      let query = "SELECT id, title, task_status FROM tasks"
      let queryParams = []
      if (status) {
        query += " WHERE task_status = ?"
        queryParams.push(status)
      }
      const tasks = await context.db.query<GetTasksResult>(query, queryParams)
      await context.db.end()
      const taskResult = tasks.map(({ id, title, task_status }) => ({
        id: id,
        title: title,
        status: task_status
      }))
      return taskResult
    },
    async getIndividualTask(parent, args, context) {
      const { id } = args
      return getTaskById(id, context.db)
    }
  },
  Mutation: {
    async createTask(parent, args, context) {
      const { title } = args.input
      let defaultStatus = TaskStatus.Active
      const task = await context.db.query<OkPacket>(
        "INSERT INTO tasks (title, task_status) VALUES (?, ?)",
        [title, defaultStatus]
      )
      let result = { id: task.insertId, title: title, status: defaultStatus }

      return result
    },

    async updateTask(parent, args: MutationUpdateTaskArgs, context) {
      const { id, title, status } = args.input

      const columns: string[] = []
      const queryParams: any[] = []

      if (title) {
        columns.push("title = ?")
        queryParams.push(args.input.title)
      }

      if (status) {
        columns.push("task_status = ?")
        queryParams.push(args.input.status)
      }

      queryParams.push(args.input?.id)
      const query = `UPDATE tasks SET ${columns.join(",")} WHERE id = ?`

      await context.db.query(query, queryParams)

      const updatedTask = await getTaskById(id, context.db)

      return updatedTask
    },
    async deleteTask(parent, args, context) {
      const { id } = args
      let task = await getTaskById(id, context.db)

      if (!task) {
        throw new UserInputError("The server could not find your task.")
      } else {
        await context.db.query("DELETE FROM tasks WHERE id = ?", [id])
      }
      return task
    }
  }
}
