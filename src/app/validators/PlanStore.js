import * as Yup from 'yup';
import { createValidator } from '../../util/validators';

export default createValidator(
  Yup.object().shape({
    title: Yup.string().required(),
    duration: Yup.number()
      .integer()
      .required(),
    price: Yup.number().required(),
  })
);
