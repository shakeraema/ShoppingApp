import { createAsyncThunk } from "@reduxjs/toolkit";


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