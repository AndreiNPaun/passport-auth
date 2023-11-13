import '@testing-library/jest-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../../test-utils';
import HttpRequest from '../../../utils/HttpRequest';
import ProviderList from './ProviderList';

jest.mock('../../../utils/HttpRequest');
jest.mock('../../../utils/TokenError');

describe('ProviderList', () => {
  const providerName = 'Microsoft';

  it('should check if provider has a name set', () => {
    render(<ProviderList providerName={providerName} />);

    const textElement = screen.queryByText('Microsoft', { exact: false });
    expect(textElement).toBeInTheDocument();
  });

  it('if no account has been found through HttpRequest, display message', () => {
    HttpRequest.mockImplementation({ data: [] });

    render(<ProviderList providerName={providerName} />);

    const textElement = screen.queryByText(
      'No accounts linked from this provider.',
      {
        exact: false,
      }
    );
    expect(textElement).toBeInTheDocument();
  });

  it('should display list of connected providers', async () => {
    HttpRequest.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          email: 'johndoe@testing.com',
          givenName: 'John',
          familyName: 'Doe',
        },
      ],
    });

    render(<ProviderList providerName={providerName} />);

    const emailTextElement = await screen.findByText(
      'Email: johndoe@testing.com',
      {
        exact: false,
      }
    );
    const givenNameTextElement = await screen.findByText('First name: John', {
      exact: false,
    });
    const familyNameElement = await screen.findByText('Last name: Doe', {
      exact: false,
    });

    expect(emailTextElement).toBeInTheDocument();
    expect(givenNameTextElement).toBeInTheDocument();
    expect(familyNameElement).toBeInTheDocument();
  });

  it('should check if delete has been called', async () => {
    HttpRequest.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          email: 'johndoe@testing.com',
          givenName: 'John',
          familyName: 'Doe',
        },
      ],
    });
    window.confirm = jest.fn().mockImplementation(() => true);

    await act(async () => {
      render(<ProviderList providerName={providerName} />);
    });

    const buttonElement = screen.getByRole('button', {
      name: 'Delete',
    });

    await userEvent.click(buttonElement);

    expect(window.confirm).toBeCalledWith(
      'Are you sure you wish to delete this connection?'
    );
  });
});
