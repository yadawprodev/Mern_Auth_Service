import { assets } from '../assets/assets';
import useAuthStore from '../store/authStore';

const Header = () => {
  const { userData } = useAuthStore();

  return (
    <div className='flex flex-col items-center mt-20 text-center px-4 text-gray-800'>
      <img src={assets.header_img} className='w-36 h-36 rounded-full mb-4' />
      {userData && !userData.isAccountVerified && (
        <div className='w-full max-w-md mb-5 px-4 py-3 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm flex items-center justify-center gap-2'>
          <span>⚠️</span>
          <span>Please verify your email to unlock all features.</span>
        </div>
      )}
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl mb-4 font-medium'>
        {userData?.username ? `Hey ${userData.username}` : 'Hey Developer'} !
        <span className='inline-block  text-3xl'>👋 </span>
      </h1>
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Welcome to our app
      </h2>
      <p className='mb-8 max-w-md '>
        Get started by creating an account and exploring the features.
      </p>
      <button className='border bg-gray-800 text-white rounded-full px-8 py-2.5 hover:bg-gray-500 transtion-all'>
        Get Started
      </button>
    </div>
  );
};

export default Header;
