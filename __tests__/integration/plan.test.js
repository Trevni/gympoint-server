import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import { cleanModel, authenticate } from '../util';

import Plan from '../../src/app/models/Plan';

async function createPlan(token, plan) {
  const response = await request(app)
    .post('/plans')
    .set('Authorization', `Bearer ${token}`)
    .send(plan);
  expect(response.body).toHaveProperty('id');
  return response;
}

describe('Plan', () => {
  beforeEach(() => cleanModel(Plan));

  /**
   * Permita que o usuário possa cadastrar planos para matrícula de alunos, o plano deve possuir os seguintes campos:
   * - title (nome do plano);
   * - duration (duração em número de meses);
   * - price (preço mensal do plano);
   * - created_at;
   * - updated_at;
   *
   * Crie alguns planos como por exemplo:
   * - Start: Plano de 1 mês por R$129;
   * - Gold: Plano de 3 meses por R$109/mês;
   * - Diamond: Plano de 6 meses por R$89/mês;
   *
   * Crie rotas para listagem/cadastro/atualização/remoção de planos;
   *
   * Obs.: Essa funcionalidade é para administradores autenticados na aplicação.
   */

  it('Should be able to register', async () => {
    const token = await authenticate();

    const plan = await factory.attrs('Plan');
    await createPlan(token, plan);
  });

  it('Should be able to update', async () => {
    const token = await authenticate();

    const plan = await factory.attrs('Plan');
    let response = await createPlan(token, plan);

    plan.title = 'Supimpa';
    response = await request(app)
      .put(`/plans/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(plan);
    expect(response.body).toMatchObject(plan);
  });

  it('Should be able to list', async () => {
    const token = await authenticate();

    const plan = await factory.attrs('Plan');
    await createPlan(token, plan);

    const response = await request(app)
      .get('/plans')
      .set('Authorization', `Bearer ${token}`);
    expect(response.body[0]).toMatchObject(plan);
  });

  it('Should be able to delete', async () => {
    const token = await authenticate();

    const plan = await factory.attrs('Plan');
    let response = await createPlan(token, plan);

    response = await request(app)
      .delete(`/plans/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('Should not register without authentication', async () => {
    const plan = await factory.attrs('Plan');
    const response = await request(app)
      .post('/plan')
      .send(plan);
    expect(response.status).toBe(401);
  });
});
