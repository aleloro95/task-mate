import { ApolloCache, FetchResult, Reference } from "@apollo/client"
import { DeleteTaskMutation } from "../generated/graphql-frontend"

// Helper functions

type resultType = Omit<
  FetchResult<DeleteTaskMutation, Record<string, any>, Record<string, any>>,
  "context"
>

// Deletes a task from Apollo Client cache
export const updateCache = (cache: ApolloCache<any>, result: resultType) => {
  const deletedTask = result.data?.deleteTask
  if (deletedTask) {
    cache.modify({
      fields: {
        getTasks(taskRefs: Reference[], { readField }) {
          return taskRefs.filter((taskRef) => {
            return readField("id", taskRef) !== deletedTask.id
          })
        }
      }
    })
  }
}
