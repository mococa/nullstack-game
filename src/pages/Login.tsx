import Nullstack, {
  NullstackClientContext,
  NullstackServerContext,
} from 'nullstack';

export class LoginPage extends Nullstack {
  id: string;

  static async Login({
    id,
    db,
  }: Partial<NullstackServerContext<{ id: string }>>) {
    const player = db.players.find(({ id: player_id }) => player_id === id);

    return { player };
  }

  async handleFormData(context: Partial<NullstackClientContext>) {
    try {
      const { player } = await LoginPage.Login({ id: this.id });

      if (!player) throw new Error('Player not found');

      context.me = player;
      context.router.path = '/home';
    } catch (error) {
      console.log({ error });
      alert((error as Error).message);
    }
  }

  render() {
    return (
      <main>
        <h1>Login</h1>

        <form onsubmit={this.handleFormData}>
          <input required bind={this.id} />

          <button>Login</button>
        </form>
      </main>
    );
  }
}
