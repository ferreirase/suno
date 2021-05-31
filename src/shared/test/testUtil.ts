import { RuleByDate, TypeRuleEnum } from '@models/rules';
import { v4 } from 'uuid';

export default class TestUtil {
  static giveMeARuleByDate(): RuleByDate {
    const rule = new RuleByDate();
    (rule.date = '25-01-2021'),
      (rule.intervals = [
        {
          start: '10:00',
          end: '11:00',
        },
      ]),
      (rule.id = v4()),
      (rule.type = TypeRuleEnum['BD']);

    return rule;
  }

  static giveMeARuleDaily(): RuleByDate {
    const rule = new RuleByDate();
    (rule.intervals = [
      {
        start: '10:00',
        end: '11:00',
      },
    ]),
      (rule.id = v4()),
      (rule.type = TypeRuleEnum['DL']);

    return rule;
  }
}
