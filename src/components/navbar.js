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
    const scrollTop = document.getElementsByTagName('body')[0].scrollTop;
    let allNavClass;

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

  render() {
    return (
      <div id="allNav" className={this.state.allNavClass}>
        <div id="fakeHeader">
          <Link to="/">{"Maui's Blog"}</Link>
          <Link to="posts/new">New post</Link>
        </div>
        <div id="navWrapper">
          <nav>
            <Link to="/">{"Maui's Blog"}</Link>
            <Link to="posts/new">New post</Link>
          </nav>
        </div>
      </div>
    );
  }
}

export default NavBar;
