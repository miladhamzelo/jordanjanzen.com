import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colors, theme, typography } from '../theme/variables';

const BtnColor = (props) => props.color || theme.buttonText;
const Background = (props) => {
  if (props.bg) {
    return props.bg;
  } else if (props.type === 'secondary') {
    return colors.cyan;
  } else if (props.type === 'success' || props.type === 'submit') {
    return colors.green;
  } else if (props.type === 'warn') {
    return colors.red;
  } else if (props.type === 'login') {
    return colors.lightblack;
  }
  return theme.buttonColor;
};

const Btn = styled.button`
  border: none;
  padding: ${(props) =>
    props.arrows ? '0.25em 0.8em 0.25em 1.5em' : '.25em .7em'};
  position: relative;
  color: ${BtnColor};
  font-family: ${typography.monospace};
  background: ${Background};

  width: ${(props) => (props.wide ? '100%' : 'auto')};
  font-size: ${(props) => {
    if (props.small) {
      return '.8rem';
    } else if (props.large) {
      return '1.7rem';
    }
    return '1.1rem';
  }};
  index: 10;
  &.disabled {
    background: ${colors.grey};
    color: ${colors.black};
  }

  :before,
  :after {
    content: '';
    display: ${(props) => (props.arrows ? 'block' : 'none')};
    position: absolute;
    top: 50%;
    width: 1.2em;
    height: 1.2em;
    transition: 0.2s ease-in;
  }

  :before {
    transform: translateY(-50%) scaleX(0.75) rotate(45deg);
    background: ${(props) => props.arrows || BtnColor};
    left: -0.6em;
  }
  :after {
    transform: translateY(-50%) scaleX(0.75) rotate(45deg);
    background: ${Background};
    right: -0.6em;
  }
`;

const Button = (props) => (
  <Btn
    type={props.type}
    wide={props.wide}
    small={props.small}
    large={props.large}
    color={props.color}
    arrows={props.arrows}
    bg={props.bg}
    onClick={props.onClick}
  >
    {props.text || props.children}
  </Btn>
);

Button.propTypes = {
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'login',
    'success',
    'warn',
    'submit',
  ]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  text: PropTypes.string,
  color: PropTypes.string,
  small: PropTypes.bool,
  large: PropTypes.bool,
  wide: PropTypes.bool,
  arrows: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  bg: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: 'primary',
  children: null,
  text: null,
  color: theme.buttonText,
  bg: null,
  small: false,
  large: false,
  wide: false,
  arrows: false,
  onClick: null,
};

export default Button;
