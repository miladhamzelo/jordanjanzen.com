import * as React from 'react';
import { auth, base, database, provider } from '../base';
import {
  globalStyles,
  loadTheme,
  screenSizes,
  screenSizesPx,
  styled,
} from '../styling';
import { slugify } from '../utilities';
import {
  IAppState,
  ILocalStorage,
  IProjectObject,
  ISecrets,
  ISkillObject,
  ITodoObject,
} from './App.types';
import AppRouter from './AppRouter';
import Footer from './containers/Footer';
import Sidebar from './containers/Sidebar';

const appTheme = loadTheme({});
const { palette } = appTheme;
globalStyles(appTheme);

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  border-top: 2px solid ${palette.darkblack};
  flex-wrap: wrap;

  @media (max-width: ${screenSizes.tablet}) {
    flex-direction: column;
  }
`;

export default class App extends React.Component<{}, IAppState> {
  private _ref?: any[];
  private _localStorage: ILocalStorage;
  private _isLoggedIn: boolean;

  public constructor(props: any) {
    super(props);
    this._updateSize = this._updateSize.bind(this);

    // Authentication
    this._authHandler = this._authHandler.bind(this);
    this._login = this._login.bind(this);
    this._logout = this._logout.bind(this);
    this._setRef = this._setRef.bind(this);

    // Database management
    this._addTodo = this._addTodo.bind(this);
    this._updateTodo = this._updateTodo.bind(this);
    this._removeTodo = this._removeTodo.bind(this);

    this._addProject = this._addProject.bind(this);
    this._updateProject = this._updateProject.bind(this);
    this._removeProject = this._removeProject.bind(this);

    this._addSkill = this._addSkill.bind(this);
    this._removeSkill = this._removeSkill.bind(this);

    this._ref = undefined;
    this._isLoggedIn = false;

    this._localStorage = {
      projects: localStorage.getItem('projects'),
      skills: localStorage.getItem('skills'),
      todos: localStorage.getItem('todos'),
    };

    this.state = {
      addProject: this._addProject,
      addSkill: this._addSkill,
      addTodo: this._addTodo,
      isMobile: window.innerWidth <= screenSizesPx.tablet,
      projects: this._localStorage.projects
        ? JSON.parse(this._localStorage.projects)
        : {},
      removeProject: this._removeProject,
      removeSkill: this._removeSkill,
      removeTodo: this._removeTodo,
      secrets: {},
      skills: this._localStorage.skills
        ? JSON.parse(this._localStorage.skills)
        : {},
      theme: appTheme,
      todos: this._localStorage.todos
        ? JSON.parse(this._localStorage.todos)
        : {},
      updateProject: this._updateProject,
      updateSkill: this._updateSkill,
      updateTodo: this._updateTodo,
    };
  }

  public componentDidMount(): void {
    this._setRef('unauthRef').catch((err: any) => {
      throw err;
    });

    window.addEventListener('resize', this._updateSize);

    auth.onAuthStateChanged(user => {
      if (user) {
        this._authHandler({ user });
      }
    });
  }

  public componentDidUpdate(): void {
    localStorage.setItem('todos', JSON.stringify(this.state.todos));
    localStorage.setItem('projects', JSON.stringify(this.state.projects));
    localStorage.setItem('skills', JSON.stringify(this.state.skills));
  }

  public componentWillUnmount(): void {
    base.removeBinding(this._ref);
    window.removeEventListener('resize', this._updateSize);
  }

  public render(): JSX.Element {
    return (
      <Wrapper className="App wrapper">
        <Sidebar
          isLoggedIn={this._isLoggedIn}
          isMobile={this.state.isMobile}
          login={this._login}
          logout={this._logout}
        />
        <AppRouter {...this.state} isLoggedIn={this._isLoggedIn} />
        {this.state.isMobile ? (
          <Footer
            isLoggedIn={this._isLoggedIn}
            isMobile={this.state.isMobile}
            login={this._login}
            logout={this._logout}
          />
        ) : null}
      </Wrapper>
    );
  }

  private _setRef(ref: 'unauthRef' | 'authRef'): Promise<any[] | string> {
    console.log(`Setting ref: ${ref}`);
    return new Promise((resolve, reject) => {
      if (ref !== 'unauthRef' && ref !== 'authRef') {
        reject(
          `Ref is not correctly defined. Must be either 'unauthRef' or 'authRef'. Was: ${ref}`
        );
      }
      if (this._ref) {
        base.removeBinding(this._ref);
        this._ref = undefined;
      }
      if (ref === 'unauthRef') {
        this._ref = [
          base.bindToState('todos', {
            context: this,
            state: 'todos',
          }),
          base.bindToState('projects', {
            context: this,
            state: 'projects',
          }),
          base.bindToState('skills', {
            context: this,
            state: 'skills',
          }),
        ];
      }

      if (ref === 'authRef') {
        this._ref = [
          base.syncState('todos', {
            context: this,
            state: 'todos',
          }),
          base.syncState('projects', {
            context: this,
            state: 'projects',
          }),
          base.syncState('skills', {
            context: this,
            state: 'skills',
          }),
          base.fetch('secrets', {
            context: this,
            then(data: ISecrets) {
              this.setState({ secrets: data });
            },
          }),
        ];
      }
      resolve('Ref (re)set');
    });
  }

  private _updateSize(): void {
    if (window.innerWidth <= screenSizesPx.tablet) {
      this.setState({ isMobile: true });
    } else {
      this.setState({ isMobile: false });
    }
  }

  private _login(): void {
    auth
      .signInWithPopup(provider)
      .then(result => this._authHandler(result))
      .catch((error: any) => {
        throw error;
      });
  }

  private _logout(): void {
    this._setRef('unauthRef')
      .then(() =>
        auth.signOut().then(() => {
          this._isLoggedIn = false;
          this.setState({
            secrets: {},
          });
        })
      )
      .catch((error: any) => {
        throw error;
      });
  }

  private _authHandler(authData: any): void {
    const uid = authData.user.uid || authData.uid;
    const rootRef = database.ref();
    const successfulLogin = () => {
      this._setRef('authRef');
      this._isLoggedIn = true;
    };
    rootRef.once('value').then(snapshot => {
      const data = snapshot.val() || {};

      if (!data.owner) {
        rootRef
          .set({
            ...data,
            owner: uid,
          })
          .then(() => {
            successfulLogin();
          })
          .catch((error: any) => {
            throw error;
          });
      } else if (data.owner === uid) {
        successfulLogin();
      } else {
        throw new Error('Log in denied. You are not the owner of this site.');
      }
    });
  }

  // update our state
  private _addTodo(todo: ITodoObject): void {
    const todos = { ...this.state.todos };
    const timestamp = Date.now();
    todos[`todo-${timestamp}`] = { ...todo };
    this.setState({ todos }); // same as this.setState({ todos: todos })
  }

  private _updateTodo(key: string, updatedProp: ITodoObject): void {
    const todos = { ...this.state.todos };
    const todo = todos[key];
    const updatedTodo = {
      ...todo,
      ...updatedProp,
    };
    todos[key] = updatedTodo;
    this.setState({
      todos,
    });
  }

  private _removeTodo(key: string): void {
    const todos = { ...this.state.todos };
    todos[key] = null;
    this.setState({ todos });
  }

  private _addProject(project: IProjectObject): void {
    const projects = { ...this.state.projects };
    const timestamp = Date.now();
    projects[`project-${timestamp}`] = project;
    // set state
    this.setState({ projects });
  }

  private _updateProject(key: string, updatedProject: IProjectObject): void {
    const projects = { ...this.state.projects };
    projects[key] = updatedProject;
    this.setState({
      projects,
    });
  }

  private _removeProject(key: string): void {
    const projects = { ...this.state.projects };
    projects[key] = null;
    this.setState({ projects });
  }

  private _addSkill(skill: ISkillObject): void {
    const skills = { ...this.state.skills };
    const name = slugify(skill!.name);
    skills[`skill-${name}`] = skill;
    this.setState({ skills });
  }

  private _updateSkill(key: string, updatedSkill: ISkillObject): void {
    const skills = { ...this.state.skills };
    skills[key] = updatedSkill;
    this.setState({
      skills,
    });
  }

  private _removeSkill(key: string): void {
    console.log('i tried...');
    const skills = { ...this.state.skills };
    skills[key] = null;
    this.setState({ skills });
  }
}
