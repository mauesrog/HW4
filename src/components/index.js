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
  signoutUser,
} from '../actions';

const mapStateToProps = (state) => (
  {
    all: state.posts.all,
    user: state.posts.user,
    validated: state.posts.validated,
    message: state.posts.message,
    updated: state.posts.updated,
    post: state.posts.post,
    auth: state.auth,
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
      popUpClass: 'off',
    };

    this.createNewPost = this.createNewPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEditContent = this.onEditContent.bind(this);
    this.onHashtags = this.onHashtags.bind(this);
    this.onGetDataPost = this.onGetDataPost.bind(this);
    this.onExpandedPost = this.onExpandedPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    if (localStorage.token) {
      this.props.fetchPosts(true);
    }
  }

  componentWillReceiveProps(props) {
    if (props.routes[1] && props.routes[1].path) {
      const path = props.routes[1].path;

      if (path === '/posts/new') {
        this.createNewPost();
      } else {
        this.props.signoutUser();
      }

      this.props.history.push('/');
    }
  }

  componentWillUnmount() {
    if (localStorage.signup) {
      localStorage.removeItem('signup');
    }
  }

  onHashtags(e, currentId, currentTags, author) {
    e.stopPropagation();

    const hashtagInput = document.getElementById('actual-prompt').getElementsByTagName('textarea')[0];
    const hashtagClass = document.getElementById(`hashtag-icon-${currentId}`).className;
    let popUpClass, popUpText, hashtagNewClass;

    if (hashtagClass.indexOf('shadowed') > -1) {
      popUpClass = 'locked';
      popUpText = `This post is locked! It was created by ${author}.`;
      hashtagNewClass = this.state.hashtagClass;
    } else {
      popUpClass = this.state.popUpClass;
      popUpText = this.state.popUpText;
      hashtagNewClass = this.state.hashtagClass === 'fa fa-hashtag' ? 'fa fa-hashtag active' : 'fa fa-hashtag';

      if (this.state.hashtagClass !== 'fa fa-hashtag') {
        hashtagInput.blur();
      } else {
        hashtagInput.focus();
      }
    }

    this.setState({
      currentId,
      currentTags,
      popUpClass,
      popUpText,
      hashtagClass: hashtagNewClass,
    });
  }

  onEditContent(id, author, event) {
    event.stopPropagation();

    const currentPost = document.getElementById(`post-body-${id}`);
    const currentPostTitle = document.getElementById(`title-${id}`).getElementsByTagName('input')[0];
    const editingClass = document.getElementById(`editing-icon-${id}`).className;
    const state = { editContentClass: 'post-body' };

    this.props.fetchPost(id);

    if (editingClass.indexOf('shadowed') > -1) {
      state.popUpClass = 'locked';
      state.popUpText = `This post is locked! It was created by ${author}.`;
    } else if (this.state.editContentClass.indexOf('editing') < 0) {
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
    const state = { expandedPostId };

    if (!expandedPostId) {
      state.currentTags = [];
    }

    this.setState(state);
  }

  getPosts() {
    if (this.props.validated && localStorage.token) {
      return (
        <div className="container-content" id="posts">
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
                author={el.author}
                locked={el.locked}
                expandedPostId={this.state.expandedPostId}
                onExpandedPost={this.onExpandedPost}
                title={el.title}
                deletePost={this.deletePost}
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
      let message;

      if (localStorage.token) {
        message = this.props.message ? this.props.message : this.state.initialMessage;
      } else {
        message = 'Please sign in or sign up to view posts!';
      }

      return (
        <h1>{message}</h1>
      );
    }
  }

  deletePost(id, author, e) {
    const deleteClass = document.getElementById(`delete-icon-${id}`).className;

    if (deleteClass.indexOf('shadowed') > -1) {
      e.stopPropagation();

      this.setState({
        popUpClass: 'locked',
        popUpText: `This post is locked! It was created by ${author}.`,
      });
    } else {
      this.props.deletePost(id);
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
      }
      return trimmedTags;
    }

    return '';
  }

  render() {
    let popUpText, popUpClass;

    console.log(this.props);

    if (this.state.popUpText) {
      popUpText = this.state.popUpText;
      popUpClass = this.state.popUpClass;
    } else {
      popUpText = localStorage.signup ? localStorage.signup : '';
      popUpClass = localStorage.signup ? '' : this.state.popUpClass;
    }
    return (
      <div className="main-container" id="index">
        <div className="container-header">
          <div className="welcome">
            <h1>{localStorage.getItem('email') ? `Welcome back, ${localStorage.getItem('email')}` : 'Hello!'}</h1>
          </div>
          <h1>Posts</h1>
          <div id="icons">
            <i
              onClick={(e) => {
                if (e.target.className.indexOf('shadowed') < 0) {
                  this.props.clearPosts(this.props.user.replace(/\./g, '[').replace(/@/g, ']'));
                }
              }}
              className={this.props.all.length && localStorage.token ? 'fa fa-ban' : 'fa fa-ban shadowed'}
              aria-hidden="true"
            />
            <i onClick={this.createNewPost} className={localStorage.token ? 'fa fa-plus' : 'fa fa-plus shadowed'} aria-hidden="true" />
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
        <div id="pop-up" className={popUpClass}>
          <h1>{popUpText}</h1>
          <i className="fa fa-times" aria-hidden="true" onClick={() => { localStorage.removeItem('signup'); this.setState({ popUpText: '', popUpClass: 'off' }); }} />
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
  signoutUser,
})(Index);
