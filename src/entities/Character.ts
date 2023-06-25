import { Models } from '_@types';
import { Skill } from './Skill';

interface Props {
  name: string;
  description: string;
  image: string;
  id: number;
  skills: Skill[];
  type: Models.CharacterType;
  attributes: Models.CharacterAttributes;
  max_health: number;
  max_mana: number;
}

export class Character {
  name: string;
  description: string;
  image: string;
  id: number;
  skills: Skill[];
  type: Models.CharacterType;
  attributes: Models.CharacterAttributes;

  max_health: number;
  max_mana: number;

  constructor({
    name,
    description,
    image,
    id,
    skills,
    type,
    max_health,
    max_mana,
    attributes,
  }: Props) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.id = id;
    this.skills = skills;
    this.type = type;
    this.max_health = max_health;
    this.max_mana = max_mana;
    this.attributes = attributes;
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
