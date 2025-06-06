import { Router } from 'express';
import ContactController from '../controllers/contact.controller';

class ContactRoute {

  public router: Router
  private contactController: ContactController

  constructor() {
    this.router = Router()    
    this.contactController = new ContactController()
    this.initializeBaseRoutes()
  }

  private initializeBaseRoutes(): void {
    this.router.route('/identify').post(this.contactController.getContact)
  }
}

export default ContactRoute