import { HTMLAttributes } from 'nullstack';

import './styles.css';

export const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button class="button" {...props}>
      {props.children}
    </button>
  );
};
