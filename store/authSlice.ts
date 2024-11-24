// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/configs/supabase/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import UserService from "@/services/UserService"; // Import UserService

export interface AuthState {
  user: SupabaseUser | null;
  appUser: User | null; // Add appUser field
  loading: boolean;
  error: string | null;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  appUser: null, // Initialize appUser
  loading: false,
  error: null,
};

// Async action to initialize authentication state
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) return rejectWithValue(error.message);

      if (session) {
        const userService = new UserService();
        const appUser: User = await userService.getOne(session.user.id);
        return { user: session.user, appUser };
      } else {
        return { user: null, appUser: null };
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Async actions for signup, login, and logout
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }: SignUpPayload, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return rejectWithValue(error.message);

    // Auto-login after signup
    try {
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) return rejectWithValue(loginError.message);

      const userService = new UserService();
      await userService.create({
        user_id: loginData.user.id,
        email: loginData.user.email,
        first_name: "User",
        last_name: new Date().getTime().toString(),
        username:
          loginData.user.email?.split("@")[0] +
          new Date().getTime().toString().slice(-4),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: "",
        follow_total: 0,
      }); // Create user in users table

      const appUser: User = await userService.getOne(loginData.user.id);

      // Return both SupabaseUser and appUser after auto-login
      return { user: loginData.user as SupabaseUser, appUser };
    } catch (autoLoginError: any) {
      return rejectWithValue(autoLoginError.message);
    }
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: SignInPayload, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return rejectWithValue(error.message);

    const userService = new UserService();
    try {
      const appUser: User = await userService.getOne(data.user.id); // Fetch user details from users table
      return { user: data.user, appUser }; // Return both SupabaseUser and appUser
    } catch (userError: any) {
      return rejectWithValue(userError.message);
    }
  },
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) return rejectWithValue(error.message);
  },
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SupabaseUser | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle initialization
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.appUser = action.payload.appUser;
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.user = null;
        state.appUser = null;
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle sign-up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.appUser = action.payload.appUser; // Store appUser from auto-login
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle sign-in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.appUser = action.payload.appUser; // Store appUser
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle sign-out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.appUser = null; // Clear appUser
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
