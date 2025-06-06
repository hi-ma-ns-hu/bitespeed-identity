import 'reflect-metadata';  // add support for js decorators
import express, { Application } from 'express';

// extra packages for security purpose
import helmet from 'helmet'; // helps to secure our app by setting various HTTP headers
import cors from 'cors'; // helps us to enable cors
import hpp from 'hpp'; // helps us to sanitize user input

import compression from 'compression'; // compression middleware

import { Server } from 'http';

// import AppDataSource from './config/appDataSource';
// import errorHandlerMiddleware from './middleware/errorMiddleware';
// import morganMiddleware from './middleware/morganMiddleware';
import IndexRoute from './routes/index.route';



class App {

  private app: Application
  private indexRoutes: IndexRoute
  private readonly PORT: number

  constructor(port: number) {
    this.app = express()
    this.indexRoutes = new IndexRoute()
    this.PORT = port

    this.initializeMiddlewares()
    this.initializeAppRoutes()
    this.initializeErrorHandler()
    this.initializeDatabase()
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(hpp());
    this.app.use(express.json()); // parses json request body
    this.app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
    this.app.use(compression());
    this.app.use(cors());
    // this.app.use(morganMiddleware);
  }

  private initializeAppRoutes(): void {
    this.app.use('/api', this.indexRoutes.router)
  }

  private initializeErrorHandler(): void {
    // this.app.use(errorHandlerMiddleware)
  }

  private async initializeDatabase(): Promise<void> {
    try {
      // await AppDataSource.initialize();
      // new RepositoryProvider(AppDataSource)
    } catch (error) {
      console.log('database init error', error);
    }
  }

  public server(): Server {
    return this.app.listen(this.PORT, () => console.log(`Server listening on PORT ${this.PORT}`))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on('error', (err: any) => {
        if (err === 'EADDRINUSE') {
          console.log('Address already in use', JSON.stringify(err));
        } else {
          console.log(JSON.stringify(err));
        }
      })
  }

}

export default App