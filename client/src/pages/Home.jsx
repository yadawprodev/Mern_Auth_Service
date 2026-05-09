import { useEffect } from 'react';

import Header from '../components/Header';
import Navbar from '../components/Navbar';

import useAuthStore from '../store/authStore';
import api from '../lib/axios';

const Home = () => {
  const { setIsLoggedIn, setUserData, fetchUserData } = useAuthStore();

  // On component mount, check if the user is authenticated and restore auth state
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, setIsLoggedIn, setUserData]);

  return (
    <div className='flex flex-col items-center'>
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
