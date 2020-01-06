import Registration from '../models/Registration';

class RegistrationController {
  async store(req, res) {
    const registration = await Registration.create(req.body);

    return res.json(registration);
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    let registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(400).json({ error: `Registration not found: ${id}.` });
    }

    registration = await registration.update(req.body);

    return res.json(registration);
  }

  async list(req, res) {
    const registration = await Registration.findAll();

    return res.json(registration);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    const registration = await Registration.findByPk(id);
    if (!registration) {
      return res.status(400).json({ error: `Registration not found: ${id}.` });
    }

    await registration.destroy();

    return res.json({ status: 'Success' });
  }
}

export default new RegistrationController();
