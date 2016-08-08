import React, { Component } from 'react';

// example class based component (smart component)
class IndexPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postClass: '',
      content: null,
    };

    this.onExpandPost = this.onExpandPost.bind(this);
    this.getContent = this.getContent.bind(this);
  }

  onExpandPost(event) {
    if (this.state.postClass === 'expanded') {
      this.setState({
        postClass: '',
        content: this.getContent(),
      });
    } else {
      this.setState({
        postClass: 'expanded',
      });
    }

    this.props.getDataPost(this.props.id, event, this.state.postClass === 'expanded');
  }

  getContent() {
    if (this.props.currentPost && this.props.id === this.props.currentPost._id) {
      return this.props.currentPost.content;
    }

    return 'Loading content...';
  }

  render() {
    const className = this.props.autoFocus ? 'focused' : '';

    return (
      <div id="post-title" key={this.props.id} >
        <div className={this.state.postClass} id="post-wrapper" onClick={this.onExpandPost}>
          <input
            type="text"
            id={this.props.id}
            key={this.props.id}
            placeholder={this.props.title}
            autoFocus={this.props.autoFocus}
            className={className}
            onClick={event => { event.target.blur(); }}
            onKeyDown={event => { this.props.onKeyDown(this.props.id, event); }}
          />
          <div id="icons">
            <div id="status" className={this.props.waitingClass}>
              <h3>{`${this.props.waitingText}...`}</h3>
            </div>
            <i
              className="fa fa-trash"
              aria-hidden="true"
              onClick={() => { this.props.deletePost(this.props.id); }}
            />
            <i
              className={this.props.editContentClass === 'post-body editing' ? 'fa fa-check active' : 'fa fa-pencil-square-o'}
              aria-hidden="true"
              onClick={e => { this.props.onEditContent(this.props.id, e); }}
            />
            <i className="fa fa-angle-down" aria-hidden="true" />
          </div>
        </div>
        <textarea
          id={`post-body-${this.props.id}`}
          className={this.props.editContentClass}
          onClick={e => { if (e.target.className.indexOf('editing') < 0) { e.target.blur(); } }}
          placeholder="Edit to add content"
          value={this.state.content !== null ? this.state.content : this.getContent()}
          onChange={e => { this.setState({ content: e.target.value }); }}
        / >
      </div>
    );
  }
}

export default IndexPost;
