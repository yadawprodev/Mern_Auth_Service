import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import { assets } from '../assets/assets';

import OtpForm from '../components/OtpForm';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  // const [otp, setOtp] = useState(null);
  // const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const navigate = useNavigate();
  const { backendUrl, fetchUserData, isOtpSubmitted, setIsOtpSubmitted, otp } =
    useAuthStore();

  //   if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
  //     // index < 5
  //     inputRefs.current[index + 1].focus();
  //   }
  // };

  // const handleKeyDown = (e, index) => {
  //   if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
  //     inputRefs.current[index - 1].focus();
  //   }
  // };

  // const hanldePaste = (e) => {
  //   const pasteData = e.clipboardData.getData('text');
  //   const pasteValues = pasteData.split('');
  //   pasteValues.forEach((value, index) => {
  //     if (index < inputRefs.current.length) {
  //       inputRefs.current[index].value = value;
  //     }
  //   });
  // };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(`${backendUrl}/api/auth/reset-password`, {
        otp,
        email,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');

        console.log(res.data);
      } else {
        toast.error(
          res.data.message ||
            'Error while resetting password. Please try again.',
        );
      }
    } catch (e) {
      setIsOtpSubmitted(false);

      toast.error(
        e.response?.data?.message || 'Error while resetting password',
      );
      console.error('Reset password error:', e);
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        `${backendUrl}/api/auth/send-reset-password-otp`,
        {
          email,
        },
      );

      if (res.data.success) {
        setIsEmailSent(true);
      } else {
        toast.error(
          res.data.message || 'Error while sending OTP. Please try again.',
        );
      }
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          'Error while submitting email. Please try again.',
      );
      console.error('Error while submitting email:', e);
    }
  };

  // const onSubmitOtp = async (e) => {
  //   e.preventDefault();
  //   setIsOtpSubmitted(true);
  //   const otpArray = inputRefs.current.map((input) => input.value);
  //   setOtp(otpArray.join(''));
  // };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt='Login'
        className='absolute left-5 sm:left-20 h-10 w-auto sm:h-12 top-5 cursor-pointer'
      />

      {/* Form to enter email id and send otp */}

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className='bg-slate-900 text-sm p-8 rounded-lg shadow-lg w-96 '
        >
          <h1 className='text-white font-semibold text-2xl text-center mb-4'>
            Reset password
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter your registered email address
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            📧
            <input
              className='bg-transparent outline-none w-full text-sm text-gray-300'
              type='email'
              placeholder='email id'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className='bg-linear-to-r from-indigo-500 to-indigo-900 mb-3 text-white font-medium py-2 px-4 rounded-full w-full cursor-pointer'
            type='submit'
          >
            Submit
          </button>
        </form>
      )}

      {/* Form to enter otp and reset password*/}

      {isEmailSent && !isOtpSubmitted && (
        <OtpForm
          h1={'Reset Password OTP'}
          p={' Enter the 6-digit code sent to your email id'}
        />
      )}

      {/* form to enter new password */}

      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className='bg-slate-900 text-sm p-8 rounded-lg shadow-lg w-96 '
        >
          <h1 className='text-white font-semibold text-2xl text-center mb-4'>
            New password
          </h1>
          <p className='text-center mb-6 text-indigo-300'>
            Enter your new password and confirm it to reset your password
          </p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            🔒
            <input
              className='bg-transparent outline-none w-full text-sm text-gray-300'
              type='password'
              placeholder='New password'
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            className='bg-linear-to-r from-indigo-500 to-indigo-900 mb-3 text-white font-medium py-2 px-4 rounded-full w-full cursor-pointer'
            type='submit'
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
