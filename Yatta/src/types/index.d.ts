import { Note } from '~/utils/db';

export interface Message {
  menuId: string | number;
  payload: Pick<Note, 'pageInfo' | 'content'>;
}



