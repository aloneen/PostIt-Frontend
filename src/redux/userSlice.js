import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch('http://127.0.0.1:5000/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error fetching profile');
      }
      return await res.json(); // { user: {...}, posts: [...] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk to upload user avatar
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('http://127.0.0.1:5000/user/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error uploading avatar');
      }
      const data = await res.json(); // { avatar_url }
      return data.avatar_url;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error login');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error('Error regist');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'user/changeUserRole',
  async ({ userId, role }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error changing role');
      }
      return { userId, role };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);




export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('no token');
      const res = await fetch('http://127.0.0.1:5000/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('User not authorized');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const res = await fetch('http://127.0.0.1:5000/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error users receiv');
      }
      const data = await res.json();
      return data; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error user delete');
      }
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



export const setUserActive = createAsyncThunk(
  'user/setUserActive',
  async ({ userId, is_active }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}/active`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_active })
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Error updating status');
      }
      return { userId, is_active };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  currentUser: null,
  token: localStorage.getItem('token') || null,
  allUsers: [],
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.currentUser = action.payload.user;
          state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
         state.loading = false;
         state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loadUser.fulfilled, (state, action) => { state.currentUser = action.payload.user; })
      
      .addCase(fetchUsers.fulfilled, (state, action) => {
         state.allUsers = action.payload;
      })
     
      .addCase(deleteUser.fulfilled, (state, action) => {
         state.allUsers = state.allUsers.filter(u => u.id !== action.payload);
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile   = action.payload.user;
        state.userPosts = action.payload.posts;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) state.profile.avatar_url = action.payload;
        if (state.user)    state.user.avatar_url    = action.payload;
      })
      .addCase(changeUserRole.fulfilled, (state, { payload }) => {
        const idx = state.allUsers.findIndex(u => u.id === payload.userId);
        if (idx !== -1) state.allUsers[idx].role = payload.role;
      })
      .addCase(setUserActive.fulfilled, (state, { payload }) => {
        const u = state.allUsers.find(u => u.id === payload.userId);
        if (u) u.is_active = payload.is_active;
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
