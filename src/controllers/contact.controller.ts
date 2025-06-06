
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ContactService from '../services/contact.service';

class ContactController {

  private contactService: ContactService

  constructor() {
    this.contactService = new ContactService()
  }

  public getContact = async(req: Request<{email?: string, phone?: number}>, res: Response): Promise<void> => {
    const {body: {email, phone}} = req
    try {
      const contact = await this.contactService.getContact(email, phone)
      res.status(200).json({contact})
    } catch (err) {
      console.log('getbasedata', err)
    }
  }
}

export default ContactController
