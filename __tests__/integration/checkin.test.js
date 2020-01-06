import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';
import { cleanModel } from '../util';

import Checkin from '../../src/app/models/Checkin';

async function createCheckin(checkin) {
  const response = await request(app).post(
    `/students/${checkin.student_id}/checkins`
  );
  expect(response.body).toHaveProperty('id');
  return response;
}

describe('Checkin', () => {
  beforeEach(() => cleanModel(Checkin));

  /**
   * Quando o aluno chega na academia o mesmo realiza um check-in apenas informando seu ID de cadastro (ID do banco de dados);
   * Esse check-in serve para monitorar quantas vezes o usuário frequentou a academia na semana.
   *
   * A tabela de checkins possui os campos:
   * - student_id (referência ao aluno);
   * - created_at;
   * - updated_at;
   *
   * O usuário só pode fazer 5 checkins dentro de um período de 7 dias corridos.
   * Exemplo de requisição: POST https://gympoint.com/students/3/checkins
   *
   * Crie uma rota para listagem de todos checkins realizados por um usuário com base em seu ID de cadastro;
   * Exemplo de requisição: GET https://gympoint.com/students/3/checkins
   */

  it('should be able to register', async () => {
    const checkin = await factory.attrs('Checkin');
    await createCheckin(checkin);
  });

  it('should be able to list', async () => {
    // TODO Mock User

    const checkin = await factory.attrs('Checkin');

    await createCheckin(checkin);
    await createCheckin(checkin);
    await createCheckin(checkin);
    await createCheckin(checkin);
    await createCheckin(checkin);

    const response = await request(app).get(
      `/students/${checkin.student_id}/checkins`
    );
    expect(response.body).toHaveLength(5);
  });

  it('should not register more than 5 times in 7 days', async () => {
    const checkin = await factory.attrs('Checkin');

    await createCheckin(checkin);
    await createCheckin(checkin);
    await createCheckin(checkin);
    await createCheckin(checkin);
    await createCheckin(checkin);

    const response = await request(app).post(
      `/students/${checkin.student_id}/checkins`
    );
    expect(response.status).toBe(400);
  });
});
