import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const { title } = req.body;

    const planExists = await Plan.findOne({ where: { title } });
    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    let plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({ error: `Plan not found: ${id}.` });
    }

    if (title !== plan.title) {
      const planExists = await Plan.findOne({ where: { title } });
      if (planExists) {
        return res.status(400).json({ error: 'Plan already exists.' });
      }
    }

    plan = await plan.update(req.body);

    return res.json(plan);
  }

  async list(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.status(400).json({ error: `Plan not found: ${id}.` });
    }

    await plan.destroy();

    return res.json({ status: 'Success' });
  }
}

export default new PlanController();
