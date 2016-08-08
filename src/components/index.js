import React, { Component } from 'react';
import { connect } from 'react-redux';
import IndexPost from './index-post.js';
import { fetchPosts, createPost, updatePost, deletePost, fetchPost } from '../actions';

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
      enter: false,
    };

    this.createNewPost = this.createNewPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEditContent = this.onEditContent.bind(this);
    this.onGetDataPost = this.onGetDataPost.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts(true);
  }

  onKeyDown(id, event) {
    if (event.keyCode === 13) {
      const title = event.target.value;
      event.target.blur();

      this.setState({ enter: true });
      this.props.updatePost(id, { title });
    }
  }

  onEditContent(id, event) {
    event.stopPropagation();

    const currentPost = document.getElementById(`post-body-${id}`);
    const state = { editContentClass: 'post-body' };

    this.props.fetchPost(id);

    if (this.state.editContentClass.indexOf('editing') < 0) {
      state.editContentClass += ' editing';
      currentPost.focus();
    } else {
      currentPost.blur();
      this.props.updatePost(id, { content: currentPost.value });
    }

    this.setState(state);
  }

  onGetDataPost(id, event, extended) {
    if (extended) {
      document.getElementById(`post-body-${id}`).blur();

      this.setState({
        editContentClass: 'post-body',
      });
    }

    this.props.fetchPost(id);
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
                key={el.id}
                id={el.id}
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
      return (
        <h1>{this.props.message}</h1>
      );
    }
  }

  createNewPost(event) {
    this.props.createPost({
      title: 'New post',
      tags: 'Customize data',
      content: '',
    });
  }

  render() {
    return (
      <div className="index">
        <div className="index-header">
          <h1>Posts</h1>
          <i onClick={this.createNewPost} className="fa fa-plus" aria-hidden="true" />
        </div>
        {this.getPosts()}
      </div>
    );
  }
}

export default connect(mapStateToProps, { createPost, fetchPosts, updatePost, deletePost, fetchPost })(Index);
