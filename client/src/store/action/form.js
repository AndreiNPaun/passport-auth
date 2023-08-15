import { formActions } from '../slice/form';

export const setFormOpen = () => {
  return async (dispatch) => {
    dispatch(formActions.open({ formCheck: true }));
  };
};

export const setFormClose = () => {
  return async (dispatch) => {
    dispatch(formActions.close());
  };
};
