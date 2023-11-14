import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../../test-utils';
import HttpRequest from '../../utils/HttpRequest';
import AccountManagement from './AccountManagement';

jest.mock('../../utils/HttpRequest');

describe('AccountManagement', () => {
  const userInfo = { givenName: 'John', familyName: 'Doe', role: 'tester' };

  it('should render user profile information', async () => {
    render(<AccountManagement userInfo={userInfo} />);

    const givenNameElement = screen.queryByText('John');
    const familyNameElement = screen.queryByText('Doe');
    const roleElement = screen.queryByText('tester');

    expect(givenNameElement).toBeInTheDocument();
    expect(familyNameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });

  it('should open edit profile modal on edit button click', () => {
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

  it('should close edit user profile modal if "Close" button is clicked on', async () => {
    render(<AccountManagement userInfo={userInfo} />);

    const editButtonElement = screen.getByRole('button', {
      name: 'Edit Information',
    });
    userEvent.click(editButtonElement);

    const closeButtonElement = await screen.findByRole('button', {
      name: 'Close',
    });
    userEvent.click(closeButtonElement);
  });

  it('should update account management page when edit account information modal form has been submitted', async () => {
    HttpRequest.mockImplementation(() => Promise.resolve());

    render(<AccountManagement userInfo={userInfo} />);

    const editButtonElement = screen.getByRole('button', {
      name: 'Edit Information',
    });
    userEvent.click(editButtonElement);

    const givenNameInputElement = await screen.findByLabelText('First Name');

    userEvent.clear(givenNameInputElement);
    await userEvent.type(givenNameInputElement, 'Jane');

    const submitButtonElement = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButtonElement);

    await waitFor(() => {
      expect(HttpRequest).toBeCalledWith(
        'post',
        `${process.env.REACT_APP_SERVER_URL}/account-management/edit-profile`,
        {
          userInputData: expect.objectContaining({
            givenName: 'Jane',
            familyName: 'Doe',
          }),
        }
      );
    });

    const updatedGivenNameElement = screen.getByText('Jane');
    expect(updatedGivenNameElement).toBeInTheDocument();
  });
});
