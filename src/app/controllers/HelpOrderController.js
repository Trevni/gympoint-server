import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const { id: student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required.' });
    }

    // TODO - validate student existance

    const helpOrder = await HelpOrder.create({ ...req.body, student_id });

    return res.json(helpOrder);
  }

  async list(req, res) {
    const { id: student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required.' });
    }

    // TODO - validate student existance

    const helpOrders = await HelpOrder.findAll({ where: { student_id } });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
