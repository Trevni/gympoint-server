import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const { name } = req.body;

    const userExists = await Student.findOne({ where: { name } });
    if (userExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    const { name } = req.body;

    let student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: `Student not found: ${id}.` });
    }

    if (name !== student.name) {
      const studentExists = await Student.findOne({ where: { name } });
      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    student = await student.update(req.body);

    return res.json(student);
  }

  async list(req, res) {
    const { q } = req.query;

    console.log(q);
    const students = q
      ? await Student.findAll({ where: { name: { [Op.like]: `%${q}%` } } })
      : await Student.findAll();

    return res.json(students);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: `Student not found: ${id}.` });
    }

    await student.destroy();

    return res.json({ status: 'Success' });
  }
}

export default new StudentController();
