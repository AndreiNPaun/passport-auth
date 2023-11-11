import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

import render from '../../test-utils';
import AccountManagement from './AccountManagement';

describe('AccountManagement', () => {
  test('renders user profile information', async () => {
    const userInfo = { givenName: 'John', familyName: 'Doe', role: 'tester' };
    render(<AccountManagement userInfo={userInfo} />);

    const givenNameElement = screen.getByText('John', { exact: false });
    const familyNameElement = screen.getByText('Doe', { exact: false });
    const roleElement = screen.getByText('test', { exact: false });

    expect(givenNameElement).toBeInTheDocument();
    expect(familyNameElement).toBeInTheDocument();
    expect(roleElement).toBeInTheDocument();
  });
});
