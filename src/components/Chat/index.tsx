import Nullstack, { NullstackClientContext } from 'nullstack';

import { Models } from '_@types';

import { Button } from '_components/Button';
import { InputWrapper } from '_components/InputWrapper';

import './styles.css';

interface Props {
  onSendChat: (message: string) => void;
  chat: Models.Chat[];
}

export class Chat extends Nullstack<Props> {
  message: string;
  message_list_ref: HTMLUListElement;
  last_message_ref: HTMLLIElement;
  timeout_ref: NodeJS.Timeout;

  async update({ chat }: NullstackClientContext<Props>) {
    if (!chat.length) return;

    if (!this.message_list_ref) return;

    await new Promise(resolve => setTimeout(resolve, 1));

    const last_msg = this.message_list_ref.lastElementChild;
    if (!last_msg) return;

    last_msg.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  handleChat({ onSendChat }: Props) {
    if (!this.message) return;

    onSendChat(this.message);

    this.message = '';
  }

  renderChatMessages({ chat }: Partial<NullstackClientContext<Props>>) {
    return (
      <ul ref={this.message_list_ref}>
        {chat
          .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
          .map(({ sender, message }) => (
            <li ref={this.last_message_ref}>
              <strong>{sender}</strong>: {message}
            </li>
          ))}
      </ul>
    );
  }

  render() {
    return (
      <div class="chat">
        {this.renderChatMessages({})}

        <form onsubmit={this.handleChat}>
          <InputWrapper>
            <input bind={this.message} placeholder="Type your message..." />
          </InputWrapper>

          <Button>Send</Button>
        </form>
      </div>
    );
  }
}
