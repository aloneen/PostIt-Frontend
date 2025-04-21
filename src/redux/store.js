import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postReducer from './postSlice';
import commentReducer from './commentSlice';
import likeReducer from './likeSlice';
import categoryReducer from './categorySlice';

export default configureStore({
  reducer: {
    user: userReducer,
    posts: postReducer,
    comments: commentReducer,
    likes: likeReducer,
    categories: categoryReducer
  }
});
