import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import { cleanModel, authenticate } from '../util';

import Registration from '../../src/app/models/Registration';

async function createRegistration(token, registration) {
  const response = await request(app)
    .post('/registrations')
    .set('Authorization', `Bearer ${token}`)
    .send(registration);
  expect(response.body).toHaveProperty('id');
  return response;
}

describe('Registration', () => {
  beforeEach(() => cleanModel(Registration));

  /**
   * Apesar do aluno estar cadastrado na plataforma, isso não significa que o mesmo tem uma matrícula ativa e que pode acessar a academia.
   *
   * Nessa funcionalidade criaremos um cadastro de matrículas por aluno, a matrícula possui os campos:
   * - student_id (referência ao aluno);
   * - plan_id (referência ao plano);
   * - start_date (data de início da matrícula);
   * - end_date (date de término da matrícula);
   * - price (preço total calculado na data da matrícula);
   * - created_at;
   * - updated_at;
   *
   * A data de início da matrícula deve ser escolhida pelo usuário.
   *
   * A data de término e preço da matrícula deve ser calculada com base no plano selecionado, por exemplo:
   * Data de início informada: 23/05/2019 Plano selecionado: Gold (3 meses) Data de término calculada: 23/08/2019 (3 meses depois do início) Preço calculado: R$327
   *
   * Quando um aluno realiza uma matrícula ele recebe um e-mail com detalhes da sua inscrição na academia como plano, data de término, valor e uma mensagem de boas-vidas.
   *
   * Crie rotas para listagem/cadastro/atualização/remocação de matrículas;
   *
   * Obs.: Essa funcionalidade é para administradores autenticados na aplicação.
   *
   * [Novas funcionalidades]
   *
   * TODO - Antes de iniciar a parte web, adicione as seguintes funcionalidades no back-end da aplicação:
   * - Adicione um campo boolean true/false na listagem de matrículas indicando se a matrícula está ativa ou não, ou seja, se a data de término é posterior à atual e a data de início inferior (utilize um campo VIRTUAL).
   */

  it('Should be able to register', async () => {
    const token = await authenticate();

    const registration = await factory.attrs('Registration');
    await createRegistration(token, registration);
  });

  it('Should be able to update', async () => {
    const token = await authenticate();

    const registration = await factory.attrs('Registration');
    let response = await createRegistration(token, registration);

    registration.plan_id = 15;
    response = await request(app)
      .put(`/registrations/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(registration);
    expect(response.body).toMatchObject(registration);
  });

  it('Should be able to list', async () => {
    const token = await authenticate();

    const registration = await factory.attrs('Registration');
    await createRegistration(token, registration);

    const response = await request(app)
      .get('/registrations')
      .set('Authorization', `Bearer ${token}`);
    expect(response.body[0]).toMatchObject(registration);
  });

  it('Should be able to delete', async () => {
    const token = await authenticate();

    const registration = await factory.attrs('Registration');
    let response = await createRegistration(token, registration);

    response = await request(app)
      .delete(`/registrations/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('Should not register without authentication', async () => {
    const registration = await factory.attrs('Registration');
    const response = await request(app)
      .post('/registrations')
      .send(registration);
    expect(response.status).toBe(401);
  });
});
