import { Character } from '_entities/Character';
import { Skill } from '_entities/Skill';

const naruto_skills = [
  new Skill({
    name: 'Shuriken',
    description: 'Naruto throws a shuriken at a target',
    cost: {
      mana: 10,
    },
    key: 'Q',
    type: 'damage',
    value: {
      multiplier: 1,
      value: 10,
    },
    round_cool_down: 1,
    image: '/skills/1.png',
  }),

  new Skill({
    name: 'Ninja heal',
    description: 'Naruto heals himself',
    cost: {
      mana: 10,
    },
    key: 'W',
    value: {
      multiplier: 1,
      value: 10,
    },
    round_cool_down: 3,
    type: 'heal',
    image: '/skills/2.png',
  }),
];

export const naruto = new Character({
  name: 'Naruto Uzumaki',
  skills: naruto_skills,
  description:
    'Naruto Uzumaki é um ninja que trabalha em uma das empresas mais importantes da tecnologia.',
  id: 1,
  image: '/characters/naruto.png',
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
