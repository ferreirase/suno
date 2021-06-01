import { RuleByDate, TypeRuleEnum, RuleWeekly } from '@models/rules';
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

  static giveMeARuleWeekly(): RuleWeekly {
    const rule = new RuleWeekly();
    (rule.days = ['MON', 'FRI']),
      (rule.intervals = [
        {
          start: '10:00',
          end: '11:00',
        },
      ]),
      (rule.id = v4()),
      (rule.type = TypeRuleEnum['WK']);

    return rule;
  }
}
