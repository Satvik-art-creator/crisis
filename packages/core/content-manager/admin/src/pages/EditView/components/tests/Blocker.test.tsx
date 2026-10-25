import { render } from '@tests/utils';

import { Blocker } from '../Blocker';

const mockBaseBlocker = jest.fn(() => null);
const mockResetForm = jest.fn();
let modified = false;

jest.mock('@strapi/admin/strapi-admin', () => ({
  ...jest.requireActual('@strapi/admin/strapi-admin'),
  Blocker: (props: { onProceed: () => void; onCancel: () => void }) => {
    mockBaseBlocker(props);
    return null;
  },
  useForm: (
    _name: string,
    selector: (state: { modified: boolean; resetForm: jest.Mock }) => unknown
  ) => selector({ modified, resetForm: mockResetForm }),
}));

describe('Blocker', () => {
  beforeEach(() => {
    modified = false;
    mockBaseBlocker.mockClear();
    mockResetForm.mockClear();
  });

  it('keeps unsaved edits when the navigation is cancelled', () => {
    const view = render(<Blocker />);

    modified = true;
    view.rerender(<Blocker />);

    const { onCancel } = mockBaseBlocker.mock.lastCall[0];
    onCancel();

    expect(mockResetForm).not.toHaveBeenCalled();
  });
});
