import * as Yup from 'yup';
import { createValidator } from '../../util/validators';

export default createValidator(
  Yup.object().shape({
    student_id: Yup.number()
      .integer()
      .required(),
    plan_id: Yup.number()
      .integer()
      .required(),
    start_date: Yup.date().required(),
  })
);
