import '@testing-library/jest-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';

import { render } from '../../../test-utils';
import HttpRequest from '../../../utils/HttpRequest';
import SubmitDetails from './SubmitDetails';

jest.mock('../../../utils/HttpRequest');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('SubmitDetails', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    delete window.location;
    window.location = { search: '?provider=github' };
    useNavigate.mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('submits form data and navigates on success', async () => {
    HttpRequest.mockResolvedValueOnce({ status: 200, data: 'testing' });
    render(<SubmitDetails />);

    const givenNameTextElement = screen.getByLabelText('First Name');
    await userEvent.type(givenNameTextElement, 'John');
    const familyNameTextElement = screen.getByLabelText('Last Name');
    await userEvent.type(familyNameTextElement, 'Doe');

    const buttonElement = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(buttonElement);

    expect(mockNavigate).toBeCalledWith('/login-check?isLoggedIn=true&testing');
  });

  it('should redirect to account-management page if status code is not 200', async () => {
    HttpRequest.mockResolvedValueOnce({});
    render(<SubmitDetails />);

    const buttonElement = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(buttonElement);

    expect(mockNavigate).toBeCalledWith('/account-management');
  });

  it('should change the submit button text to "Submitting..." if form is submitted', async () => {
    HttpRequest.mockResolvedValueOnce({});
    render(<SubmitDetails />);

    const submitButtonElement = screen.getByRole('button', {
      name: 'Submit',
    });
    await userEvent.click(submitButtonElement);

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

    render(<SubmitDetails />);

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

    render(<SubmitDetails />);

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

  it('should display "An error occurred while updating the profile." if an unexpected API error is returned', async () => {
    await act(async () => {
      HttpRequest.mockRejectedValueOnce({
        response: {
          status: 400,
        },
      });
    });

    render(<SubmitDetails />);

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
