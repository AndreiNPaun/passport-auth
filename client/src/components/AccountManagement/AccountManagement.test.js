import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../test-utils';
import AccountManagement from './AccountManagement';

const userInfo = { givenName: 'John', familyName: 'Doe', role: 'tester' };

describe('AccountManagement', () => {
  it('should render user profile information', async () => {
    render(<AccountManagement userInfo={userInfo} />);

    const givenNameElement = screen.queryByText('John');
    const familyNameElement = screen.queryByText('Doe');
    const roleElement = screen.queryByText('tester');

    expect(givenNameElement).toBeInTheDocument();
    expect(familyNameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });

  it('should open edit modal on edit button click', () => {
    render(<AccountManagement userInfo={userInfo} />);

    const editButtonElement = screen.getByRole('button', {
      name: 'Edit Information',
    });
    userEvent.click(editButtonElement);

    const formElement = screen.queryByText('Edit Information');
    expect(formElement).toBeInTheDocument();
  });

  it('should not show the edit profile form modal by default', () => {
    render(<AccountManagement userInfo={userInfo} />);

    const formElement = screen.queryByText('Edit Account');
    expect(formElement).not.toBeInTheDocument();
  });

  it('should prefill edit form with user data', () => {
    render(<AccountManagement userInfo={userInfo} />);

    const editButtonElement = screen.getByRole('button', {
      name: 'Edit Information',
    });
    userEvent.click(editButtonElement);

    const firstNameElement = screen.queryByText('John');
    const lastNameElement = screen.queryByText('Doe');

    expect(firstNameElement).toBeInTheDocument();
    expect(lastNameElement).toBeInTheDocument();
  });
});
