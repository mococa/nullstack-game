import Nullstack, { NullstackClientContext } from 'nullstack';

import { Button } from '_components/Button';

import './styles.css';
import '../styles.css';

interface Props {
  onIgnoreQueue: () => void;
  onAccept: () => void;
}

export class MatchFound extends Nullstack<Props> {
  timeout: NodeJS.Timeout;
  accepted: boolean;

  hydrate({ onIgnoreQueue }: NullstackClientContext<Props>) {
    this.timeout = setTimeout(() => {
      onIgnoreQueue();
    }, 6000);
  }

  handleAccept({ onAccept }: NullstackClientContext<Props>) {
    this.accepted = true;
    clearTimeout(this.timeout);

    onAccept();
  }

  render() {
    return (
      <div class="modal-foreground">
        <div class="modal-content match-found-content">
          <h2>Match Found!</h2>

          <div class="timer" />

          <Button disabled={this.accepted} onclick={this.handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    );
  }
}
