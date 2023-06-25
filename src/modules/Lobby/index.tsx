import Nullstack, { NullstackClientContext } from 'nullstack';

import './styles.css';
import { Button } from '_components/Button';
import { Socket, io } from 'socket.io-client';
import { MatchFound } from '_components/Modals/MatchFound';
import { Match } from '_entities/Match';

export class Lobby extends Nullstack {
  socket: Socket;
  accepted_players: string[] = [];
  match_found: boolean;
  queue_id = '';

  prepare({ me, router }: NullstackClientContext) {
    if (!me) router.url = '/';
  }

  hydrate(ctx: NullstackClientContext) {
    // Client socket connection
    const socket = io(':3001');

    // On connect
    socket.on('connected', (connected_msg: string) => {
      // Letting user know they're connected by console.logging it
      console.log(connected_msg);

      this.socket = socket;
    });

    socket.on('joined-queue', (queue_id: string) => {
      this.queue_id = queue_id;
    });

    socket.on('match-found', () => {
      this.match_found = true;
    });

    socket.on('match-ignored', () => {
      this.match_found = false;
      this.accepted_players = [];

      socket.emit('enter-queue', ctx.me);
    });

    socket.on('match-accepted', (player_id: string, match_size: number) => {
      this.accepted_players.push(player_id);

      if (match_size === this.accepted_players.length)
        this.socket.emit('pre-match-start', this.queue_id);
    });

    socket.on('pre-match-started', (match: Match) => {
      ctx.current_match = match;
      ctx.router.url = '/prematch';
    });

    ctx.socket = socket;
  }

  terminate({ socket }: NullstackClientContext) {
    socket.removeAllListeners();
  }

  handleQueue({ me }: Partial<NullstackClientContext>) {
    if (this.queue_id) {
      // Leave queue
      if (!this.socket?.connected) return;

      this.socket.emit('leave-queue', me, this.queue_id);
      this.queue_id = '';
      this.accepted_players = [];

      return;
    }

    // Enter queue
    if (!this.socket?.connected) return;

    this.socket.emit('enter-queue', me);
  }

  handleLogout(ctx: NullstackClientContext) {
    ctx.me = null;
    ctx.router.url = '/';
  }

  render({ me }: NullstackClientContext) {
    return (
      <main class="lobby">
        {this.match_found && (
          <MatchFound
            onAccept={() => {
              this.accepted_players.push(me.id);
              this.socket.emit('match-accept', me.id, this.queue_id);
            }}
            onIgnoreQueue={() => {
              this.socket.emit('leave-queue', me, this.queue_id);
              this.socket.emit('ignore-match', me.id, this.queue_id);
              this.match_found = false;
              this.queue_id = '';
              this.accepted_players = [];
            }}
          />
        )}

        <h1>The Cool Game</h1>

        <h2>Welcome, {me?.username}</h2>

        <Button onclick={this.handleQueue}>
          {this.queue_id ? 'Leave queue' : 'Join queue'}
        </Button>

        <Button onclick={this.handleLogout}>Logout</Button>
      </main>
    );
  }
}
