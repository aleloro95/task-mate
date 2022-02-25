import Head from "next/head"
import { useEffect, useRef } from "react"
import CreateTaskForm from "../components/CreateTaskForm"
import TaskList from "../components/TaskList"
import TaskFilter from "../components/TaskFilter"
import {
  GetTasksDocument,
  GetTasksQuery,
  GetTasksQueryVariables,
  TaskStatus,
  useGetTasksQuery
} from "../generated/graphql-frontend"
import { initializeApollo } from "../lib/client"
import styles from "../styles/Home.module.css"
import { useRouter } from "next/router"
import Error from "next/error"
import { GetServerSideProps } from "next"
import { mapStatus } from "../lib/helpers"

const isTaskStatus = (value: string | string[]): value is TaskStatus =>
  Object.values(TaskStatus).includes(value as TaskStatus)

export default function Home() {
  // Hooks
  const router = useRouter()
  const status = mapStatus(router.query.status)
  const prevStatus = useRef(status)
  useEffect(() => {
    prevStatus.current = status
  }, [status])

  const results = useGetTasksQuery({
    variables: { status },
    fetchPolicy:
      prevStatus.current === status ? "cache-first" : "cache-and-network"
  })
  if (status !== undefined && !isTaskStatus(status)) {
    return <Error statusCode={404} />
  }

  const tasks = results.data?.getTasks
  const tasksExistAndDefined: boolean | undefined = tasks && tasks.length > 0

  return (
    <div className={styles.container}>
      <Head>
        <title>Tasks</title>
        <meta name="description" content="Simple todo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateTaskForm onSuccess={results.refetch} />
      {results.loading && !tasks ? (
        <p>Loading tasks...</p>
      ) : results.error ? (
        <p>There was an error.</p>
      ) : tasksExistAndDefined ? (
        <TaskList tasks={tasks} />
      ) : (
        <p className="no-tasks-message">There are no tasks yet</p>
      )}
      <TaskFilter status={status} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const statusIsString = typeof context.params?.status === "string"
  const status = statusIsString ? context.params?.status : undefined

  if (status === undefined || isTaskStatus(status)) {
    const apolloClient = initializeApollo()
    await apolloClient.query<GetTasksQuery, GetTasksQueryVariables>({
      query: GetTasksDocument,
      variables: { status }
    })

    return {
      props: {
        initialApolloState: apolloClient.cache.extract()
      }
    }
  }
  return { props: {} }
}
