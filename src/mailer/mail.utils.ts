import { join } from 'path';

export interface BaseMailContext {
  frontendBaseUri: string;
}

export class MailOptions<T = unknown> {
  subject: string;
  context?: T;
  template: string;
  attachments?: any[];
}

// ATTACHMENT STRUCTURE
// {
//  filename: 'header-image.jpg',
//  path: join(ASSETS_BASE_PATH, 'header-image.jpg'),
//  cid: 'header-image',
// },

export const ASSETS_BASE_PATH = join(__dirname, '..', '..', 'assets');
