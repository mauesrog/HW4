import React, { Component } from 'react';
import { connect } from 'react-redux';
import IndexPost from './index-post.js';
import {
  fetchPosts,
  clearPosts,
  createPost,
  updatePost,
  deletePost,
  fetchPost,
} from '../actions';

const mapStateToProps = (state) => (
  {
    all: state.posts.all,
    validated: state.posts.validated,
    message: state.posts.message,
    updated: state.posts.updated,
    post: state.posts.post,
  }
);
// example class based component (smart component)
class Index extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      editContentClass: 'post-body',
      hashtagClass: 'fa fa-hashtag',
      currentId: '',
      currentTags: [],
      currentHashtags: null,
      expandedPostId: '',
      enter: false,
      initialMessage: 'Loading posts...',
    };

    this.createNewPost = this.createNewPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEditContent = this.onEditContent.bind(this);
    this.onHashtags = this.onHashtags.bind(this);
    this.onGetDataPost = this.onGetDataPost.bind(this);
    this.onExpandedPost = this.onExpandedPost.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts(true);
  }

  componentWillReceiveProps(props) {
    if (props.routes[1] && props.routes[1].path) {
      this.createNewPost();
      this.props.history.push('/');
    }
  }

  onHashtags(e, currentId, currentTags) {
    e.stopPropagation();

    const hashtagInput = document.getElementById('actual-prompt').getElementsByTagName('textarea')[0];

    if (this.state.hashtagClass !== 'fa fa-hashtag') {
      hashtagInput.blur();
    } else {
      hashtagInput.focus();
    }

    this.setState({
      currentId,
      currentTags,
      hashtagClass: this.state.hashtagClass === 'fa fa-hashtag' ? 'fa fa-hashtag active' : 'fa fa-hashtag',
    });
  }

  onEditContent(id, event) {
    event.stopPropagation();

    const currentPost = document.getElementById(`post-body-${id}`);
    const currentPostTitle = document.getElementById(`title-${id}`).getElementsByTagName('input')[0];
    const state = { editContentClass: 'post-body' };

    this.props.fetchPost(id);

    if (this.state.editContentClass.indexOf('editing') < 0) {
      state.editContentClass += ' editing';
      currentPostTitle.className = 'focused';
      currentPost.focus();
    } else {
      currentPostTitle.className = '';
      currentPost.blur();
      this.props.updatePost(id, { content: currentPost.value, title: currentPostTitle.value });
    }

    this.setState(state);
  }

  onKeyDown(id, event) {
    if (event.keyCode === 13) {
      const title = event.target.value;
      event.target.blur();

      this.setState({ enter: true });
      this.props.updatePost(id, { title });
    }
  }

  onGetDataPost(id, event, title, extended) {
    if (extended) {
      document.getElementById(`post-body-${id}`).blur();

      this.setState({
        editContentClass: 'post-body',
      });

      this.props.updatePost(id, { title });
    } else {
      this.props.fetchPost(id);
    }
  }

  onExpandedPost(expandedPostId) {
    this.setState({ expandedPostId });
  }

  getPosts() {
    if (this.props.validated) {
      return (
        <div id="posts">
          {this.props.all.map((el, i, arr) => {
            const autofocus = (i === arr.length - 1 && !this.props.updated);

            return (
              < IndexPost
                autoFocus={autofocus}
                editContentClass={this.state.editContentClass}
                hashtagClass={this.state.hashtagClass}
                onHashtags={this.onHashtags}
                key={el.id}
                id={el.id}
                expandedPostId={this.state.expandedPostId}
                onExpandedPost={this.onExpandedPost}
                title={el.title}
                deletePost={this.props.deletePost}
                currentPost={this.props.post}
                onEditContent={this.onEditContent}
                getDataPost={this.onGetDataPost}
                onKeyDown={this.onKeyDown}
              />
            );
          })}
        </div>
      );
    } else {
      const message = this.props.message ? this.props.message : this.state.initialMessage;

      return (
        <h1>{message}</h1>
      );
    }
  }

  createNewPost(event) {
    this.props.createPost({
      title: 'New post',
      tags: '',
      content: '',
    });
  }

  convertHashtags() {
    let hashtags;
    if (this.state.currentTags.length) {
      hashtags = this.state.currentTags.map((el, i) => {
        let tag = '';

        if (i > 0) {
          tag += ' ';
        }

        tag += el;

        return tag;
      }).toString().replace(/,/g, '');
    } else if (this.props.post) {
      hashtags = '';
    } else {
      hashtags = 'Loading content...';
    }

    return hashtags;
  }

  processTags(tags) {
    if (tags && tags.length) {
      let trimmedTags = tags.trim();

      if (trimmedTags.length) {
        trimmedTags = trimmedTags.replace(/ {2,}/g, ' ');
        console.log(trimmedTags);
      }
      return trimmedTags;
    }

    return '';
  }

  render() {
    return (
      <div className="index">
        <div className="index-header">
          <h1>Posts</h1>
          <div id="icons">
            <i
              onClick={(e) => {
                if (e.target.className.indexOf('shadowed') < 0) {
                  this.props.clearPosts();
                }
              }}
              className={this.props.all.length ? 'fa fa-ban' : 'fa fa-ban shadowed'}
              aria-hidden="true"
            />
            <i onClick={this.createNewPost} className="fa fa-plus" aria-hidden="true" />
          </div>
        </div>
        {this.getPosts()}
        <div
          id="mask"
          className={this.state.hashtagClass === 'fa fa-hashtag active' ? 'active' : ''}
        >
          <div id="hashtag-prompt">
            <div id="icons">
              <i
                className="fa fa-check"
                aria-hidden="true"
                onClick={() => {
                  this.props.updatePost(this.state.currentId, { tags: this.processTags(this.state.currentHashtags) });
                  this.setState({ hashtagClass: 'fa fa-hashtag', currentHashtags: null });
                }}
              />
              <i className="fa fa-times" aria-hidden="true" onClick={() => { this.setState({ hashtagClass: 'fa fa-hashtag' }); }} />
            </div>
            <div id="actual-prompt">
              <div id="headings">
                <h1>Set hashtags</h1>
                <h4>Type them with spaces in between</h4>
              </div>
              <textarea value={this.state.currentHashtags !== null ? this.state.currentHashtags : this.convertHashtags()} onChange={e => { this.setState({ currentHashtags: e.target.value }); }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  createPost,
  fetchPosts,
  updatePost,
  deletePost,
  fetchPost,
  clearPosts,
})(Index);
