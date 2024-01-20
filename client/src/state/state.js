import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: {
    firstName: "Sunil",
    lastName: "Chauhan",
  },
  accessToken: "lol",
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setLogout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends don't exist");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setFriends, setLogin, setLogout, setPost, setPosts } =
  authSlice.actions;
export default authSlice.reducer;
