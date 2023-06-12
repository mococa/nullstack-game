import { Models } from '_@types';
import { Skill } from './Skill';

interface Props {
  name: string;
  description: string;
  image: string;
  id: number;
  skills: Skill[];
  type: Models.CharacterType;
}

export class Character {
  name: string;
  description: string;
  image: string;
  id: number;
  skills: Skill[];
  type: Models.CharacterType;
  attributes: Models.CharacterAttributes;

  constructor({ name, description, image, id, skills, type }: Props) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.id = id;
    this.skills = skills;
    this.type = type;

    switch (type) {
      case 'warrior':
        this.attributes = {
          strength: 10,
          health: 100,
          defense: 5,
          mana: 100,
        };

      case 'mage':
        this.attributes = {
          strength: 5,
          health: 60,
          defense: 5,
          mana: 200,
        };

      case 'shooter':
        this.attributes = {
          strength: 5,
          health: 100,
          defense: 5,
          mana: 100,
        };
    }
  }

  CastSpell(skill: Skill, target: Character) {
    if ((skill.cost.mana || 0) > this.attributes.mana) {
      throw new Error('Not enough mana');
    }

    if (skill.cost.health > this.attributes.health) {
      throw new Error('Not enough health');
    }

    this.attributes.mana -= skill.cost.mana || 0;
    this.attributes.health -= skill.cost.health || 0;
    this.attributes.health -= skill.cost.health || 0;

    if (skill.type === 'damage') {
      target.attributes.health +=
        (target.attributes.defense || 0) - skill.damage;
    }

    if (skill.type === 'heal') {
      target.attributes.health += skill.heal;
    }
  }
}
