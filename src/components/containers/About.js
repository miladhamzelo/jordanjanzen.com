import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import AddSkillForm from '../AddSkillForm';
import Button from '../Button';
import CloudImage from '../CloudImage';

import { Page, Row } from '../../theme/grid';
import { colors, typography } from '../../theme/variables';
import { mediaMin } from '../../theme/style-utils';

const SkillsRow = styled(Row)`
  display: flex;
  flex-wrap: wrap;
`;

const SkillsColumn = styled.ul`
  flex: 1;
  padding: 0;
  margin: 0 0 1em;
  list-style: none;
  min-width: 200px;

  h3,
  li {
    text-align: center;
  }

  h3 {
    color: ${colors.blue};
    padding: 0.5em 0;
    margin: 0 0 0.75em 0;
    border-bottom: 2px solid ${colors.blue};
  }

  li {
    font-family: ${typography.monospace};
    line-height: 1.5;
    padding: 0 1em;
    margin: 1em 0;
    font-size: 0.85rem;

    ${mediaMin.phone`
      font-size: 0.75rem;
    `};

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

class About extends Component {
  constructor(props) {
    super(props);
    this.renderList = this.renderList.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
  }

  removeSkill(key) {
    this.props.removeSkill(key);
  }

  renderList(category) {
    return Object.keys(this.props.skills).map((key) => {
      if (this.props.skills[key].category === category) {
        return (
          <li key={key}>
            {this.props.skills[key].name}
            {this.props.uid ? (
              <Button
                to="#"
                type="delete"
                onClick={() => this.removeSkill(key)}
              />
            ) : null}
          </li>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <Page title="About">
        <Row>
          <h2>About, Skills and Interests</h2>
          <SkillsRow child>
            <SkillsColumn>
              <h3>Core</h3>
              {this.renderList('core')}
            </SkillsColumn>
            <SkillsColumn>
              <h3>Libraries</h3>
              {this.renderList('library')}
            </SkillsColumn>
            <SkillsColumn>
              <h3>Design</h3>
              {this.renderList('design')}
            </SkillsColumn>
          </SkillsRow>
          {this.props.uid ? (
            <Row child>
              <AddSkillForm addSkill={this.props.addSkill} />
            </Row>
          ) : null}
        </Row>
        <Row>
          <h3>A bit about me...</h3>
          <p>
            <CloudImage
              publicId="Xander_with_finger_paint"
              name="My son Xander finger painting with our dog Gizmo in the background."
              align="right"
              width="200"
              link
            />
            I'm really passionate about design and making everything I touch on
            the web better. I'm never satisfied with my skillset and am
            constantly striving to be better and learn as much as I can when the
            time allows. There isn't time to learn everything though. My wife
            Lee and I had our son Xander{' '}
            {moment(20160216, 'YYYYMMDD').fromNow()} and watching him grow and
            play with our shiba inu Gizmo has been my greatest joy in life.
          </p>
          <p>
            Recently I've dived head first into learning React.js and am loving
            it. So much so I decided to build this portfolio with it to
            challenge myself. Do you need React to build a <em>simple</em>{' '}
            portfolio site? <strong>Of course not.</strong> Is actually building
            something in production the best way to learn something?{' '}
            <strong>¯\_(ツ)_/¯</strong>
            <br />You can find more of what I'm learning by{' '}
            <a
              href="https://github.com/jordandrako/"
              target="_blank"
              rel="noopener noreferrer"
            >
              inspecting my GitHub profile
            </a>.
          </p>
          <p>
            <strong>My worklow: </strong>
            I have used many systems, programs and workflows over the years,
            jumping back forth between Windows and Linux. Currently, I'm most
            comfortable using{' '}
            <a
              href="https://code.visualstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              VS Code
            </a>, complimented by{' '}
            <a
              href="https://hyper.is"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hyperterm
            </a>{' '}
            with zsh.
          </p>
          <p>
            <strong>In my spare time</strong> I enjoy being the biggest nerd
            possible. I build PCs, build home automation systems, manage linux
            and media servers. Mostly, though, I play PC games. If you'd like to
            add me on{' '}
            <a
              href="https://steamcommunity.com/id/jordandrako/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Steam, here's my community page
            </a>. I'm also obsessed with making the best coffee possible; my
            favorite brewing methods are the Chemex, Kalita Wave and my{' '}
            <a
              href="https://sca.coffee/certified-home-brewer/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SCA
            </a>{' '}
            certified Behmor Brazen Plus drip machine (like I said, obsessed).
          </p>
        </Row>
        <Row>
          <h2>Work History</h2>
        </Row>
      </Page>
    );
  }
}

About.propTypes = {
  uid: PropTypes.string,
  skills: PropTypes.object.isRequired,
  addSkill: PropTypes.func.isRequired,
  removeSkill: PropTypes.func.isRequired,
};

About.defaultProps = {
  uid: null,
};

export default About;
