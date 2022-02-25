import { ApolloProvider } from "@apollo/client"
import { AppProps } from "next/dist/shared/lib/router/router"
import Layout from "../components/Layout"
import { useApollo } from "../lib/client"
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export default MyApp
