import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  appUser: any | null;
}

const initialState: AuthState = {
  user: null,
  appUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.appUser = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
