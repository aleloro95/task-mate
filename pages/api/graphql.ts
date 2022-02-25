import { ApolloServer } from "apollo-server-micro"
import { ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"
import { NextApiHandler } from "next"
import {schema} from '../../backend/schema'
import { db } from "../../backend/db"


// New way to setup the Apollo Server's resolver function:
const apolloServer = new ApolloServer({
  schema,
  context: { db },
  // Display old playground web app when opening http://localhost:3000/api/graphql in the browser
  plugins: [
    ...(process.env.NODE_ENV === "development"
      ? [ApolloServerPluginLandingPageGraphQLPlayground]
      : [])
  ]
})

export const config = {
  api: {
    bodyParser: false
  }
}

// Now we need to start Apollo Server before creating the handler function.
const serverStartPromise = apolloServer.start()
let graphqlHandler: NextApiHandler | undefined

const handler: NextApiHandler = async (req, res) => {
  if (!graphqlHandler) {
    await serverStartPromise
    graphqlHandler = apolloServer.createHandler({ path: "/api/graphql" })
  }

  return graphqlHandler(req, res)
}

export default handler
