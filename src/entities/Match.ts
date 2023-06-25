import { Models } from '_@types';
import { Player } from './Player';

interface Props {
  id: string;
  players: Player[];
}

export class Match {
  id: string;
  players: Player[];
  round: number;
  winner: Player;
  starter: Player;
  chat: Models.Chat[];
  started: boolean;
  sendChat: (chat: Models.Chat) => void;

  constructor({ id, players }: Props) {
    this.id = id;
    this.players = players;
    this.round = 1;
    this.chat = [];

    this.sendChat = (c: Models.Chat) => this.chat.push(c);
  }

  public start() {
    this.started = true;

    // Set starter a random player in the match
    this.starter =
      this.players[Math.floor(Math.random() * this.players.length)];
  }

  public update() {
    if (
      this.players.some(
        player => player.selected_character.attributes.health <= 0,
      )
    ) {
      this.winner = this.players.find(
        player => player.selected_character.attributes.health > 0,
      );

      return;
    }

    this.round++;
  }
}
