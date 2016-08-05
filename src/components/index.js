import React, { Component } from 'react';
import { connect } from 'react-redux';
import IndexPost from './index-post.js';
import { fetchPosts, createPost, updatePost } from '../actions';

const mapStateToProps = (state) => (
  {
    all: state.posts.all,
    validated: state.posts.validated,
    message: state.posts.message,
    updated: state.posts.updated,
  }
);
// example class based component (smart component)
class Index extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {};

    this.createNewPost = this.createNewPost.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onExpandPost = this.onExpandPost.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts(true);
  }

  onKeyDown(id, event) {
    if (event.keyCode === 13) {
      const title = event.target.value;

      event.target.blur();

      this.props.updatePost(id, { title });
    }
  }

  onExpandPost(id, event) {
    console.log(event);
    event.target.blur();
  }

  getPosts() {
    if (this.props.validated) {
      return (
        <div id="posts">
          {this.props.all.map((el, i, arr) => {
            let autofocus;

            if (i === arr.length - 1 && !this.props.updated) {
              autofocus = true;
            } else {
              autofocus = false;
            }

            return (
              < IndexPost
                autofocus={autofocus}
                key={el.id}
                id={el.id}
                title={el.title}
                onExpandPost={this.onExpandPost}
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
      content: 'What',
    });
  }

  render() {
    return (
      <div className="index">
        <div className="index-header">
          <h1>Posts</h1>
          <i onClick={this.createNewPost} className="fa fa-plus" aria-hidden="true"></i>
        </div>
        {this.getPosts()}
      </div>
    );
  }
}

export default connect(mapStateToProps, { createPost, fetchPosts, updatePost })(Index);
