import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GitHubProxy = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const url = queryParams.get('url');

        console.log(url);

        if (!url) {
          console.error('No URL provided');
          return;
        }

        const response = await axios.get(
          `${
            process.env.REACT_APP_SERVER_URL
          }/proxy-server?url=${encodeURIComponent(url)}`
        );
        setHtmlContent(response.data);
      } catch (error) {
        console.error('Error fetching HTML content:', error);
      }
    };

    fetchHtmlContent();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default GitHubProxy;
