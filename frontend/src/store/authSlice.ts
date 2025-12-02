import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    role: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { token, role } = action.payload;
            state.token = token;
            state.role = role;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            localStorage.clear();
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
