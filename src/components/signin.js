import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  signinUser,
  clearError,
} from '../actions';

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const mapStateToProps = (state) => (
  {
    auth: state.auth,
  }
);

// example class based component (smart component)
class SignIn extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      email: '',
      password: '',
      emailClass: 'normal',
      passwordClass: 'normal',
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

    if (this.state.password.trim() === '') {
      newState.passwordClass = 'invalid';
      newState.password = '';
    } else {
      newState.passwordClass = 'valid';
    }

    if (newState.emailClass === 'valid' && newState.emailClass === newState.passwordClass) {
      this.props.signinUser({
        email: this.state.email,
        password: this.state.password,
      });

      newState.emailPlaceholder = 'Loading...';
      newState.password = '';
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
    } else {
      passwordPlaceholder = this.state.passwordClass === 'invalid' ? 'Invalid password' : 'Password';
    }
    if (this.props.auth.authenticated) {
      return <h1>Hello</h1>;
    } else {
      return (
        <form onSubmit={this.onSubmit} className="container-content" id="signin-form">
          <div className="wrapper" id="field">
            <input
              type="text"
              id="email"
              value={this.props.auth.error ? '' : this.state.email}
              onChange={e => { this.onFieldChange(e, 'email'); }}
              onClick={this.onFieldClick}
              onKeyDown={this.onFieldClick}
              placeholder={this.props.auth.error ? 'Email not found' : this.state.emailPlaceholder}
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
          <div className="wrapper" id="submit">
            <input type="submit" className={fieldsAreEmpty} value="Submit" />
            <input type="submit" className={fieldsAreEmpty} onClick={this.clearFields} value="Clear" />
          </div>
        </form>
      );
    }
  }

  fieldsEmpty() {
    return this.state.email.trim() === this.state.password.trim() && this.state.password.trim() === '';
  }

  clearFields(e) {
    e.preventDefault();

    this.setState({
      email: '',
      password: '',
    });
  }

  render() {
    return (
      <div className="main-container" id="sign-in">
        <div className="container-header">
          <h1>Sign in</h1>
        </div>
        {this.getContent()}
        <div
          id="mask"
          className=" "
        >
          <div id="sign-in-prompt">
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
  signinUser,
  clearError,
})(SignIn);
