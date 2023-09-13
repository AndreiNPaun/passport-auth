import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme.js';
import store from './store/index.js';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import LoginCheck from './pages/LoginCheck';
import SubmitAccountDetailsPage from './pages/SubmitAccountDetails';
import AccountManagementPage from './pages/AccountManagement.js';
import NoEmailMessage from './components/Authentication/SubmitAccount/NoEmailMessage.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login-check', element: <LoginCheck /> },
      {
        path: 'create-account',
        element: <SubmitAccountDetailsPage />,
      },
      { path: 'no-email', element: <NoEmailMessage /> },
      { path: '/account-management', element: <AccountManagementPage /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
