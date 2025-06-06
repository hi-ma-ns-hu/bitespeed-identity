export interface Contact {
  id: number;
  email?: string;
  phonenumber?: string;
  linkedid?: number;
  linkprecedence: 'primary'|'secondary';
  createdat: Date;
  updatedat: Date;
  deletedat?: Date;
}
