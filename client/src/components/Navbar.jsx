import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { assets } from '../assets/assets';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useAuthStore();

  const navigate = useNavigate();

  // Function to send verification OTP
  const sendVerificationOtp = async (e) => {
    try {
      e.preventDefault();

      const res = await api.post('/api/auth/send-verification-otp');

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/verify-email');
      } else {
        toast.error(
          res.data.message ||
            'Failed to send verification OTP. Please try again.',
        );
      }
    } catch (e) {
      toast.error(
        res.data.message ||
          'Failed to send verification OTP. Please try again.',
      );
    }
  };

  // Handle user logout
  const handleLogout = async (e) => {
    try {
      e.preventDefault();

      const res = await api.post('/api/auth/logout');
      setIsLoggedIn(false);
      setUserData(null);
      navigate('/');

      toast.success(res.data.message || 'Logged out successfully');
    } catch (e) {
      console.error('Logout Error:', e);
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 absolute top-0 sm:px-24'>
      {/* Logo */}
      <a
        href='/'
        className='flex items-center gap-2 text-lg font-bold text-gray-800'
      >
        <img src={assets.logo} alt='Logo' className='h-10 w-auto sm:h-12' />
        <span>Auth</span>
      </a>
      {userData && userData.username ? (
        <div className='flex w-8 h-8 justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
          {userData.username[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none bg-gray-100 shadow-lg m-0 p-2 text-sm'>
              {!userData.isAccountVerified && (
                <li
                  className='py-1 px-2 hover:bg-gray-200 cursor-pointer'
                  onClick={sendVerificationOtp}
                >
                  Verify Email
                </li>
              )}
              <li
                className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='bg-gray-800 hover:bg-gray-500 text-white px-6 py-1.5 rounded-full font-semibold transition-all hover:shadow-md cursor-pointer'
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
