import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore';
import api from '../lib/axios';

const OtpForm = ({ onSubmit, h1, p }) => {
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const { setIsOtpSubmitted, setOtp, fetchUserData, backendUrl } =
    useAuthStore();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      // index < 5
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const hanldePaste = (e) => {
    const pasteData = e.clipboardData.getData('text');
    const pasteValues = pasteData.split('');
    pasteValues.forEach((value, index) => {
      if (index < inputRefs.current.length) {
        inputRefs.current[index].value = value;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const otpArray = inputRefs.current.map((input) => input.value);
      const otp = otpArray.join('');

      const res = await api.post(`${backendUrl}/api/auth/verify-account`, {
        otp,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchUserData();
        navigate('/');
      } else {
        toast.error(
          res.data.message || 'Verification failed. Please try again.',
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'Verification failed. Please try again.',
      );
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    setIsOtpSubmitted(true);
    const otpArray = inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join(''));
  };

  return (
    <form
      onSubmit={onSubmit ? onSubmitHandler : onSubmitOtp}
      className='bg-slate-900 text-sm p-8 rounded-lg shadow-lg w-96 '
    >
      <h1 className='text-white font-semibold text-2xl text-center mb-4'>
        {/* Reset Password OTP */}
        {h1}
      </h1>
      <p className='text-center mb-6 text-indigo-300'>
        {/* Enter the 6-digit code sent to your email id */}
        {p}
      </p>
      <div onPaste={hanldePaste} className='flex justify-between mb-8'>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <input
              key={index}
              type='text'
              maxLength='1'
              autoComplete='off'
              required
              className='w-12 h-12 text-white bg-[#333A5C] text-xl text-center rounded-md'
              ref={(e) => (inputRefs.current[index] = e)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
      </div>
      <button
        type='submit'
        className='w-full py-2.5 cursor-pointer text-white bg-linear-to-r from-indigo-500 to-indigo-900 rounded-full'
      >
        {onSubmit ? 'Verify' : 'Reset Password'}
      </button>
    </form>
  );
};

export default OtpForm;
