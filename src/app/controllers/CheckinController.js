import { Op } from 'sequelize';
import { format, subDays } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    const { id: student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required.' });
    }

    // TODO - Check if student exists

    const weekcount = await Checkin.count({
      where: {
        student_id,
        created_at: {
          [Op.gte]: subDays(new Date(), 7),
          // `${format(
          //   subDays(new Date(), 7),
          //   "yyyy-MM-dd'T'HH:mm:ss.SSS"
          // )}Z`,
        },
      },
    });
    // console.log('COUNT', weekcount);
    if (weekcount >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only chekin 5 times per week' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }

  async list(req, res) {
    const { id: student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID required.' });
    }

    // TODO - Check if student exists

    const checkins = await Checkin.findAll({ where: { student_id } });

    return res.json(checkins);
  }
}

export default new CheckinController();
