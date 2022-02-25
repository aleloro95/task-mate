import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import Error from "next/error"
import React from "react"
import {
  GetIndividualTaskDocument,
  GetIndividualTaskQuery,
  GetIndividualTaskQueryVariables,
  useGetIndividualTaskQuery
} from "../../generated/graphql-frontend"
import { initializeApollo } from "../../lib/client"
import UpdateTaskForm from "../../components/UpdateTaskForm"

const UpdateTask = () => {
  // Hooks
  const router = useRouter()
  const id =
    typeof router.query?.id === "string" ? parseInt(router.query.id, 10) : NaN

  const { data, loading, error } = useGetIndividualTaskQuery({
    variables: { id }
  })
  if (!id) {
    return <Error statusCode={403} />
  }
  const task = data?.getIndividualTask

  return loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>An error ocurred.</p>
  ) : task ? (
    <UpdateTaskForm id={id} initialValues={{title: task.title}} />
  ) : (
    <p>Task not found</p>
  )
}

export default UpdateTask

export const getServerSideProps: GetServerSideProps = async (context) => {
  let id =
    typeof context.params?.id === "string"
      ? parseInt(context.params.id, 10)
      : NaN

  if (id) {
    const apolloClient = initializeApollo()
    await apolloClient.query<
      GetIndividualTaskQuery,
      GetIndividualTaskQueryVariables
    >({
      query: GetIndividualTaskDocument,
      variables: { id }
    })
    return {
      props: {
        initialApolloState: apolloClient.cache.extract()
      }
    }
  } else {
    return { props: {} }
  }
}
