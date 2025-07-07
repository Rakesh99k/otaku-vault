import React, { useEffect } from 'react';
import axios from 'axios';

const Home = () => {

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await axios.get('https://api.jikan.moe/v4/top/anime');
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching anime data", error);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <div>
      <h1>Welcome to OtakuVault</h1>
      <p>Check the console for API data 🚀</p>
    </div>
  );
};

export default Home;
