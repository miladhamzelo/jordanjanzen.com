import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, theme } from '../theme/variables';

const Title = styled.header`
  background: ${colors.black};
  width: 100%;

  h2 {
    color: ${theme.secondaryColor};
    display: inline-block;
    width: 100%;
    font-family: 'FiraCode', monospace;
    text-transform: lowercase;
    text-align: center;

    &:before {
      content: '<';
      display: inline-block;
      padding-right: 0.25em;
    }

    &:after {
      content: '/>';
      display: inline-block;
      padding-left: 0.25em;
    }
  }
`;

const PageTitle = props => (
  <Title>
    <h2>{props.title}</h2>
  </Title>
);

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
