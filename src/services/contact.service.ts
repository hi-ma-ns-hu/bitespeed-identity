import db from '../config/db';
import { Pool } from 'pg';
import { Contact } from '../types/express';

class ContactService {
  private db: Pool;

  constructor() {
    this.db = db
  }

  private queryRunner = async (query: string, params?: any[]): Promise<Omit<Contact, 'updatedat' | 'deletedat'>[]> => {
    try {
      const contact = await db.query(query, params)
      return contact.rows
    } catch (err) {
      console.log('err', err)
      return []
    }
  }

  // find all contacts by email or phone
  private getInitialContact = async (email?: string, phone?: number) => {
    const query = `select id, email, phonenumber, linkedid, linkprecedence, createdat from contact where email=$1 or phonenumber=$2;`
    return await this.queryRunner(query, [email, phone])
  }

  // create a new contact
  private createContact = async (email?: string, phone?: number, linkedid?: number | null, linkprecedence?: string) => {
    const query = `insert into contact (phonenumber, email, linkedid, linkprecedence) values($1, $2, $3, $4) returning id, email, phonenumber, linkedid, createdat;`
    const result = await this.queryRunner(query, [phone, email, linkedid, linkprecedence])
    return result[0]

  }

  // get all secondary contact of a primary contact
  private getSecondaryContact = async (primaryId: number) => {
    const query = `select id, email, phonenumber, linkedid, linkprecedence, createdat from contact where linkedid=$1 and linkprecedence='secondary';`
    return await this.queryRunner(query, [primaryId])
  }

  // handle multiple primary contacts in a single list
  private handleMultiplePrimaryContacts = async (contacts: Omit<Contact, "updatedat" | "deletedat">[]) => {
    // sort contact on basis of createdat and update contact other than oldest contact to secondary contact
    const sortedContact = contacts.sort((a, b) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime())
    const primaryContact = sortedContact[0]
    const secondaryContactIds = sortedContact.slice(1).map((el) => el.id)
    const query = `update contact set linkprecedence='secondary', linkedid=$1 where id=any($2::int[]);`
    await this.queryRunner(query, [primaryContact.id, secondaryContactIds])
    return {
      primaryContactId: primaryContact.id,
      emails: [...new Set(sortedContact.map((el) => (el).email))],
      phoneNumbers: [...new Set(sortedContact.map((el) => (el).phonenumber))],
      secondaryContactIds: secondaryContactIds
    };
  }

  public getContact = async (email?: string, phone?: number) => {
    // get all contact related to input email and phone
    const initialContact = await this.getInitialContact(email, phone)

    // if no contacts found, create a new primary contact
    if (initialContact.length === 0 && email && phone) {
      const newContact = await this.createContact(email, phone, null, 'primary')
      return {
        primaryContactId: newContact.id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phonenumber],
        secondaryContactIds: []
      };
    }

    // check if contact has multiple primaries
    const primaryContacts = initialContact.filter((el) => el.linkprecedence === 'primary')

    // if it has multiple primaries handle it by making oldest contact as primary and all other as secondary
    if (primaryContacts.length > 1) {
      return await this.handleMultiplePrimaryContacts(primaryContacts)
    }

    let primaryContact = primaryContacts[0] ?? null
    let secondaryContact: Omit<Contact, 'updatedat' | 'deletedat'>|undefined = initialContact.find((el) => el.linkprecedence === 'secondary')

    // if partial match found for given phone and email
    if (!!(initialContact.some((el) => el.email === email || el.phonenumber === phone) && email && phone)) {
      
      // find if phone or email are present in any contact
      const hasPhone = initialContact.find((el) => el.phonenumber === `${phone}`)
      const hasEmail = initialContact.find((el) => el.email === email)

      // if either phone or email is present, but not both and not neither
      // create a new secondary contact
      if ((hasPhone && !hasEmail) || (!hasPhone && hasEmail)) {

        const newSecondaryContact = await this.createContact(email, phone, primaryContact.id, 'secondary')
        secondaryContact = newSecondaryContact
      
      }
    }

    // find primary contact from secondary contact it doesn't exists
    if (!primaryContact && secondaryContact) {
      const result = await this.queryRunner(
        `select id, email, phonenumber, linkedid, linkprecedence, createdat from contact where id = $1`,
        [secondaryContact.linkedid]
      );
      primaryContact = result[0];
    }

    // get all secondary contact of a given primary contact and update the secondary contact list
    const secondaryContacts = await this.getSecondaryContact(primaryContact.id);
    if (secondaryContact) {
      secondaryContacts.push(secondaryContact);
    }

    return {
      primaryContactId: primaryContact?.id,
      emails: [...new Set([primaryContact?.email, ...secondaryContacts.map((el) => el.email)])],
      phoneNumbers: [...new Set([primaryContact?.phonenumber, ...secondaryContacts.map((el) => el.phonenumber)])],
      secondaryContactIds: [...new Set(secondaryContacts.map(c => c.id))]
    }
  }
}

export default ContactService;