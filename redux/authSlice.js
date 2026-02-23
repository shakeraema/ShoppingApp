import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const normalizeEmail = (email) => email?.trim().toLowerCase() || "";

export const login = createAsyncThunk(
  "auth/login", 
  async ({ email, password }, { getState, rejectWithValue }) => {
    const state = getState();
    const normalizedEmail = normalizeEmail(email);
    const user = state.auth.users.find((u) => u.email === normalizedEmail);

    if (!user || user.password !== password) {
      return rejectWithValue("Invalid email or password");
    }

    const token = `local-${user.id}`;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { getState, rejectWithValue }) => {
    const state = getState();
    const normalizedEmail = normalizeEmail(email);

    const existingUser = state.auth.users.find(
      (u) => u.email === normalizedEmail
    );

    if (existingUser) {
      return rejectWithValue("User already registered. Please login.");
    }

    if (password.length < 6) {
      return rejectWithValue("Password must be at least 6 characters");
    }

    const user = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    const token = `local-${user.id}`;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      rawUser: user,
    };
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentUser = state.auth.userData;

      // Handle password change
      if (payload.currentPassword && payload.newPassword) {
        const user = state.auth.users.find((u) => u.id === currentUser.id);
        
        if (!user || user.password !== payload.currentPassword) {
          return rejectWithValue("Current password is incorrect");
        }

        // Create updated users array
        const updatedUsers = state.auth.users.map((u) => 
          u.id === currentUser.id 
            ? { ...u, password: payload.newPassword }
            : u
        );

        // Save to AsyncStorage
        await AsyncStorage.setItem("authState", JSON.stringify({
          ...state.auth,
          users: updatedUsers
        }));
        
        return { 
          type: 'password',
          users: updatedUsers,
          userData: currentUser 
        };
      }

      // Handle profile update (name/image)
      if (payload.name || payload.profileImage) {
        const updatedUser = {
          ...currentUser,
          ...(payload.name && { name: payload.name }),
          ...(payload.profileImage && { profileImage: payload.profileImage }),
        };

        // Update in users array
        const updatedUsers = state.auth.users.map((u) => 
          u.id === currentUser.id 
            ? { ...u, ...payload }
            : u
        );

        // Save to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        await AsyncStorage.setItem("authState", JSON.stringify({
          ...state.auth,
          users: updatedUsers
        }));
        
        return {
          type: 'profile',
          users: updatedUsers,
          userData: updatedUser
        };
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => true);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: [],
    userToken: null,
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userToken = action.payload.token;
        state.userData = action.payload.user;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        if (action.payload.rawUser) {
          state.users.push(action.payload.rawUser); 
        }
        state.userToken = action.payload.token;
        state.userData = action.payload.user;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Update users array with the new data
        state.users = action.payload.users;
        // Update userData only if profile was changed
        if (action.payload.type === 'profile') {
          state.userData = action.payload.userData;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userToken = null;
        state.userData = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;