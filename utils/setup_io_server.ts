import { v4 } from 'uuid';
import { Models } from '_@types';
import { Match } from '_entities/Match';
import { Player } from '_entities/Player';
import { Server } from 'socket.io';

interface Props {
  matches: Map<string, Match>;
  queue: Map<string, Map<string, Player>>;
  MATCH_SIZE: number;
}

export const setup_io_server = (
  io: Server,
  { matches, queue, MATCH_SIZE }: Props,
) => {
  io.on('connection', socket => {
    // Just re-assuring when user is connected
    socket.emit('connected', '[server to front-end] connected!');

    // On match ready
    socket.on('ready', (player: Player, room_id: string) => {
      matches.get(room_id).players.forEach(p => {
        if (p.id === player.id)
          p.selected_character = player.selected_character;
      });

      socket.broadcast.to(room_id).emit('player-ready', player);
    });

    // Start match
    socket.on('start-match', (room_id: string) => {
      const match = matches.get(room_id);

      match.start();

      socket.broadcast.to(match.id).emit('match-started', match);
      socket.emit('match-started', match);
    });

    // Update match
    socket.on('update-match', (match: Match) => {
      matches.set(match.id, match);

      socket.broadcast.to(match.id).emit('match-updated', match);
    });

    // On chat sent
    socket.on('chat-sent', (chat: Models.Chat) => {
      socket.broadcast.to(chat.match_id).emit('chat-received', chat);
    });

    // Give match details
    socket.on('get-match', (room_id: string) => {
      socket.emit('match-details', matches.get(room_id));
    });

    // On enter a queue, either create a new queue or join an existing one
    socket.on('enter-queue', (player: Player) => {
      if (!queue.size) {
        const players = new Map<string, Player>();

        players.set(player.id, player);

        const room_id = v4();

        queue.set(room_id, players);

        socket.join(room_id);
        socket.emit('joined-queue', room_id);

        return;
      }

      let joined = false;

      const createMatch = (room_id: string, players: Map<string, Player>) => {
        const created_match = new Match({
          players: Array.from(players.values()),
          id: room_id,
        });

        matches.set(room_id, created_match);

        socket.emit('match-found', { players });

        socket.broadcast.to(room_id).emit('match-found', { players });

        queue.delete(room_id);
      };

      queue.forEach((players, room_id) => {
        if (joined) return;
        if (players.size < MATCH_SIZE) {
          players.set(player.id, player);

          socket.join(room_id);

          socket.emit('joined-queue', room_id);

          joined = true;

          if (players.size === MATCH_SIZE) createMatch(room_id, players);
        } else {
          createMatch(room_id, players);
        }
      });
    });

    // On leave queue
    socket.on('leave-queue', (player: Player, room_id: string) => {
      const queue_match = queue.get(room_id);
      if (queue_match) queue_match.delete(player.id);
      socket.leave(room_id);
    });
  });
};
