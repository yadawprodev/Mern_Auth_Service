import { create } from 'zustand';

import api from '../lib/axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useAuthStore = create((set, get) => ({
  backendUrl,
  isLoggedIn: false,
  isOtpSubmitted: false,
  setIsOtpSubmitted: (value) => set({ isOtpSubmitted: value }),
  otp: null,
  setOtp: (value) => set({ otp: value }),
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  userData: null,
  setUserData: (data) => set({ userData: data }),
  fetchUserData: async () => {
    try {
      const res = await api.get(`${get().backendUrl}/api/user`);
      if (res.data.success) {
        set({ userData: res.data.userData, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If fetch fails, assume not logged in
      set({ userData: null, isLoggedIn: false });
    }
  },
  // verifyEmail: async (otp) => {
  //   try {
  //     const res = await api.post(
  //       `${get().backendUrl}/api/auth/verify-account`,
  //       {
  //         otp,
  //       },
  //     );
  //     return res.data;
  //   } catch (error) {
  //     console.error('Error verifying email:', error);
  //     throw error;
  //   }
  // },
}));

export default useAuthStore;
