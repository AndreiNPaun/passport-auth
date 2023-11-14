import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../../../test-utils';
import ProviderArea from './ProviderArea';

jest.mock('../../../utils/TokenError');

describe('ProviderArea', () => {
  it('should check if the "See Connections" modal is not open by default', () => {
    render(<ProviderArea />);

    const modalElement = screen.queryByText('Provider:', { exact: false });
    expect(modalElement).not.toBeInTheDocument();
  });

  it('should open "See Connection" modal is button is clicked on', async () => {
    render(<ProviderArea />);

    const connectionsButtonElement = screen.getAllByRole('button', {
      name: 'See Connections',
    });
    userEvent.click(connectionsButtonElement[0]);

    const modalElement = await screen.findByText('Provider:', { exact: false });
    expect(modalElement).toBeInTheDocument();
  });
});
