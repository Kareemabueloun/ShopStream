
import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

let parsedUser = null;

try {
  parsedUser = savedUser ? JSON.parse(savedUser) : null;
} catch {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

const isAdminUser = (user) =>
  user?.username === "admin" &&
  user?.id === "shopstream-admin";

const initialRole = parsedUser
  ? isAdminUser(parsedUser)
    ? "admin"
    : "customer"
  : null;

const initialState = {
  token: savedToken || null,
  user: parsedUser
    ? { ...parsedUser, role: initialRole }
    : null,
  role: initialRole,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      const incomingUser = action.payload.user;

      const role = isAdminUser(incomingUser)
        ? "admin"
        : "customer";

      const userToSave = {
        ...incomingUser,
        role,
      };

      state.token = action.payload.token;
      state.user = userToSave;
      state.role = role;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(userToSave));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    setUser: (state, action) => {
      const userToSave = {
        ...action.payload,
        role: state.role === "admin" ? "admin" : "customer",
      };

      state.user = userToSave;
      localStorage.setItem("user", JSON.stringify(userToSave));
    },
  },
});

export const { loginSuccess, logout, setUser } =
  authSlice.actions;

export default authSlice.reducer;
