import faker from 'faker';
import { factory } from 'factory-girl';
import { format } from 'date-fns';

import User from '../src/app/models/User';
import Student from '../src/app/models/Student';
import Plan from '../src/app/models/Plan';
import Registration from '../src/app/models/Registration';
import Checkin from '../src/app/models/Checkin';
import HelpOrder from '../src/app/models/HelpOrder';

const random = (min, max, precision = 0) =>
  Math.floor((min + Math.random() * (max - min)) * 10 ** precision) /
  10 ** precision;

const random_model_item = model => async () => {
  const list = await model.findAll();
  const idx = random(0, list.length - 1);
  return list[idx];
};

const random_age = () => random(14, 65);
const random_weight = () => random(35, 135, 2);
const random_height = () => random(1, 2, 2);
const random_price = () => random(0.1, 1200, 2);

const random_duration = () => random(1, 12);

// const random_student = random_model_item(Student);
// const random_plan = random_model_item(Student);
const random_student = 1;
const random_plan = 2;

// factory.define('User', User, {
//   name: faker.name.findName(),
//   email: faker.internet.email(),
//   password: faker.internet.password(),
// });

factory.define('Admin', User, {
  name: 'Administrador',
  email: 'admin@gympoint.com',
  password: '123456',
});

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  age: random_age,
  weight: random_weight,
  height: random_height,
});

factory.define('Plan', Plan, {
  title: faker.commerce.productName(),
  duration: random_duration,
  price: random_price,
});

factory.define('Registration', Registration, {
  student_id: random_student,
  plan_id: random_plan,
  start_date: () => `${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")}Z`,
});

factory.define('Checkin', Checkin, {
  student_id: random_student,
});

factory.define('HelpOrder', HelpOrder, {
  student_id: random_student,
  question: faker.random.words(300),
});

factory.define('HelpOrderAnswer', HelpOrder, {
  answer: faker.random.words(300),
});

export default factory;
