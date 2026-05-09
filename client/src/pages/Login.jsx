import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { assets } from '../assets/assets';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData } =
    useAuthStore();

  const navigate = useNavigate();

  // Handle form submission for both login and registration
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();

      if (state === 'Sign Up') {
        const res = await api.post(`${backendUrl}/api/auth/register`, formData);
        if (res.data.success) {
          setIsLoggedIn(true);
          setUserData(res.data.userData);
          toast.success(res.data.message);
          navigate('/');
          setFormData({ username: '', email: '', password: '' });
        } else {
          toast.error(
            res.data.message || 'Registration failed. Please try again.',
          );
          return;
        }
      } else {
        const res = await api.post(`${backendUrl}/api/auth/login`, formData);
        if (res.data.success) {
          setIsLoggedIn(true);
          setUserData(res.data.userData);
          toast.success(res.data.message);
          navigate('/');
          setFormData({ username: '', email: '', password: '' });
        } else {
          toast.error(res.data.message || 'Login failed. Please try again.');
          return;
        }
      }
    } catch (e) {
      console.error('API Error:', e);
      if (e.response) {
        console.error('Error Response Data:', e.response.data);
        console.error('Error Status:', e.response.status);
        const errorMessage = Array.isArray(e.response.data.message)
          ? e.response.data.message.join(' - ')
          : e.response.data.message ||
            `Failed to ${state.toLowerCase()}. Please try again.`;
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to ${state.toLowerCase()}. Please try again.`);
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Login'
        className='absolute left-5 sm:left-20 h-10 w-auto sm:h-12 top-5 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 w-full sm:w-96 text-indigo-300 text-sm rounded-lg shadow-lg'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Sign Up' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create an Account' : 'Login to your account'}
        </p>
        <form onSubmit={handleFormSubmit}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              👨🏿‍🦱
              <input
                className='bg-transparent outline-none w-full text-sm text-gray-300'
                type='text'
                placeholder='Username'
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          )}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            📧
            <input
              className='bg-transparent outline-none w-full text-sm text-gray-300'
              type='email'
              placeholder='email id'
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            🔒
            <input
              className='bg-transparent outline-none w-full text-sm text-gray-300'
              type='password'
              placeholder='Password'
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-500 hover:text-indigo-400 cursor-pointer'
          >
            Forgot password?
          </p>
          <button
            className='bg-linear-to-r from-indigo-500 to-indigo-900 mb-3 text-white font-medium py-2 px-4 rounded-full w-full cursor-pointer'
            type='submit'
          >
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-center text-sm text-gray-400'>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-indigo-500 hover:text-indigo-400 underline cursor-pointer'
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='text-center text-sm text-gray-400'>
            Don't have an account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-indigo-500 hover:text-indigo-400 mt-4 underline cursor-pointer'
            >
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
