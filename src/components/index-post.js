import React, { Component } from 'react';

// example class based component (smart component)
class IndexPost extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      postClass: '',
    };

    this.onExpandPost = this.onExpandPost.bind(this);
  }
  onExpandPost(event) {
    this.setState({ postClass: this.state.postClass === 'expanded' ? '' : 'expanded' });
  }

  render() {
    return (
      <div id="post-title" key={this.props.id} >
        <div className={this.state.postClass} onClick={this.onExpandPost}>
          <input
            type="text"
            id={this.props.id}
            key={this.props.id}
            placeholder={this.props.title}
            autoFocus={this.props.autofocus}
            onKeyDown={event => { this.props.onKeyDown(this.props.id, event); }}
            onFocus={event => { this.props.onExpandPost(this.props.id, event); }}
          />
          <i className="fa fa-angle-down" aria-hidden="true" />
        </div>
        <div id="post-body">{this.props.content}</div>
      </div>
    );
  }
}

export default IndexPost;
