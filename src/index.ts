import "reflect-metadata"
import express, { Express, Response, Request } from "express"
import { ApolloServer } from "apollo-server-express"
import { TaskResolver } from "./resolvers/task"
import { buildSchema } from "type-graphql"
import { DataSource } from "typeorm"
import { Task } from "./entities/Task"

const main = async () => {
  const AppDataSource = new DataSource({
    type: "postgres",
    database: "todolist-graphql-db",
    entities: [Task],
    logging: true,
    synchronize: true,
    username: "postgres",
    password: "n541m",
    port: 5432,
  })
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!")
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err)
    })

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      //from typegraphql
      resolvers: [TaskResolver],
      validate: false,
    }),
    // plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })

  await apolloServer.start()
  const app: any = express()
  apolloServer.applyMiddleware({ app })

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello world")
  })

  app.listen(3000, () => {
    console.log("Listening on port 3000")
  })
}

main().catch((err) => {
  console.log(err)
})
