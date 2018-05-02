import React from 'react';
import styled from 'styled-components';

import { Button } from './Button';

import codeLoader from '../../images/codeLoader.svg';
import { colors } from '../../styling';

const Loader = styled.div`
  border: 3px solid ${colors.black};
  border-top: 0;
  padding: 0 1.2em;
  position: relative;
  max-width: 420px;
  overflow: hidden;
  background: ${colors.lightwhite};
`;

const Frame = styled.div`
  background: ${colors.black};
  width: 100%;
  height: 28px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;

  .close {
    position: absolute;
    right: 2px;
    top: 4px;
    margin: 0;
    transform: scale(0.67);
    cursor: progress;
  }
`;

const Scrollbar = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 24px;
  height: 100%;
  background: ${colors.white};

  &:after {
    content: '';
    display: block;
    width: 17px;
    height: 60px;
    position: absolute;
    top: 32px;
    right: 3px;
    border-radius: 9px;
    background: rgba(0, 0, 0, 0.2);
  }
`;

export const StyledLoader = () => (
  <Loader>
    <Frame>
      <Button to="#" type="delete" />
    </Frame>
    <object type="image/svg+xml" data={codeLoader}>
      loading...
    </object>
    <Scrollbar />
  </Loader>
);

export default StyledLoader;