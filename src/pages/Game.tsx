// import { Models } from '_@types';
// import { naruto } from '_characters/naruto';
// import { orochimaru } from '_characters/orochimaru';
// import { sakura } from '_characters/sakura';
// import { sasuke } from '_characters/sasuke';
// import { Character } from '_entities/Character';
// import { Match } from '_entities/Match';
// import { Player } from '_entities/Player';
// import Nullstack, { NullstackClientContext } from 'nullstack';

// const available_characters = [naruto, sasuke, orochimaru, sakura];

// export class GamePage extends Nullstack {
//   match: Match;
//   chat_input: string;
//   ready: boolean;
//   ready_list: string[] = [];
//   selected_character: Character;

//   hydrate({ params, me, router }: NullstackClientContext) {
//     if (!me) {
//       return (router.url = '/');
//     }

//     me.socket.emit('get-match', params.id);

//     me.socket.on('match-details', (match: Match) => {
//       this.match = match;
//     });

//     me.socket.on('chat-received', (chat: Models.Chat) => {
//       this.match?.chat.push(chat);
//     });

//     me.socket.on('player-ready', (player: Player) => {
//       this.ready_list.push(player.id);

//       const player_index = this.match?.players.findIndex(
//         ({ id }) => id === player.id,
//       );

//       if (this.ready_list.length === this.match?.players.length) {
//         this.match.players[player_index].selected_character =
//           player.selected_character;

//         me.socket.emit('start-match', this.match?.id);
//       }
//     });

//     me.socket.on('match-started', (match: Match) => {
//       this.match = match;
//     });

//     me.socket.on('match-updated', (match: Match) => {
//       this.match = match;
//       this.selected_character.attributes = match.players.find(
//         ({ id }) => id === me.id,
//       ).selected_character.attributes;

//       match.players.forEach(player => {
//         if (player.selected_character.attributes.health <= 0) {
//           alert(player.name + ' has died!');
//         }
//       });
//     });
//   }

//   handleSubmitChat({ me }: NullstackClientContext) {
//     const chat = {
//       match_id: this.match?.id || '',
//       message: this.chat_input,
//       sender: me.name,
//       timestamp: Date.now(),
//     };

//     me.socket.emit('chat-sent', chat);

//     this.chat_input = '';

//     this.match?.chat.push(chat);
//   }

//   handleReady({ me }: NullstackClientContext) {
//     me.socket.emit(
//       'ready',
//       { ...me, selected_character: this.selected_character, socket: {} },
//       this.match?.id,
//     );

//     this.ready_list.push(me.id);
//     this.ready = true;
//   }

//   renderCharacters() {
//     return (
//       <div>
//         <h4>Characters:</h4>
//         <ul class="character-list">
//           {available_characters.map(c => (
//             <li
//               aria-selected={
//                 this.selected_character?.id === c.id ? 'true' : 'false'
//               }
//               onclick={() => {
//                 this.selected_character = c;
//               }}
//             >
//               <img src={c.image} />

//               <span>{c.name}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   renderPlayers() {
//     return (
//       <div>
//         <h4>Players:</h4>

//         <ul>
//           {this.match?.players.map(p => (
//             <li>
//               {p.name} {this.ready_list.includes(p.id) ? '✅' : ''}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   renderChat() {
//     return (
//       <div>
//         <h4>Chat</h4>

//         <ul>
//           {this.match?.chat?.map(c => (
//             <li>
//               <b>{c.sender}: </b>

//               {c.message}
//             </li>
//           ))}

//           <form onsubmit={this.handleSubmitChat}>
//             <input bind={this.chat_input} />
//             <button>Send</button>
//           </form>
//         </ul>
//       </div>
//     );
//   }

//   renderInGame({ me }: Partial<NullstackClientContext>) {
//     const enemy = this.match?.players.find(({ id }) => id !== me.id);

//     return (
//       <main>
//         <h1>Começou o jogo!!!</h1>

//         <span>{this.match?.starter?.name} é o iniciador</span>

//         <div class="battlefield">
//           <div class="battlefield-player">
//             <span>{me.name}</span>
//             <b>Vida: {this.selected_character.attributes.health || 0}</b>
//             <b>Mana: {this.selected_character.attributes.mana || 0}</b>

//             <img src={this.selected_character.image} />
//           </div>

//           <div class="battlefield-player">
//             <span>{enemy.name}</span>
//             <b>Vida: {enemy.selected_character.attributes.health || 0}</b>
//             <b>Mana: {enemy.selected_character.attributes.mana || 0}</b>

//             <img src={enemy.selected_character.image} />
//           </div>
//         </div>

//         {this.selected_character.skills.map(skill => {
//           const not_enough_mana =
//             this.selected_character.attributes.mana < skill.cost.mana;

//           return (
//             <div>
//               <span>{skill.name}</span>
//               <span>{skill.description}</span>
//               <button
//                 onclick={() => {
//                   if (skill.type === 'damage') {
//                     this.selected_character.CastSpell(
//                       skill,
//                       enemy.selected_character,
//                     );
//                   } else {
//                     this.selected_character.CastSpell(
//                       skill,
//                       this.selected_character,
//                     );
//                   }

//                   this.match.round++;

//                   me.socket.emit('update-match', this.match);

//                   this.match.players.forEach(player => {
//                     if (player.selected_character.attributes.health <= 0) {
//                       alert(player.name + ' has died!');
//                     }
//                   });
//                 }}
//                 disabled={
//                   not_enough_mana ||
//                   (this.match.starter?.id === me.id
//                     ? this.match.round % 2 === 0
//                     : this.match.round % 2 === 1)
//                 }
//               >
//                 Usar
//               </button>
//             </div>
//           );
//         })}
//       </main>
//     );
//   }

//   renderCharacterSelection({}: Partial<NullstackClientContext>) {
//     return (
//       <main>
//         <h1>Game: {this.match?.id}</h1>

//         {this.renderPlayers()}

//         <br />

//         {this.renderCharacters()}

//         <button
//           disabled={this.ready || !this.selected_character}
//           onclick={this.handleReady}
//         >
//           Ready!
//         </button>

//         <br />

//         {this.renderChat()}
//       </main>
//     );
//   }

//   render() {
//     return this.match?.started
//       ? this.renderInGame({})
//       : this.renderCharacterSelection({});
//   }
// }
