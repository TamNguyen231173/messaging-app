import { PORT } from './configs'
import { AppModuleInstance } from './module'
import 'reflect-metadata'

const main = async () => {
  try {
    const { httpServer, server } = await AppModuleInstance.startApollo()

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`)
    })
  } catch (error) {
    console.log(error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
main().then((_) => {})
