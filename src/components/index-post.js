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
    this.getPostBody = this.getPostBody.bind(this);
  }

  onExpandPost(event) {
    if (event.target.className !== 'focused') {
      const state = {};
      const postTitle = document.getElementById(`title-${this.props.id}`).getElementsByTagName('input')[0];

      if (this.state.postClass === 'expanded') {
        this.props.onExpandedPost('');
        state.postClass = '';
        state.content = null;
        postTitle.className = '';
      } else {
        this.props.onExpandedPost(this.props.id);
        state.postClass = 'expanded';
      }

      this.setState(state);
      this.props.getDataPost(this.props.id, event, postTitle.value, this.state.postClass === 'expanded');
    }
  }

  getContent() {
    if (this.props.currentPost && this.props.id === this.props.currentPost.id) {
      return this.props.currentPost.content;
    }

    return 'Loading content...';
  }

  getPostBody() {
    let finalBody;
    if (this.props.currentPost && this.props.currentPost.tags && this.props.currentPost.tags.length && this.props.currentPost.tags[0].length) {
      let i = 0;
      finalBody = [
        (<textarea
          id={`post-body-${this.props.id}`}
          key={`post-body-${this.props.id}`}
          className={this.props.editContentClass}
          onClick={e => { if (e.target.className.indexOf('editing') < 0) { e.target.blur(); } }}
          placeholder="Edit to add content"
          value={this.state.content !== null ? this.state.content : this.getContent()}
          onChange={e => { this.setState({ content: e.target.value }); }}
        / >),
        (<ul key={`ul-${this.props.id}`}>
          {[
            <li className="tags" key={`${this.props.id}-tags`}>Tags:</li>,
            this.props.currentPost.tags.map(el => {
              return <li key={`${this.props.id}-${i++}`}>{`#${el}`}</li>;
            }),
            <li key={`empty-${this.props.id}`} />,
          ]}
        </ul>),
      ];
    } else {
      finalBody = (<textarea
        id={`post-body-${this.props.id}`}
        key={`post-body-${this.props.id}`}
        className={this.props.editContentClass}
        onClick={e => { if (e.target.className.indexOf('editing') < 0) { e.target.blur(); } }}
        placeholder="Edit to add content"
        value={this.state.content !== null ? this.state.content : this.getContent()}
        onChange={e => { this.setState({ content: e.target.value }); }}
      / >);
    }

    return <div id="full-post">{finalBody}</div>;
  }

  checkIfExpanded() {
    if (this.state.postClass === 'expanded') {
      if (this.props.expandedPostId && this.props.expandedPostId !== this.props.id) {
        this.setState({ postClass: '' });
        return '';
      }
    }

    return this.state.postClass;
  }

  render() {
    const className = this.props.autoFocus ? 'focused' : '';
    const title = this.props.title ? this.props.title : 'New post';

    return (
      <div className="post-title" id={`title-${this.props.id}`} key={this.props.id} >
        <div className={this.checkIfExpanded()} id="post-wrapper" onClick={this.onExpandPost}>
          <input
            type="text"
            id={this.props.id}
            key={this.props.id}
            placeholder={this.props.title}
            defaultValue={this.props.autoFocus ? '' : title}
            autoFocus={this.props.autoFocus}
            className={className}
            onClick={event => { if (event.target.className !== 'focused') { event.target.blur(); } }}
            onKeyDown={event => { this.props.onKeyDown(this.props.id, event); }}
          />
          <div id="icons">
            <i
              className={this.props.editContentClass === 'post-body editing' ? `${this.props.hashtagClass} shadowed` : `${this.props.hashtagClass}`}
              aria-hidden="true"
              onClick={e => { this.props.onHashtags(e, this.props.id, this.props.currentPost.tags); }}
            />
            <i
              className={this.props.editContentClass === 'post-body editing' ? 'fa fa-trash shadowed' : 'fa fa-trash'}
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
        {this.getPostBody()}
      </div>
    );
  }
}

export default IndexPost;
