import Nullstack, { NullstackServerContext } from 'nullstack';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { Player } from '_entities/Player';
import { Match } from '_entities/Match';

import Application from '_Application';

import { setup_io_server } from 'utils/setup_io_server';

const context = Nullstack.start(Application) as NullstackServerContext;

const db_players = [
  new Player({ id: '1', name: 'Player 1' }),
  new Player({ id: '2', name: 'Player 2' }),
  new Player({ id: '3', name: 'Player 3' }),
  new Player({ id: '4', name: 'Player 4' }),
  new Player({ id: '5', name: 'Player 5' }),
];

context.db = { players: db_players };

context.start = async function start() {
  const MATCH_SIZE = 2;
  const queue: Map<string, Map<string, Player>> = new Map();
  const matches: Map<string, Match> = new Map();

  context.matches = matches;
  context.queue = queue;
  context.MATCH_SIZE = MATCH_SIZE;

  const socket_server = createServer();

  const ws = new Server(socket_server, {
    connectTimeout: 2000,
    cors: { origin: '*' },

    transports: ['websocket', 'polling'],
  });

  setup_io_server(ws, { MATCH_SIZE, matches, queue });

  socket_server.listen(3001, () => {
    console.log('Socket server listening on port 3001');
  });
};

export default context;
