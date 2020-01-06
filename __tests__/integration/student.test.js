import request from 'supertest';
import app from '../../src/app';

import factory from '../factories';
import { cleanModel, authenticate } from '../util';

import Student from '../../src/app/models/Student';

async function createStudent(token, student) {
  const response = await request(app)
    .post('/students')
    .set('Authorization', `Bearer ${token}`)
    .send(student);
  expect(response.body).toHaveProperty('id');
  return response;
}

describe('Student', () => {
  beforeEach(() => cleanModel(Student));

  /**
   * TODO - incluir restante dos requisitos
   * TODO - mudar para /users
   *
   * Permita que alunos sejam mantidos (cadastrados/atualizados) na aplicação utilizando nome, email, idade, peso e altura.
   * Utilize uma nova tabela no banco de dados chamada students.
   * O cadastro de alunos só pode ser feito por administradores autenticados na aplicação.
   * O aluno não pode se autenticar no sistema, ou seja, não possui senha.
   */

  it('should be able to register', async () => {
    const token = await authenticate();

    const student = await factory.attrs('Student');
    await createStudent(token, student);
  });

  it('should be able to update', async () => {
    const token = await authenticate();

    const student = await factory.attrs('Student');
    let response = await createStudent(token, student);

    student.name = 'Geraldson';
    response = await request(app)
      .put(`/students/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(student);
    expect(response.body).toMatchObject(student);
  });

  it('should be able to list', async () => {
    const token = await authenticate();

    const student = await factory.attrs('Student');
    await createStudent(token, student);

    const response = await request(app)
      .get('/students')
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(student);
  });

  it('should be able to list with filter', async () => {
    const token = await authenticate();

    const student1 = await factory.attrs('Student');
    const student2 = await factory.attrs('Student', { name: 'DiegoSilva' });
    await createStudent(token, student1);
    await createStudent(token, student2);

    const response = await request(app)
      .get(`/students`, { name: 'DiegoSil' })
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject(student2);
  });

  it('should be able to delete', async () => {
    const token = await authenticate();

    const student = await factory.attrs('Student');
    let response = await createStudent(token, student);

    response = await request(app)
      .delete(`/students/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('should not be able to register if not logged in', async () => {
    const student = await factory.attrs('Student');
    const response = await request(app)
      .post('/students')
      .send(student);
    expect(response.status).toBe(401);
  });
});
