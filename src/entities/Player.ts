import { Socket } from 'socket.io-client';
import { Character } from './Character';

interface Props {
  id: string;
  username: string;
  password: string;
}

export class Player {
  id: string;
  email: string;
  username: string;
  password: string;
  selected_character: Character;
  // socket: Socket;

  constructor({ id, username, password }: Props) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}
