import { Character } from '_entities/Character';
import { Skill } from '_entities/Skill';

const sasuke_skills: Skill[] = [
  new Skill({
    name: 'Sharingan',
    description: 'Sasuke uses his katana to cut his enemies',
    cost: {
      mana: 10,
    },
    key: 'Q',
    round_cool_down: 2,
    type: 'damage',
    value: {
      value: 10,
    },
  }),

  new Skill({
    name: 'Chidori',
    description: 'Sasuke uses chidori to cut his enemies',
    cost: {
      mana: 10,
    },
    key: 'W',
    round_cool_down: 2,
    type: 'damage',
    value: {
      value: 10,
      multiplier: 2,
    },
  }),
];

export const sasuke = new Character({
  name: 'Sasuke',
  skills: sasuke_skills,
  description: 'Sasuke is a ninja',
  id: 2,
  image: '/characters/sasuke.png',
  type: 'shooter',
});
