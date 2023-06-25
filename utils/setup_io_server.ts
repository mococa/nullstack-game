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

    // // On match ready
    // socket.on('ready', (player: Player, room_id: string) => {
    //   matches.get(room_id).players.forEach(p => {
    //     if (p.id === player.id)
    //       p.selected_character = player.selected_character;
    //   });

    //   socket.broadcast.to(room_id).emit('player-ready', player);
    // });

    // // Start match
    // socket.on('start-match', (room_id: string) => {
    //   const match = matches.get(room_id);

    //   match.start();

    //   socket.broadcast.to(match.id).emit('match-started', match);
    //   socket.emit('match-started', match);
    // });

    // // Update match
    // socket.on('update-match', (match: Match) => {
    //   matches.set(match.id, match);

    //   socket.broadcast.to(match.id).emit('match-updated', match);
    // });

    // On chat sent
    socket.on('chat-sent', (chat: Models.Chat) => {
      socket.broadcast.to(chat.match_id).emit('chat-received', chat);
    });

    // Update match
    socket.on('match-update', (match: Match) => {
      matches.set(match.id, match);

      socket.broadcast.to(match.id).emit('match-updated', match);
    });

    // On enter a queue, either create a new queue or join an existing one
    socket.on('enter-queue', (player: Player) => {
      let selected_queue: Map<string, Player>;
      let queue_id: string;

      // For each queue, find one where it's not full
      queue.forEach((players, room_id) => {
        if (players.size < MATCH_SIZE) {
          selected_queue = queue.get(room_id);
          queue_id = room_id;
          return;
        }
      });

      if (!queue_id) queue_id = v4();

      // If no queue is found, create a new one
      if (!selected_queue) {
        selected_queue = new Map<string, Player>();
      }

      // Enter the queue
      selected_queue.set(player.id, player);
      queue.set(queue_id, selected_queue);
      socket.join(queue_id);
      socket.emit('joined-queue', queue_id);

      // If player fills the queue, emit match-found
      if (selected_queue.size === MATCH_SIZE) {
        const players = [...selected_queue.values()];

        socket.emit('match-found', { players });
        socket.broadcast.to(queue_id).emit('match-found', { players });
      }
    });

    // On leave queue
    socket.on('leave-queue', (player: Player, room_id: string) => {
      const queue_match = queue.get(room_id);
      if (queue_match) queue_match.delete(player.id);
      socket.leave(room_id);
    });

    // On ignore match
    socket.on('ignore-match', (player_id: string, room_id: string) => {
      const queue_match = queue.get(room_id);
      if (queue_match) queue_match.delete(player_id);

      socket.broadcast.to(room_id).emit('match-ignored');
    });

    socket.on('match-accept', (player_id: string, queue_id: string) => {
      // Broadcast to queue that this player_id has match-accepted
      socket.broadcast
        .to(queue_id)
        .emit('match-accepted', player_id, MATCH_SIZE);
    });

    socket.on('disconnecting', () => {
      // Broadcast to queue that this player_id has disconnected
      socket.rooms.forEach(room_id => {
        socket.broadcast.to(room_id).emit('player-disconnected');
        socket.rooms.delete(room_id);
      });
    });

    socket.on('pre-match-start', (queue_id: string) => {
      const players = [...queue.get(queue_id).values()];

      const match = new Match({ players, id: queue_id });

      matches.set(queue_id, match);

      socket.broadcast.to(queue_id).emit('pre-match-started', match);
      socket.emit('pre-match-started', match);
    });

    socket.on('ready', (player: Player) => {
      socket.broadcast.emit('player-ready', player, MATCH_SIZE);
      socket.emit('player-ready', player, MATCH_SIZE);
    });
  });
};
