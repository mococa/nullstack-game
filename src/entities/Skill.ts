import { Models } from '_@types';

interface SkillValue {
  value?: number;
  multiplier?: number;
}

interface Props {
  name: string;
  description: string;
  type: 'damage' | 'heal';
  value: SkillValue;
  key: 'Q' | 'W' | 'E' | 'R';
  cost: Partial<Models.CharacterAttributes>;
  round_cool_down: number;
}

export class Skill {
  name: string;
  description: string;
  type: 'damage' | 'heal';
  key: 'Q' | 'W' | 'E' | 'R';
  cost: Partial<Models.CharacterAttributes>;
  damage: number;
  heal: number;
  round_cool_down: number;

  constructor({
    name,
    type,
    key,
    description,
    cost,
    round_cool_down,
    value,
  }: Props) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.key = key;
    this.cost = cost;
    this.round_cool_down = round_cool_down;

    if (this.type === 'damage') {
      this.damage = (value.value || 0) * (value.multiplier || 1);
    }

    if (this.type === 'heal') {
      this.heal = (value.value || 0) * (value.multiplier || 1);
    }
  }
}
