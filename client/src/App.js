import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme.js';
import store from './store/index.js';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import LoginCheck from './pages/LoginCheck';
import CreateAccountPage from './pages/CreateAccount';
import AccountManagementPage from './pages/AccountManagement.js';
import EditProfilePage from './pages/EditProfile.js';

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
        element: <CreateAccountPage />,
      },
      { path: '/account-management', element: <AccountManagementPage /> },
      {
        path: 'edit-profile',
        element: <EditProfilePage />,
      },
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
