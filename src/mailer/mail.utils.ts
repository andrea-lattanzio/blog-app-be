import { join } from 'path';

export interface BaseMailContext {
  frontendBaseUri: string;
}

export class MailOptions<T> {
  subject: string;
  context?: T;
  template: string;
  attachments?: Attachment[];
}

class Attachment {
  filename: string;
  path: string;
  cid: string;
}

export const ASSETS_BASE_PATH: string = join(__dirname, '..', '..', 'assets');
