import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../firebase'; // Ensure correct path to Firebase configuration
import { onAuthStateChanged } from 'firebase/auth';
import { formatDistanceToNow } from 'date-fns';
import './Community.css';

import defaultProfilePicture from './user.png';
import likeIcon from './Icons/like.png';
import likedIcon from './Icons/liked.png';

const sortPosts = (posts) => {
  return posts
    .filter(post => post.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const sortComments = (comments) => {
  return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputVisibility, setCommentInputVisibility] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const getProfilePicture = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.profilePic || defaultProfilePicture;
      }
      return defaultProfilePicture;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return defaultProfilePicture;
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), async (snapshot) => {
      const postsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userProfilePicture = await getProfilePicture(data.userId);
        return {
          id: doc.id,
          likes: [],
          ...data,
          userProfilePicture,
        };
      }));
      const sortedPosts = sortPosts(postsData);
      setPosts(sortedPosts);
    });

    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profilePicture = await getProfilePicture(user.uid);
        setCurrentUser({
          uid: user.uid,
          name: user.email,
          profilePicture,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddPost = async () => {
    if ((newPost.trim() || imageUpload) && currentUser) {
      let imageUrl = null;
      if (imageUpload) {
        const imageRef = ref(storage, `images/${imageUpload.name + Date.now()}`);
        await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newPostData = {
        content: newPost,
        comments: [],
        likes: [],
        userName: currentUser.name,
        userProfilePicture: currentUser.profilePicture,
        createdAt: Timestamp.fromDate(new Date()),
        userId: currentUser.uid,
        imageUrl: imageUrl,
      };

      try {
        await addDoc(collection(db, 'posts'), newPostData);
        setNewPost('');
        setImageUpload(null);
        setImagePreview(null);
      } catch (error) {
        console.error('Error adding post:', error);
        setError('Failed to create post. Please try again.');
      }
    }
  };

  const handleAddComment = async (postId, comment) => {
    if (comment.trim() && currentUser) {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const newComment = {
          content: comment,
          userName: currentUser.name,
          userProfilePicture: currentUser.profilePicture,
          createdAt: Timestamp.fromDate(new Date()),
          userId: currentUser.uid,
        };
        await updateDoc(postRef, { comments: [...postData.comments, newComment] });
      } else {
        console.error('Post does not exist!');
      }
    }
  };

  const handleLike = async (postId) => {
    if (currentUser) {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const likes = postData.likes || [];
        if (likes.includes(currentUser.uid)) {
          await updateDoc(postRef, { likes: likes.filter(uid => uid !== currentUser.uid) });
        } else {
          await updateDoc(postRef, { likes: [...likes, currentUser.uid] });
        }
      }
    }
  };

  const handleEditPost = async (postId, newContent) => {
    if (newContent) {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, { content: newContent });
    }
  };

  const handleDeletePost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  };

  const handleEditComment = async (postId, commentIndex, newContent) => {
    if (newContent) {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const updatedComments = [...postData.comments];
        updatedComments[commentIndex] = { ...updatedComments[commentIndex], content: newContent };
        await updateDoc(postRef, { comments: updatedComments });
      }
    }
  };

  const handleDeleteComment = async (postId, commentIndex) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const updatedComments = postData.comments.filter((_, index) => index !== commentIndex);
      await updateDoc(postRef, { comments: updatedComments });
    }
  };

  const toggleMoreLessComment = (postId) => {
    setVisibleComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const toggleCommentInput = (postId) => {
    setCommentInputVisibility(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const getFilteredPosts = useMemo(() => {
    switch (filter) {
      case 'myPosts':
        return posts.filter(post => post.userId === currentUser?.uid);
      case 'interactions':
        return posts.filter(post => post.likes?.includes(currentUser?.uid) || post.comments?.some(comment => comment.userId === currentUser?.uid));
      default:
        return posts;
    }
  }, [posts, filter, currentUser]);

  return (
    <div className="community-container">
      {error && <div className="error-bar">{error}</div>}
      <div className="post-input-container">
        <img src={currentUser?.profilePicture} alt="Profile" className="community-profile-picture" />
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="new-post-input"
        />
        <div className="image-upload-container">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            id="image-upload"
            className="image-upload-input"
          />
          <label htmlFor="image-upload" className="image-upload-label">
            <span role="img" aria-label="Add Image"></span>
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}
        </div>
        <button onClick={handleAddPost} className="new-post-button">Post</button>
      </div>

      <div className="filter-buttons">
        <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Posts</button>
        <button className={`filter-button ${filter === 'myPosts' ? 'active' : ''}`} onClick={() => setFilter('myPosts')}>My Posts</button>
        <button className={`filter-button ${filter === 'interactions' ? 'active' : ''}`} onClick={() => setFilter('interactions')}>Interactions</button>
      </div>

      <div className="main-content">
        <div className="posts-container">
          {getFilteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.userProfilePicture} alt="Profile" className="post-profile-picture" />
                <div className="post-user-info">
                  <p className="post-user-name">{post.userName}</p>
                  {post.createdAt && (
                    <p className="post-timestamp" title={new Date(post.createdAt.toDate()).toLocaleString()}>
                      {formatDistanceToNow(new Date(post.createdAt.toDate()))} ago
                    </p>
                  )}
                </div>
                {post.userId === currentUser?.uid && (
                  <div className="post-options">
                    <button onClick={() => handleEditPost(post.id, prompt('Edit post:', post.content))}>Edit</button>
                    <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </div>
                )}
              </div>
              <div className="post-content">
                <p>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
              </div>
              <div className="like-comment-buttons">
                <button onClick={() => handleLike(post.id)} className="like-button">
                  <img
                    src={post.likes && post.likes.includes(currentUser?.uid) ? likedIcon : likeIcon}
                    alt={post.likes && post.likes.includes(currentUser?.uid) ? 'Liked' : 'Like'}
                    className="like-icon"
                  />
                  Like
                </button>
                <button onClick={() => toggleCommentInput(post.id)} className="comment-button">Comment</button>
              </div>
              <p className="likes-comments-count">{post.likes.length} likes • {post.comments.length} comments</p>
              {commentInputVisibility[post.id] && (
                <div className="comment-input-container">
                  <img src={currentUser?.profilePicture} alt="Profile" className="comment-profile-picture" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="comment-input"
                  />
                </div>
              )}
              <div className="comments-section">
                {sortComments(post.comments).slice(0, visibleComments[post.id] ? undefined : 2).map((comment, index) => (
                  <div key={index} className="comment">
                    <img src={comment.userProfilePicture} alt="Profile" className="comment-profile-picture" />
                    <div className="comment-content">
                      <p className="comment-user-name">{comment.userName}</p>
                      <p>{comment.content}</p>
                      <p className="comment-timestamp">{formatDistanceToNow(new Date(comment.createdAt.toDate()))} ago</p>
                      {comment.userId === currentUser?.uid && (
                        <div className="comment-options">
                          <button onClick={() => handleEditComment(post.id, index, prompt('Edit comment:', comment.content))}>Edit</button>
                          <button onClick={() => handleDeleteComment(post.id, index)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <button onClick={() => toggleMoreLessComment(post.id)} className="toggle-comments-button">
                    {visibleComments[post.id] ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;