import { Entity } from './entity.mode';

export class User extends Entity {
  fullName: string;
  givenName: string;
  email: string;
  emailVerified: boolean;
  showWelcomeWizard: boolean;
  language?: string;
}