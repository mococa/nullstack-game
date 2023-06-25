import Nullstack, {
  NullstackClientContext,
  NullstackServerContext,
} from 'nullstack';

import { Button } from '_components/Button';
import { InputWrapper } from '_components/InputWrapper';

import './styles.css';

interface SignIn {
  username: string;
  password: string;
}

export class Login extends Nullstack {
  username: string;
  password: string;

  static async SignIn({
    db,
    username,
    password,
  }: Partial<NullstackServerContext<SignIn>>) {
    const user = db.players.find(
      ({ username: player_username }) => player_username === username,
    );

    if (!user) return { error: 'Invalid username (<-) or password' };

    if (user.password !== password)
      return { error: 'Invalid username or password (<-)' };

    return { user: { ...user, password: '' } };
  }

  async handleSubmit(context: NullstackClientContext) {
    const { user, error } = await Login.SignIn({
      username: this.username,
      password: this.password,
    });

    if (error) return alert(error);

    context.me = { ...user };
    context.router.path = '/lobby';
  }

  render() {
    return (
      <main>
        <form onsubmit={this.handleSubmit} class="auth-form">
          <div class="title">
            <h1>The Cool Game</h1>

            <h2>Login</h2>
          </div>

          <InputWrapper label="Username">
            <input bind={this.username} />
          </InputWrapper>

          <InputWrapper label="Password">
            <input bind={this.password} />
          </InputWrapper>

          <Button>Play</Button>
        </form>
      </main>
    );
  }
}
