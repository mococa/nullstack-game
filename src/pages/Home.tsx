import Nullstack, { NullstackClientContext } from 'nullstack';
import { io, Socket } from 'socket.io-client';

export class HomePage extends Nullstack {
  socket: Socket;
  queue_id = '';

  prepare({ me, router }: NullstackClientContext) {
    if (!me) router.url = '/';
  }

  hydrate({ me, router }: NullstackClientContext) {
    // Client socket connection
    const socket = io(':3001');

    // On connect
    socket.on('connected', connected_msg => {
      // Letting user know they're connected by console.logging it
      console.log(connected_msg);

      // Triggering re-render to enable send button
      this.socket = socket;
      me.socket = socket;
    });

    socket.on('joined-queue', queue_id => {
      this.queue_id = queue_id;
    });

    socket.on('match-found', () => {
      router.url = `/game/${this.queue_id}`;
    });
  }

  handleEnterQueue({ me }: Partial<NullstackClientContext>) {
    if (!this.socket?.connected) return;

    this.socket.emit('enter-queue', { ...me, socket: {} });
  }

  handleLeaveQueue({ me }: Partial<NullstackClientContext>) {
    if (!this.socket?.connected) return;
    this.socket.emit('leave-queue', { ...me, socket: {} }, this.queue_id);
    this.queue_id = '';
  }

  render({ me }: NullstackClientContext) {
    return (
      <main>
        <h1>Home</h1>

        <h3>Welcome, {me?.name}!</h3>

        <button
          onclick={
            this.queue_id ? this.handleLeaveQueue : this.handleEnterQueue
          }
        >
          {this.queue_id ? 'Leave queue' : 'Enter queue'}
        </button>
      </main>
    );
  }
}
