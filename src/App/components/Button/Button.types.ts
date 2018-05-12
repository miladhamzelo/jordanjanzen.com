import { TChildren } from '../../App.types';

export interface IButton {
  focus: () => void;
}

export interface IButtonProps {
  arrows?: boolean | string;
  bg?: string;
  buttonType?: ButtonType;
  children?: TChildren;
  circle?: boolean;
  className?: string;
  color?: string;
  del?: boolean;
  href?: string;
  large?: boolean;
  pill?: boolean;
  rel?: string;
  small?: boolean;
  style?: {};
  target?: string;
  text?: string;
  to?: string;
  type?: string;
  wide?: boolean;
  onClick?: (e?: any) => void;
  icon?: boolean;
}

export interface IButtonStyleProps {
  arrows?: boolean | string;
  bg?: string;
  buttonType?: ButtonType;
  circle?: boolean;
  className?: string;
  color?: string;
  del?: boolean;
  large?: boolean;
  pill?: boolean;
  small?: boolean;
  wide?: boolean;
}

export enum ButtonType {
  Cta,
  Danger,
  Delete,
  Login,
  Primary,
  Secondary,
  Submit,
  Subtle,
  Success,
  Warn,
}

export enum SocialSites {
  codepen,
  facebook,
  github,
  google,
  linkedin,
  twitter,
}

export interface ISocialButton extends IButtonProps {
  social: SocialSites;
  className?: string;
}
