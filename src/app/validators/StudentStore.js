import * as Yup from 'yup';
import { createValidator } from '../../util/validators';

export default createValidator(
  Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    age: Yup.number()
      .integer()
      .required(),
    weight: Yup.number()
      .integer()
      .required(),
    height: Yup.number()
      .integer()
      .required(),
  })
);
