// /redux/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  role: "Admin" | "ProjectManager" | "Developer" | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  role: typeof window !== "undefined" ? (localStorage.getItem("role") as AuthState["role"]) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
