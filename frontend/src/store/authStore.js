import { create } from "zustand";
import axios from "axios";

/**
 * Zustand will be our state management library.
 * So we can manage our state across all level in our application.
 * That will be our Global state management
 */

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true; //this makes axios will include the cookie in every request

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true, //to check auth at every page refresh

  signUp: async ({ email, password, name }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Handle all error scenarios
      if (error.response) {
        // Server responded with a status other than 2xx
        console.log("response error:", error.response.data);
        set({
          error: error.response.data.message || "Error signing up",
          isLoading: false,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.log("No response from server:", error.request);
        set({
          error: "No response from server. Please try again.",
          isLoading: false,
        });
      } else {
        // Something happened in setting up the request
        console.log("Error in setting up request:", error.message);
        set({
          error: "An error occurred. Please try again.",
          isLoading: false,
        });
      }
    }
  },

  login: async ({ email, password, name }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
}));
