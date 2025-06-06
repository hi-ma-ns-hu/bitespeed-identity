import { Router } from 'express';
import ContactRoute from './contact.route';

class IndexRoute {
  public router: Router
  private baseRoute: ContactRoute

  constructor() {
    this.router = Router()
    this.baseRoute = new ContactRoute()
    this.initializeIndexRoutes()
  }

  private initializeIndexRoutes(): void {
    this.router.use(this.baseRoute.router)
  }
}

export default IndexRoute