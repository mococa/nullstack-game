import Nullstack, { NullstackNode } from 'nullstack';

import { Login } from '_modules/Authentication/Login';
import { Lobby } from '_modules/Lobby';
import { Prematch } from '_modules/Prematch';
import { Match } from '_modules/Match';

import './Application.css';

declare function Head(): NullstackNode;

class Application extends Nullstack {
  renderHead() {
    return (
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
    );
  }

  render() {
    return (
      <body>
        <Head />

        <Login route="/" />

        <Lobby route="/lobby" />

        <Prematch route="/prematch" />

        <Match route="/match" />
      </body>
    );
  }
}

export default Application;
