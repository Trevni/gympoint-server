import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';

class AnswerController {
  async store(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID required.' });
    }

    let helpOrder = await HelpOrder.findByPk(id);
    if (!helpOrder) {
      return res.status(400).json({ error: `HelpOrder not found: ${id}.` });
    }

    helpOrder = await helpOrder.update(req.body);

    return res.json(helpOrder);
  }

  async list(req, res) {
    const unansweredOrders = await HelpOrder.findAll({
      where: { answer_at: { [Op.ne]: null } },
    });

    return res.json(unansweredOrders);
  }
}

export default new AnswerController();
