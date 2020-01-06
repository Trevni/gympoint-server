import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async helpOrder => {
      if (helpOrder.answer !== this.answer) {
        helpOrder.answer_at = new Date();
      }
    });

    return this;
  }
}

export default HelpOrder;
