import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the user object
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  token?: string;
  // Add more fields depending on your API response
}

// Define the auth state structure
export interface AuthState {
  user: User | null;
  token?: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: undefined,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to update user information
    ChangeUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // Action to set both user and token (e.g., on login)
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = undefined;
    },
  },
});

// Export the actions for use in components
export const { ChangeUser, setCredentials, logout } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
