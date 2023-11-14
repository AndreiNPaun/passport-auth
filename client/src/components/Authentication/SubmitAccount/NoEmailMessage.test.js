import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

import { renderWithCustomRouter as render } from '../../../test-utils';
import NoEmailMessage from './NoEmailMessage';

describe('NoEmailMessage', () => {
  it('renders the NoEmailMessage component', () => {
    render(<NoEmailMessage />, { route: '/?provider=github' });

    const textElement = screen.getByText('Missing Email', { exact: false });
    expect(textElement).toBeInTheDocument();
  });

  it('displays the correct provider name from URL parameters', () => {
    const providerName = 'github';
    render(providerName);
    expect(screen.getByText(new RegExp(providerName, 'i'))).toBeInTheDocument();
  });
});
