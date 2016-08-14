import React, { Component } from 'react';
import { Link } from 'react-router';

// example class based component (smart component)
class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allNavClass: '',
    };

    this.checkScroll = this.checkScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.checkScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkScroll);
  }

  checkScroll(event) {
    const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    if (document.getElementById('mask').className === 'active') {
      event.preventDefault();
      event.stopPropagation();

      window.onwheel = (e) => e.preventDefault(); // modern standard
      window.onmousewheel = document.onmousewheel = (e) => e.preventDefault(); // older browsers, IE
      window.ontouchmove = (e) => e.preventDefault(); // mobile
      document.onkeydown = (e) => { if (keys[e.keyCode]) { e.preventDefault(); } };
    } else {
      const scrollTop = document.getElementsByTagName('body')[0].scrollTop;
      let allNavClass;

      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;

      if (scrollTop > 30) {
        allNavClass = 'shrink';

        if (scrollTop > 129) {
          allNavClass += ' wayDown';
        }
      } else {
        allNavClass = '';
      }

      this.setState({ allNavClass });
    }
  }

  render() {
    return (
      <div id="allNav" className={this.state.allNavClass}>
        <div id="fakeHeader">
          <div id="menu">
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
            <Link to="/signout">Sign out</Link>
          </div>
          <Link to="/">{"Maui's Blog"}</Link>
          <Link to="/posts/new">New post</Link>
        </div>
        <div id="navWrapper">
          <nav>
            <div id="home">
              <Link to="/">{"Maui's Blog"}</Link>
            </div>
            <Link to="/posts/new">New post</Link>
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
            <Link to="/signout">Sign out</Link>
          </nav>
        </div>
      </div>
    );
  }
}

export default NavBar;
