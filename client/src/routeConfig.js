import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import LoginCheck from './pages/Checks/LoginCheck.js';
import SubmitAccountDetailsPage from './pages/SubmitAccountDetails';
import DashboardPage, {
  loader as editProfileLoader,
} from './pages/Dashboard.js';
import NoEmailMessage from './components/Authentication/SubmitAccount/NoEmailMessage.js';
import FailedTokenValidityPage from './pages/Checks/FailedTokenValidity.js';
import AdminDashboardPage from './pages/Admin/Dashboard.js';
import GitHubProxyPage from './pages/GitHubProxy.js';

const routerConfig = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage />, loader: editProfileLoader },
      { path: 'login-check', element: <LoginCheck /> },
      { path: 'failed-token-validity', element: <FailedTokenValidityPage /> },
      {
        path: 'complete-setup',
        element: <SubmitAccountDetailsPage />,
      },
      {
        path: 'no-email',
        element: <NoEmailMessage />,
      },
      {
        path: 'admin-dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'github-proxy-server',
        element: <GitHubProxyPage />,
      },
    ],
  },
];

export default routerConfig;
