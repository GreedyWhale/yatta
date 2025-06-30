import type { Note } from '~/utils/db';

export interface Message<T> {
  id: string | number;
  payload: T;
}

export type NoteMessage = Message<Pick<Note, 'pageInfo' | 'content'>>;

export type NotificationMessage = Message<string>;



