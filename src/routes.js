import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

import validateStudentStore from './app/validators/StudentStore';
import validateStudentUpdate from './app/validators/StudentUpdate';
import validatePlanStore from './app/validators/PlanStore';
import validatePlanUpdate from './app/validators/PlanUpdate';
import validateRegistrationStore from './app/validators/RegistrationStore';
import validateRegistrationUpdate from './app/validators/RegistrationUpdate';
import validateHelpOrderStore from './app/validators/HelpOrderStore';
import validateAnswerStore from './app/validators/AnswerStore';

// TODO - List validation

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

/**
 * Student
 */

routes.post('/sessions', SessionController.store);

routes.get('/students/:id/checkins', CheckinController.list);
routes.post('/students/:id/checkins', CheckinController.store);

routes.post(
  '/students/:id/help-orders',
  validateHelpOrderStore,
  HelpOrderController.store
);
routes.get('/students/:id/help-orders', HelpOrderController.list);

/**
 * Administrator
 */

routes.use(authMiddleware);

routes.post('/students', validateStudentStore, StudentController.store);
routes.put('/students/:id', validateStudentUpdate, StudentController.update);
routes.get('/students', StudentController.list);
routes.delete('/students/:id', StudentController.delete);

routes.post('/plans', validatePlanStore, PlanController.store);
routes.put('/plans/:id', validatePlanUpdate, PlanController.update);
routes.get('/plans', PlanController.list);
routes.delete('/plans/:id', PlanController.delete);

routes.post(
  '/registrations',
  validateRegistrationStore,
  RegistrationController.store
);
routes.put(
  '/registrations/:id',
  validateRegistrationUpdate,
  RegistrationController.update
);
routes.get('/registrations', RegistrationController.list);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.get('/help-orders', AnswerController.list);
routes.post(
  '/help-orders/:id/answer',
  validateAnswerStore,
  AnswerController.store
);

export default routes;
