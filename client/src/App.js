import './App.css';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import store from './store/index.js';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/Error';
import HomePage from './pages/Home';
import LoginCheck from './pages/LoginCheck';
import UserForm from './pages/UserForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login-check', element: <LoginCheck /> },
      { path: 'user-form', element: <UserForm /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
