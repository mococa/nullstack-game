import { Socket } from 'socket.io-client';
import { Character } from './Character';

interface Props {
  id: string;
  name: string;
}

export class Player {
  id: string;
  email: string;
  name: string;
  // characters: Character[];
  selected_character: Character;
  socket: Socket;

  constructor({ id, name }: Props) {
    this.id = id;
    this.name = name;
  }
}
