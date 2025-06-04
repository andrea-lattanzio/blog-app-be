import { join } from 'path';

export class MailOptions<TContext> {
  subject: string;
  context?: TContext;
  template: string;
  attachments?: any[];
}

// ATTACHMENT STRUCTURE
// {
//         filename: 'header-image.jpg',
//         path: join(ASSETS_BASE_PATH, 'header-image.jpg'),
//         cid: 'header-image',
//       },

export const ASSETS_BASE_PATH = join(__dirname, '..', '..', 'assets');
