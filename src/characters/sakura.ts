import { Character } from '_entities/Character';
import { Skill } from '_entities/Skill';

const sakura_skills = [
  new Skill({
    name: 'Poke',
    description: 'Sakura pokes the enemy.',
    cost: {
      mana: 10,
    },
    key: 'Q',
    round_cool_down: 1,
    type: 'damage',
    value: {
      value: 10,
    },
    image: '/skills/4.png',
  }),

  new Skill({
    name: 'Ninja heal',
    description: 'Sakura heals herself.',
    cost: {
      mana: 50,
    },
    key: 'W',
    round_cool_down: 3,
    type: 'heal',
    value: {
      value: 10,
    },
    image: '/skills/5.png',
  }),
];

export const sakura = new Character({
  name: 'Sakura',
  skills: sakura_skills,
  description:
    'Sakura is a ninja who is always ready to fight. She is also a very good fighter.',
  id: 4,
  image: '/characters/sakura.png',
  type: 'warrior',
  attributes: {
    defense: 10,
    health: 100,
    mana: 100,
    strength: 20,
  },
  max_health: 100,
  max_mana: 100,
});
