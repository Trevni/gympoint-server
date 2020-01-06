import request from 'supertest';

import database from '../src/database';
import factory from './factories';
import app from '../src/app';

export async function initDB() {
  /**
   * Clean data
   */
  await Promise.all(
    Object.keys(database.connection.models).map(key => {
      const model = database.connection.models[key];
      return model.destroy({
        truncate: true,
        force: true,
      });
    })
  );

  /**
   * Register Admin
   */
  await factory.create('Admin');
}

export async function cleanModel(model) {
  await model.destroy({
    truncate: true,
    force: true,
  });
}

export async function authenticate() {
  const admin = await factory.attrs('Admin');
  const response = await request(app)
    .post('/sessions')
    .send(admin);

  expect(response.body).toHaveProperty('user');
  expect(response.body).toHaveProperty('token');

  return response.body.token;
}

// export function cleanData() {
//   return Promise.all(
//     Object.keys(database.connection.models).map(key => {
//       const model = database.connection.models[key];

//       // Don't truncate User
//       if (model === User) return async () => {};
//       return model.destroy({
//         truncate: true,
//         force: true,
//       });
//     })
//   );
// }

// export function truncateOne(model) {
//   return model.destroy({
//     truncate: true,
//     force: true,
//   });
// }
