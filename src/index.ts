import { AppModuleInstance } from './module'
import 'reflect-metadata'

const main = async () => {
  try {
    const { httpServer, server } = await AppModuleInstance.startApollo()

    httpServer.listen(4000, () => {
      console.log(`Server is running on http://localhost:4000${server.graphqlPath}`)
    })
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
