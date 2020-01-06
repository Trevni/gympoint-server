import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import { cleanModel, authenticate } from '../util';

import HelpOrder from '../../src/app/models/HelpOrder';

async function createOrder(helpOrder) {
  const response = await request(app)
    .post(`/students/${helpOrder.student_id}/help-orders`)
    .send(helpOrder);
  expect(response.body).toHaveProperty('id');

  return response;
}

async function answerOrder(token, id, helpOrderAnswer) {
  const response = await request(app)
    .post(`/help-orders/${id}/answer`)
    .set('Authorization', `Bearer ${token}`)
    .send(helpOrderAnswer);
  expect(response.body).toMatchObject(helpOrderAnswer);
  expect(response.body).toHaveProperty('answer_at');
}

describe('HelpOrder', () => {
  beforeEach(() => cleanModel(HelpOrder));

  /**
   * O aluno pode criar pedidos de auxílio para a academia em relação a algum exercício, alimentação ou instrução qualquer;
   *
   * A tabela help_orders deve conter os seguintes campos:
   * - student_id (referência ao aluno);
   * - question (pergunta do aluno em texto);
   * - answer (resposta da academia em texto);
   * - answer_at (data da resposta da academia);
   * - created_at;
   * - updated_at;
   *
   * Crie uma rota para a academia listar todos pedidos de auxílio sem resposta;
   *
   * Crie uma rota para o aluno cadastrar pedidos de auxílio apenas informando seu ID de cadastro (ID do banco de dados);
   * Exemplo de requisição: POST https://gympoint.com/students/3/help-orders
   *
   * Crie uma rota para listar todos pedidos de auxílio de um usuário com base em seu ID de cadastro;
   * Exemplo de requisição: GET https://gympoint.com/students/3/help-orders
   *
   * Crie uma rota para a academia responder um pedido de auxílio:
   * Exemplo de requisição: POST https://gympoint.com/help-orders/1/answer
   *
   * Quando um pedido de auxílio for respondido, o aluno deve receber um e-mail da plataforma com a pergunta e resposta da academia;
   *
   */

  it('should be able to register for student', async () => {
    const helpOrder = await factory.attrs('HelpOrder');
    await createOrder(helpOrder);
  });

  it('should be able to list for student', async () => {
    const helpOrder = await factory.attrs('HelpOrder');
    await createOrder(helpOrder);

    const response = await request(app).get(
      `/students/${helpOrder.student_id}/help-orders`
    );
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(helpOrder);
  });

  it('should be able to answer', async () => {
    const helpOrder = await factory.attrs('HelpOrder');
    const response = await createOrder(helpOrder);

    const token = await authenticate();

    const answer = await factory.attrs('HelpOrderAnswer');
    await answerOrder(token, response.body.id, helpOrder, answer);
  });

  it('should be able to list unanswered help orders', async () => {
    const helpOrder1 = await factory.attrs('HelpOrder');
    const helpOrder2 = await factory.attrs('HelpOrder');
    let response = await createOrder(helpOrder1);
    await createOrder(helpOrder2);

    const token = await authenticate();

    const answer = await factory.attrs('HelpOrderAnswer', helpOrder1);
    await answerOrder(token, response.body.id, answer);

    response = await request(app)
      .get('/help-orders')
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(helpOrder2);
  });
});
