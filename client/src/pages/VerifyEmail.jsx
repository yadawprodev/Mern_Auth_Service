import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import { assets } from '../assets/assets';

import OtpForm from '../components/OtpForm';

const VerifyEmail = () => {
  const navigate = useNavigate();

  const { fetchUserData, isLoggedIn, userData } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && userData.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedIn, userData, fetchUserData]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Login'
        className='absolute left-5 sm:left-20 h-10 w-auto sm:h-12 top-5 cursor-pointer'
      />

      <OtpForm
        onSubmit={'verifyEmail'}
        h1={'Verify Email'}
        p={' Enter the 6-digit code sent to your email id'}
      />
    </div>
  );
};

export default VerifyEmail;
