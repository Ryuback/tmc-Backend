import { Entity } from './entity.model';
import { Quality } from './quality.model';

export interface Collaboration extends Entity {
  userId: string,
  givenName: string,
  fullName: string,
  qualities: Quality[];
}
