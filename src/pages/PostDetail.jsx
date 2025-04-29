import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate }            from 'react-router-dom';
import { useDispatch, useSelector }          from 'react-redux';
import {
  fetchPosts,
  deletePost,
  updatePost,
  uploadPostImages,
  deletePostImage
} from '../redux/postSlice';
import { fetchLikes, likePost, unlikePost }  from '../redux/likeSlice';
import { fetchCategories }                   from '../redux/categorySlice';
import { FaHeart, FaEllipsisV }              from 'react-icons/fa';
import ConfirmationModal                     from '../components/ConfirmationModal';
import CommentsSection                       from '../components/CommentsSection';
import { toast }                             from 'react-toastify';
import './PostDetail.css';
import ImageCarousel from '../components/ImageCarousel';




const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, status }        = useSelector(s => s.posts);
  const { categories, loading }  = useSelector(s => s.categories);
  const { currentUser }          = useSelector(s => s.user);
  const likeEntry                = useSelector(s => s.likes.byPost[id]) || { count: 0, liked: false };
  const post                     = posts.find(p => p.id.toString() === id);

  // local state
  const [isEditing, setIsEditing]           = useState(false);
  const [title, setTitle]                   = useState('');
  const [content, setContent]               = useState('');
  const [category, setCategory]             = useState('');
  const [filesToAdd, setFilesToAdd]         = useState([]);
  const [error, setError]                   = useState(null);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [confirmDelete, setConfirmDelete]   = useState(false);
  const menuRef                              = useRef();

  // on mount: fetch posts, likes, categories
  useEffect(() => {
    if (!posts.length && status === 'idle') dispatch(fetchPosts());
    dispatch(fetchLikes(id));
    dispatch(fetchCategories());
  }, [dispatch, id, posts.length, status]);

  // populate edit form when post is loaded
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category_id || '');
    }
  }, [post]);

  // close dropdown menu if clicked outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!post) return <p className="loading">Loading post…</p>;

  // like / unlike
  const handleToggleLike = e => {
    e.stopPropagation();
    if (!currentUser) return navigate('/login');
    likeEntry.liked
      ? dispatch(unlikePost(post.id))
      : dispatch(likePost(post.id));
  };

  // delete post
  const handleDelete = () => {
    dispatch(deletePost(post.id))
      .unwrap()
      .then(() => {
        toast.success('Post deleted');
        navigate('/posts');
      })
      .catch(err => toast.error('Failed to delete: ' + err));
  };

  // delete a single post image
  const handleImageDelete = imgId => {
    dispatch(deletePostImage({ postId: post.id, imageId: imgId }))
      .unwrap()
      .then(() => dispatch(fetchPosts()))
      .catch(err => console.error(err));
  };

  // save edits
  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      setError('All fields are required');
      return;
    }
    try {
      await dispatch(updatePost({
        postId: post.id,
        title: title.trim(),
        content: content.trim(),
        category_id: category
      })).unwrap();

      if (filesToAdd.length) {
        await dispatch(uploadPostImages({ postId: post.id, images: filesToAdd })).unwrap();
      }

      setIsEditing(false);
      dispatch(fetchPosts());
      toast.success('Post updated');
    } catch(err) {
      setError(err);
    }
  };

  return (
    <div className="page post-detail">
      {isEditing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Content"
            required
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {loading
              ? <option>Loading…</option>
              : categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
            }
          </select>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setFilesToAdd(f => [...f, ...Array.from(e.target.files)])}
          />
          <div className="existing-images">
            {post.images.map(img => (
              <div className="img-thumb" key={img.id}>
                <img src={img.url} alt="" />
                <button
                  type="button"
                  className="remove-img"
                  onClick={() => handleImageDelete(img.id)}
                >×</button>
              </div>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-buttons">
            <button type="submit" className="btn save">Save</button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => setIsEditing(false)}
            >Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <header className="detail-header">
            <div className="title-block">
              {post.author_avatar && (
                <img src={post.author_avatar} className="author-avatar" alt="" />
              )}
              <h2 className="post-title">{post.title}</h2>
            </div>
            {currentUser?.id === post.user_id && (
              <div className="menu-container" ref={menuRef}>
                <button
                  className="menu-btn"
                  onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
                >
                  <FaEllipsisV />
                </button>
                {menuOpen && (
                  <ul className="menu-dropdown">
                    <li onClick={() => { setIsEditing(true); setMenuOpen(false); }}>
                      Edit
                    </li>
                    <li onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}>
                      Delete
                    </li>
                  </ul>
                )}
              </div>
            )}
          </header>

          <p className="post-category">
            <em>Category: {post.category_name}</em>
          </p>

          <p className="post-content">{post.content}</p>

          <ImageCarousel images={post.images} />


          <div className="detail-footer">
            <button
              className={`like-btn ${likeEntry.liked ? 'liked' : ''}`}
              onClick={handleToggleLike}
            >
              <FaHeart className="heart-icon" />
            </button>
            <span className="like-count">{likeEntry.count}</span>
          </div>

          <CommentsSection postId={post.id} />

          <ConfirmationModal
            isOpen={confirmDelete}
            title="Delete this post?"
            message="This action cannot be undone."
            onCancel={() => setConfirmDelete(false)}
            onConfirm={() => { setConfirmDelete(false); handleDelete(); }}
          />
        </>
      )}
    </div>
  );
};

export default PostDetail;
