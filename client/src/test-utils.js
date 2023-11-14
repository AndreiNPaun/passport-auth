import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import store from './store';

export const render = (component) => {
  rtlRender(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

export const renderWithCustomRouter = (component, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  render(component);
};
