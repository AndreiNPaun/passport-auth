import '@testing-library/jest-dom';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../../test-utils';
import HttpRequest from '../../../utils/HttpRequest';
import { TokenErrorFunction } from '../../../utils/TokenError';
import EditProfile from './EditProfile';

jest.mock('../../../utils/HttpRequest');
jest.mock('../../../utils/TokenError');

describe('EditProfile', () => {
  const userData = { givenName: 'John', familyName: 'Doe', role: 'tester' };

  it('should display user data in the form input fields', () => {
    render(
      <EditProfile
        userData={userData}
        closeFormHandler={() => {}}
        updateDisplayedUserData={() => {}}
      />
    );

    const givenNameInputElement = screen.getByLabelText('First Name', {
      exact: false,
    });
    const familyNameInputElement = screen.getByLabelText('Family Name', {
      exact: false,
    });

    expect(givenNameInputElement.value).toBe('John');
    expect(familyNameInputElement.value).toBe('Doe');
  });

  it('should change the submit button text to "Submitting..." if form is submitted', async () => {
    render(
      <EditProfile
        userData={userData}
        closeFormHandler={() => {}}
        updateDisplayedUserData={() => {}}
      />
    );

    const submitButtonElement = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButtonElement);

    const submittingTextElement = await screen.findByText('Submitting...');
    expect(submittingTextElement).toBeInTheDocument();
  });

  it('should display error message if first name field is submitted empty', async () => {
    await act(async () => {
      HttpRequest.mockRejectedValueOnce({
        response: {
          data: ['First name is required.'],
        },
      });
    });

    render(
      <EditProfile
        userData={userData}
        closeFormHandler={() => {}}
        updateDisplayedUserData={() => {}}
      />
    );

    const firstNameElement = screen.getByLabelText('First Name');
    userEvent.clear(firstNameElement);

    await act(async () => {
      const submitButtonElement = screen.getByRole('button', {
        name: 'Submit',
      });
      userEvent.click(submitButtonElement);
    });

    const errorFirstNameElement = await screen.findByText(
      'First name is required.'
    );
    expect(errorFirstNameElement).toBeInTheDocument();
  });

  it('should display error messages if both first name and family name fields are submitted empty', async () => {
    await act(async () => {
      HttpRequest.mockRejectedValueOnce({
        response: {
          data: ['First name is required.', 'Family name is required.'],
        },
      });
    });

    render(
      <EditProfile
        userData={userData}
        closeFormHandler={() => {}}
        updateDisplayedUserData={() => {}}
      />
    );

    const firstNameElement = screen.getByLabelText('First Name');
    userEvent.clear(firstNameElement);
    const familyNameElement = screen.getByLabelText('Family Name');
    userEvent.clear(familyNameElement);

    await act(async () => {
      const submitButtonElement = screen.getByRole('button', {
        name: 'Submit',
      });
      userEvent.click(submitButtonElement);
    });

    const errorFirstNameElement = await screen.findByText(
      'First name is required.'
    );
    const errorFamilyNameElement = await screen.findByText(
      'Family name is required.'
    );

    expect(errorFirstNameElement).toBeInTheDocument();
    expect(errorFamilyNameElement).toBeInTheDocument();
  });

  it('should call TokenErrorFunction if error status code is 401', async () => {
    const userData = { givenName: 'John', familyName: 'Doe', role: 'tester' };
    HttpRequest.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    render(
      <EditProfile
        userData={userData}
        closeFormHandler={() => {}}
        updateDisplayedUserData={() => {}}
      />
    );

    const submitButtonElement = screen.getByRole('button', { name: 'Submit' });
    userEvent.click(submitButtonElement);

    await waitFor(() => {
      expect(TokenErrorFunction).toHaveBeenCalled();
    });
  });

  it('should display "An error occurred while updating the profile." if an unexpected API error is returned', async () => {
    await act(async () => {
      HttpRequest.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
    });

    render(
      <EditProfile
        userData={userData}
        closeFormHandler={() => {}}
        updateDisplayedUserData={() => {}}
      />
    );

    await act(async () => {
      const submitButtonElement = screen.getByRole('button', {
        name: 'Submit',
      });
      userEvent.click(submitButtonElement);
    });

    const errorMessageElement = await screen.findByText(
      'An error occurred while updating the profile.'
    );
    expect(errorMessageElement).toBeInTheDocument();
  });
});
