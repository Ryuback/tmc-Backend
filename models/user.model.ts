import { Entity } from './entity.model';

export class User extends Entity {
  fullName: string;
  givenName: string;
  email: string;
  emailVerified: boolean;
  imageUrl: string;
  showWelcomeWizard: boolean;
  language?: string;
}