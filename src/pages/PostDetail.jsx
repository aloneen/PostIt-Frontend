import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }   from 'react-router-dom';
import { useDispatch, useSelector }  from 'react-redux';
import { fetchPosts, deletePost, updatePost, uploadPostImages } from '../redux/postSlice';
import {
  fetchLikes,
  likePost,
  unlikePost
} from '../redux/likeSlice';
import CommentsSection from '../components/CommentsSection';

const PostDetail = () => {
  const { id }      = useParams();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const { posts, status }      = useSelector(s => s.posts);
  const { currentUser }        = useSelector(s => s.user);
  const likeEntry               = useSelector(s => s.likes.byPost[id]) || { count:0, liked:false };
  const post                    = posts.find(p => p.id.toString() === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [category, setCategory]   = useState('');
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!posts.length && status==='idle') dispatch(fetchPosts());
    dispatch(fetchLikes(id));
  }, [dispatch, id, posts.length, status]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category_id);
    }
  }, [post]);

  if (!post) return <p>Loading…</p>;

  const toggleLike = () => {
    if (!currentUser) return navigate('/login');
    likeEntry.liked ? dispatch(unlikePost(post.id)) : dispatch(likePost(post.id));
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id))
      .unwrap()
      .then(()=>navigate('/posts'))
      .catch(err=>setError(err));
  };

  const handleImageDelete = imageUrl => {
    // extract image_id from imageUrl (assuming you embed it or store id)
    const imageId = /* parse from URL or store it in post.images array as {id,url} */
    fetch(`http://127.0.0.1:5000/posts/${post.id}/images/${imageId}`, {
      method:'DELETE',
      headers:{ Authorization:`Bearer ${currentUser.token}` }
    }).then(()=>dispatch(fetchPosts())); // or remove locally
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    if (!title||!content) {
      setError('Title and content required');
      return;
    }
    try {
      await dispatch(updatePost({
        postId: post.id,
        title,
        content,
        category_id: category
      })).unwrap();
      // upload any new files
      if (filesToAdd.length) {
        await dispatch(uploadPostImages({ postId: post.id, images: filesToAdd })).unwrap();
      }
      setIsEditing(false);
    } catch(err){
      setError(err);
    }
  };

  return (
    <div className="page post-detail">
      {isEditing
        ? (
          <form onSubmit={handleEditSubmit} encType="multipart/form-data">
            {/* Title, content, category dropdown as before */}
            <input type="file" multiple accept="image/*" onChange={e=>setFilesToAdd([...filesToAdd,...Array.from(e.target.files)])} />
            {/* Existing images with delete buttons */}
            <div style={{ display:'flex', gap:10 }}>
              {post.images.map((url,i)=>
                <div key={i}>
                  <img src={url} style={{ maxWidth:100 }}/>
                  <button type="button" onClick={()=>handleImageDelete(url)}>Remove</button>
                </div>
              )}
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={()=>setIsEditing(false)}>Cancel</button>
            {error && <p className="error">{error}</p>}
          </form>
        )
        : (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              {post.author_avatar && <img src={post.author_avatar} style={{ width:40, height:40, borderRadius:'50%' }} />}
              <h2>{post.title}</h2>
            </div>
            <p><em>Category: {post.category_name}</em></p>
            <p>{post.content}</p>
            {/* Images gallery */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {post.images.map((url,i)=><img key={i} src={url} style={{ maxWidth:200 }}/>)}
            </div>
            {/* Likes */}
            <button onClick={toggleLike}>{likeEntry.liked?'💔 Unlike':'❤️ Like'}</button>
            <span>{likeEntry.count} {likeEntry.count===1?'like':'likes'}</span>
            {/* Edit/Delete */}
            {currentUser?.id===post.user_id && (
              <>
                <button onClick={()=>setIsEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </>
            )}
            <CommentsSection postId={post.id} />
          </>
        )
      }
    </div>
  );
};

export default PostDetail;
