import { User } from './user.model';

export interface ShowcasedImage {
  id: string;
  name: string;
  path: string;
  downloadURL: string;
  addedBy: User;
  updatedAt: number;
  createdat: number;
}
