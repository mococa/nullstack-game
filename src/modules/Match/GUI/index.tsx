import { Character } from '_entities/Character';

import './styles.css';
import { Button } from '_components/Button';
import { Skill } from '_entities/Skill';

interface PlayerHealthProps {
  character: Character;
}

const PlayerHealth = ({ character }: PlayerHealthProps) => (
  <div class="gui-player-health">
    <img src={character?.image} alt={character?.name} />

    <div class="health-bar">
      <div class="health-main-container">
        <div class="character-name">{character?.name}</div>
        <div class="health-bar--outline">
          <div class="health-bar--border">
            <div class="health-bar--background">
              <div
                class="health-bar--health"
                style={`--health: ${character?.attributes?.health}; --max-health: ${character?.max_health}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mana-indicator"
        style={`--mana: '${character?.attributes.mana}'; --max-mana: '${character?.max_mana}'`}
      >
        /
      </div>
    </div>
  </div>
);

interface BasicActionsProps {
  onAttack: () => void;
  onDefend: () => void;
}

const BasicActions = ({ onAttack, onDefend }: BasicActionsProps) => (
  <div class="gui-basic-actions">
    <Button onclick={onAttack}>Basic Attack</Button>
    <Button onclick={onDefend}>Defend</Button>
  </div>
);

interface SkillsProps {
  skills: Skill[];
  onSkillCast: (skill: Skill) => void;
}

const Skills = ({ skills, onSkillCast }: SkillsProps) => (
  <div class="gui-skills">
    {skills.map(skill => (
      <div class="skill-tooltip-container">
        <div class="skill-tooltip">
          <header>
            <span>{skill.name}</span>

            <b>{skill.cost.mana}</b>
          </header>

          <span>{skill.description}</span>
        </div>

        <button onclick={() => onSkillCast(skill)}>
          <img height={48} width={48} src={skill.image} alt={skill.name} />
        </button>
      </div>
    ))}
  </div>
);

export const GUI = {
  PlayerHealth,
  BasicActions,
  Skills,
};
