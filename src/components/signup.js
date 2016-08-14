import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  signupUser,
  clearError,
} from '../actions';

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const mapStateToProps = (state) => (
  {
    auth: state.auth,
  }
);

// example class based component (smart component)
class SignUp extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      emailClass: 'normal',
      passwordClass: 'normal',
      confirmPasswordClass: 'normal',
      emailPlaceholder: 'Email',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.getContent = this.getContent.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onFieldClick = this.onFieldClick.bind(this);
    this.clearFields = this.clearFields.bind(this);
    this.fieldsEmpty = this.fieldsEmpty.bind(this);
  }

  componentDidMount(props) {
    if (typeof localStorage.token !== 'undefined') {
      localStorage.setItem('signup', 'Already logged in!');
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(props) {
    if (typeof localStorage.token !== 'undefined') {
      localStorage.setItem('signup', 'Already logged in!');
      this.props.history.push('/');
    }
  }

  onSubmit(e) {
    const newState = {};

    if (this.state.email.trim() === '' || !emailRegex.test(this.state.email.trim())) {
      if (this.state.email.trim() === '') {
        newState.emailPlaceholder = 'Email address can\'t be empty';
      } else {
        newState.email = '';
        newState.emailPlaceholder = 'Invalid email address';
      }

      newState.emailClass = 'invalid';
    } else {
      newState.emailClass = 'valid';
    }

    if (this.state.confirmPassword !== this.state.password || this.state.password.trim() === '' || this.state.confirmPassword.trim() === '') {
      newState.confirmPasswordClass = 'invalid';
      newState.passwordClass = 'invalid';
      newState.password = '';
      newState.confirmPassword = '';
    } else {
      newState.confirmPasswordClass = 'valid';
      newState.passwordClass = 'valid';
    }

    if (newState.confirmPasswordClass === newState.passwordClass && newState.emailClass === 'valid' && newState.emailClass === newState.passwordClass) {
      this.props.signupUser({
        email: this.state.email,
        password: this.state.password,
      });

      newState.emailPlaceholder = 'Loading...';
      newState.password = '';
      newState.confirmPassword = '';
      newState.email = '';
    }

    this.setState(newState);

    e.preventDefault();
  }

  onFieldChange(e, param) {
    const newState = {};

    if (this.state.emailClass === 'invalid' || this.state.passwordClass === 'invalid' || this.props.auth.error) {
      newState.emailClass = 'normal';
      newState.passwordClass = 'normal';
      newState.confirmPasswordClass = 'normal';
      newState.emailPlaceholder = 'Email';
    }

    if (this.props.auth.error) {
      this.props.clearError();
    }

    newState[param] = e.target.value;
    this.setState(newState);
  }

  onFieldClick(e) {
    if (this.state.emailClass === 'invalid' || this.state.passwordClass === 'invalid' || this.props.auth.error) {
      this.setState({
        emailClass: 'normal',
        passwordClass: 'normal',
        confirmPasswordClass: 'normal',
        emailPlaceholder: 'Email',
      });
    }

    if (this.props.auth.error) {
      this.props.clearError();
    }
  }

  getContent() {
    let passwordPlaceholder, confirmPasswordPlaceholder;
    const fieldsAreEmpty = this.fieldsEmpty() ? 'inactive' : 'active';

    if (this.state.emailPlaceholder === 'Loading...') {
      passwordPlaceholder = 'Loading...';
      confirmPasswordPlaceholder = 'Loading...';
    } else {
      passwordPlaceholder = this.state.passwordClass === 'invalid' ? 'Passwords don\'t match' : 'Password';
      confirmPasswordPlaceholder = this.state.passwordClass === 'invalid' ? 'Passwords don\'t match' : 'Confirm password';
    }
    if (this.props.auth.authenticated) {
      return <h1>Hello</h1>;
    } else {
      return (
        <form onSubmit={this.onSubmit} className="container-content" id="signup-form">
          <div className="wrapper" id="field">
            <input
              type="text"
              id="email"
              value={this.props.auth.error ? '' : this.state.email}
              onChange={e => { this.onFieldChange(e, 'email'); }}
              onClick={this.onFieldClick}
              onKeyDown={this.onFieldClick}
              placeholder={this.props.auth.error ? 'Email already taken' : this.state.emailPlaceholder}
              className={this.props.auth.error ? 'invalid' : this.state.emailClass}
            />
          </div>
          <div className="wrapper" id="field">
            <input
              type="password"
              id="password"
              value={this.state.password}
              onChange={e => { this.onFieldChange(e, 'password'); }}
              onClick={this.onFieldClick}
              onKeyDown={this.onFieldClick}
              placeholder={this.props.auth.error ? 'Password' : passwordPlaceholder}
              className={this.props.auth.error ? 'normal' : this.state.passwordClass}
            />
          </div>
          <div className="wrapper" id="field">
            <input
              type="password"
              id="confirmPassword"
              value={this.state.confirmPassword}
              onChange={e => { this.onFieldChange(e, 'confirmPassword'); }}
              onClick={this.onFieldClick}
              onKeyDown={this.onFieldClick}
              placeholder={this.props.auth.error ? 'Confirm password' : confirmPasswordPlaceholder}
              className={this.props.auth.error ? 'normal' : this.state.confirmPasswordClass}
            />
          </div>
          <div className="wrapper" id="submit">
            <input type="submit" className={fieldsAreEmpty} value="Submit" />
            <input type="submit" className={fieldsAreEmpty} onClick={this.clearFields} value="Clear all" />
          </div>
        </form>
      );
    }
  }

  fieldsEmpty() {
    return this.state.email.trim() === this.state.password.trim() && this.state.confirmPassword.trim() === '' && this.state.confirmPassword.trim() === this.state.password.trim();
  }

  clearFields(e) {
    e.preventDefault();

    this.setState({
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  render() {
    return (
      <div className="main-container" id="sign-up">
        <div className="container-header">
          <h1>Sign up</h1>
        </div>
        {this.getContent()}
        <div
          id="mask"
          className=" "
        >
          <div id="sign-up-prompt">
            <div id="icons">
            </div>
            <div id="actual-prompt">
              <div id="headings">
                <h1>Set hashtags</h1>
                <h4>Type them with spaces in between</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  signupUser,
  clearError,
})(SignUp);
