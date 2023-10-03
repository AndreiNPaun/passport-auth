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
import AccountManagementPage, {
  loader as editProfileLoader,
} from './pages/AccountManagement.js';
import ProviderListPage, {
  loader as providerListLoader,
  action as providerListAction,
} from './pages/ProviderList.js';
import NoEmailMessage from './components/Authentication/SubmitAccount/NoEmailMessage.js';
import FailedTokenValidityPage from './pages/FailedTokenValidity.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login-check', element: <LoginCheck /> },
      { path: 'failed-token-validity', element: <FailedTokenValidityPage /> },
      {
        path: 'create-account',
        element: <SubmitAccountDetailsPage />,
      },
      { path: 'no-email', element: <NoEmailMessage /> },
      {
        path: 'account-management',
        element: <AccountManagementPage />,
        loader: editProfileLoader,
      },
      {
        path: 'provider-list/:providerName',
        element: <ProviderListPage />,
        loader: providerListLoader,
        action: providerListAction,
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
