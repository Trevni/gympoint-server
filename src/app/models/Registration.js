import Sequelize, { Model } from 'sequelize';
import { isBefore, isAfter } from 'date-fns';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
        active: {
          type: Sequelize.VIRTUAL(Sequelize.BOOLEAN, [
            'start_date',
            'end_date',
          ]),
          get() {
            return (
              isAfter(new Date(), this.get('start_date')) &&
              isBefore(new Date(), this.get('end_date'))
            );
          },
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async registration => {
      registration.end_date = registration.start_date;
      registration.price = 19.99;
    });

    return this;
  }
}

export default Registration;
