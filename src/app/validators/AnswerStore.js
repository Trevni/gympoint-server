import * as Yup from 'yup';
import { createValidator } from '../../util/validators';

export default createValidator(
  Yup.object().shape({
    answer: Yup.string().required(),
  })
);
