import { NullstackNode } from 'nullstack';

import './styles.css';

interface Props {
  label?: string;

  children?: NullstackNode;
}

export const InputWrapper = ({ label, children }: Props) => (
  <label class="input-wrapper">
    {label && <span>{label}</span>}

    {children}
  </label>
);
