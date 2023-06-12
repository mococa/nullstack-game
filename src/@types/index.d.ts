export namespace Models {
  export interface CharacterAttributes {
    health: number;
    mana: number;
    strength: number;
    defense: number;
  }

  export type CharacterType = 'warrior' | 'mage' | 'shooter';

  export interface Character {
    type: CharacterType;
    attributes: CharacterAttributes;
  }

  export interface Chat {
    sender: string;
    message: string;
    timestamp: number;
    match_id: string;
  }
}
