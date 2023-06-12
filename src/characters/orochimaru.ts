import { Character } from '_entities/Character';
import { Skill } from '_entities/Skill';

const orochimaru_skills = [
  new Skill({
    name: 'Ninja attack',
    description: 'Orochimaru attacks with his ninja sword',
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
  }),

  new Skill({
    name: 'Ninja double attack',
    description: 'Orochimaru attacks with his ninja sword twice',
    cost: {
      mana: 20,
    },
    key: 'W',
    value: {
      multiplier: 1,
      value: 20,
    },
    round_cool_down: 4,
    type: 'damage',
  }),
];

export const orochimaru = new Character({
  name: 'Orochimaru',
  skills: orochimaru_skills,
  description: 'Orochimaru is a ninja warrior',
  id: 3,
  image: '/characters/orochimaru.png',
  type: 'warrior',
});
