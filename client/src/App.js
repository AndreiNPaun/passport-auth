import './App.css';

import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import store from './store/index.js';
import Homepage from './pages/Homepage';
import LoginCheck from './pages/LoginCheck';
import UserForm from './pages/UserForm';

const router = createBrowserRouter([
  { path: '/', element: <Homepage /> },
  { path: '/login-check', element: <LoginCheck /> },
  { path: '/user-form', element: <UserForm /> },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
