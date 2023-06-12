import * as Nullstack from 'nullstack';
import { Player } from '_entities/Player';
import { Match } from '_entities/Match';
import { Server } from 'socket.io';

declare module 'nullstack' {
  export interface BaseNullstackServerContext {
    db: {
      players: Player[];
    };
    matches: Map<string, Match>;
    queue: Map<string, Map<string, Player>>;
    MATCH_SIZE: number;
    io: Server;
  }

  export interface BaseNullstackClientContext {
    me: Player;
  }
}
