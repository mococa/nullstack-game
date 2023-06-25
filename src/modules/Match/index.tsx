import Nullstack, {
  BaseNullstackClientContext,
  NullstackClientContext,
} from 'nullstack';
import { Chat } from '_components/Chat';
import { GUI } from './GUI';
import { Models } from '_@types';
import { Match as GameMatch } from '_entities/Match';
import { Skill } from '_entities/Skill';
import { Player } from '_entities/Player';

export class Match extends Nullstack {
  enemy: Player;
  me: Player;

  prepare({ me, socket, router, current_match }: BaseNullstackClientContext) {
    if (!current_match || !me || !socket?.connected) {
      router.url = '/';

      return;
    }

    this.me = me;
    this.enemy = current_match.players.find(({ id }) => id !== me.id);
  }

  hydrate({ socket, current_match, me }: NullstackClientContext) {
    socket.on('chat-received', (chat: Models.Chat) => {
      current_match.chat.push(chat);
    });

    socket.on('match-updated', (match: GameMatch) => {
      console.log({ match });
      current_match.players.forEach(player => {
        const current_player = match.players.find(({ id }) => id === player.id);

        if (!current_player.selected_character) return;

        player.selected_character = current_player.selected_character;

        if (current_player.id === me.id) {
          this.me = player;
        }
      });
    });
  }

  handleChat({
    socket,
    message,
    current_match,
  }: Partial<NullstackClientContext<{ message: string }>>) {
    const chat = {
      message,
      match_id: current_match.id,
      sender: this.me.username,
      timestamp: Date.now(),
    };

    current_match.chat.push(chat);

    socket.emit('chat-sent', chat);
  }

  handleSkill({
    socket,
    skill,
    current_match,
  }: Partial<NullstackClientContext<{ skill: Skill }>>) {
    console.log({ enemy: this.enemy, me: this.me, skill });

    const target = this.me.selected_character.CastSpell(
      skill,
      skill.type === 'heal'
        ? this.me.selected_character
        : this.enemy.selected_character,
    );

    console.log({ target, me: this.me, enemy: this.enemy });

    // if (skill.type !== 'heal') {
    //   this.enemy.selected_character = target;
    // } else {
    //   this.me.selected_character = target;
    // }

    socket.emit('match-update', {
      ...current_match,
      players: [this.me, this.enemy],
    });
  }

  render({ current_match }: NullstackClientContext) {
    console.log(this.enemy);
    return (
      <main>
        <div style="display: flex; justify-content: space-between">
          <GUI.PlayerHealth character={this.me.selected_character} />
          <GUI.PlayerHealth character={this.enemy?.selected_character} />
        </div>

        <div style="flex: 1;"></div>

        <div style="display: flex; gap: 16px">
          <GUI.Skills
            skills={this.me.selected_character.skills}
            onSkillCast={skill => this.handleSkill({ skill })}
          />
        </div>

        <div style="display: flex; gap: 32px">
          <GUI.BasicActions
            onAttack={() => console.log('attack!')}
            onDefend={() => console.log('defend!')}
          />

          <Chat
            chat={current_match.chat}
            onSendChat={message => {
              this.handleChat({ message });
            }}
          />
        </div>
      </main>
    );
  }
}
