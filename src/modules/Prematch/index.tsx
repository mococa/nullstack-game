import Nullstack, { NullstackClientContext } from 'nullstack';

import { Models } from '_@types';

import { Chat } from '_components/Chat';
import { Button } from '_components/Button';

import { Character } from '_entities/Character';

import './styles.css';
import { characters } from '_characters';
import { Player } from '_entities/Player';

export class Prematch extends Nullstack {
  ready: boolean;
  selected_character: Character;
  players_ready: string[] = [];

  prepare({ me, router, current_match }: NullstackClientContext) {
    if (!me || !current_match) {
      router.url = '/';
      return;
    }
  }

  hydrate({ socket, current_match, router, me }: NullstackClientContext) {
    socket.on('chat-received', (chat: Models.Chat) => {
      current_match.chat.push(chat);
    });

    socket.on('player-ready', (player: Player, match_size: number) => {
      if (!this.players_ready.includes(player.id)) {
        this.players_ready.push(player.id);

        if (player.selected_character) {
          const enemy = current_match.players.find(
            ({ id }) => id === player.id,
          );
          if (enemy) {
            enemy.selected_character = player.selected_character;
          } else {
            current_match.players.push(player);
          }
        }
      }

      if (match_size === this.players_ready.length) {
        current_match.chat.push({
          match_id: current_match.id || '',
          message: 'All players are ready. Starting soon... Get ready !',
          sender: 'System',
          timestamp: Date.now(),
        });

        setTimeout(() => {
          current_match.chat = [];
          socket.removeListener('player-ready');
          socket.removeListener('chat-received');

          router.url = '/match';
        }, 2000);
      }
    });

    socket.on('player-disconnected', () => {
      current_match.chat.push({
        match_id: current_match.id || '',
        message: 'Opponent has left the match. Returning to Lobby...',
        sender: 'System',
        timestamp: Date.now(),
      });

      setTimeout(() => {
        me.selected_character = null;

        socket.removeAllListeners();

        router.url = '/lobby';

        current_match = null;
      }, 1000);
    });
  }

  handleSubmitChat({
    me,
    message,
    socket,
    current_match,
  }: Partial<NullstackClientContext<{ message: string }>>) {
    const chat = {
      match_id: current_match.id || '',
      message,
      sender: me.username,
      timestamp: Date.now(),
    };

    socket.emit('chat-sent', chat);

    current_match.chat.push(chat);
  }

  handleReady({ socket, me }: NullstackClientContext) {
    if (!this.selected_character?.id) return;

    if (!this.players_ready.includes(me.id)) this.players_ready.push(me.id);

    this.ready = true;

    me.selected_character = this.selected_character;

    socket.emit('ready', me);
  }

  render({ current_match }: NullstackClientContext) {
    return (
      <main class="prematch">
        <div class="column gap-24">
          <h3>Waiting for all players to be ready</h3>

          <h2>Choose your character</h2>

          <div class="character-selection">
            {characters.map(c => (
              <img
                src={c.image}
                alt={c.name}
                aria-selected={
                  this.selected_character?.id === c.id ? 'true' : 'false'
                }
                onclick={() => !this.ready && (this.selected_character = c)}
              />
            ))}
          </div>

          <Button onclick={this.handleReady} disabled={this.ready}>
            Ready
          </Button>
        </div>

        <div class="chat-container">
          <Chat
            onSendChat={message => this.handleSubmitChat({ message })}
            chat={current_match.chat || []}
          />
        </div>
      </main>
    );
  }
}
