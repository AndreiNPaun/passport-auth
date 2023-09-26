import React from 'react';

import { useLocation } from 'react-router-dom';

const ProviderList = () => {
  const location = useLocation();
  const providerName = location.state?.providerName;

  console.log('provider', location);
  return <div>aici {providerName}</div>;
};

export default ProviderList;
