import Nullstack, { NullstackClientContext, NullstackNode } from 'nullstack';

import './Application.css';
import { HomePage } from '_pages/Home';
import { LoginPage } from '_pages/Login';
import { GamePage } from '_pages/Game';

declare function Head(): NullstackNode;

class Application extends Nullstack {
  renderHead() {
    return (
      <head>
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </head>
    );
  }

  render() {
    return (
      <body>
        <Head />

        <LoginPage route="/" />

        <HomePage route="/home" />

        <GamePage route="/game/:id" />
      </body>
    );
  }
}

export default Application;
