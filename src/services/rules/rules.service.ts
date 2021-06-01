import {
  forwardRef,
  Inject,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  Rule,
  RuleByDate,
  RuleDaily,
  RuleWeekly,
  DaysOfWeekEnum,
} from '@models/rules';
import { RulesRepository } from '@repositories/rules/rules.repository';
import { isValid } from 'date-fns';

@Injectable()
export class RulesService {
  constructor(
    @Inject(forwardRef(() => RulesRepository))
    private rulesRepo: RulesRepository,
  ) {}

  getAllRules(): Array<any> {
    const rules = this.rulesRepo.getAllRules();
    return rules;
  }

  deleteRule(id: string): void {
    const result = this.rulesRepo.getAllRules();

    if (!result || !result.length) {
      throw new HttpException('Not Rules here!', HttpStatus.BAD_REQUEST);
    }

    const ruleExists = result.filter((rule) => rule.id === id);

    if (!ruleExists || !ruleExists.length)
      throw new HttpException('Rule not found!', HttpStatus.NOT_FOUND);

    const rulesFiltered = result.filter((rule) => rule.id !== id);

    return this.rulesRepo.deleteRule(rulesFiltered);
  }

  createRuleByDate(rule: RuleByDate): any {
    const dateArray = rule.date.split('-');
    const rules: Array<RuleByDate> = this.getAllRules();
    const rulesByDate = rules.filter(
      (existentRule) => existentRule.date === rule.date,
    );

    rule.intervals.map((interval) => {
      const partOfTimeStart = interval.start.split(':');
      const partOfTimeEnd = interval.end.split(':');

      if (
        isNaN(Number(partOfTimeStart[0])) ||
        isNaN(Number(partOfTimeEnd[0]))
      ) {
        throw new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    if (rulesByDate) {
      for (let index = 0; index < rule.intervals.length; index++) {
        rulesByDate.map((rl) => {
          rl.intervals.map((interval) => {
            if (interval.start === rule.intervals[index].start) {
              throw new HttpException(
                'Some hour on intervals already exists!',
                HttpStatus.BAD_REQUEST,
              );
            }
          });
        });
      }
    }

    if (
      !isValid(
        new Date(
          Number(dateArray[2]),
          Number(dateArray[1]),
          Number(dateArray[0]),
        ),
      )
    ) {
      throw new HttpException('Date invalid!', HttpStatus.BAD_REQUEST);
    }

    this.rulesRepo.createRule(rule);
  }

  createRuleDaily(rule: RuleDaily): any {
    const rules: Array<Rule> = this.getAllRules();
    const rulesDaily = rules.filter(
      (existentRule) => existentRule.type === rule.type,
    );

    rule.intervals.map((interval) => {
      const partOfTimeStart = interval.start.split(':');
      const partOfTimeEnd = interval.end.split(':');

      if (
        isNaN(Number(partOfTimeStart[0])) ||
        isNaN(Number(partOfTimeEnd[0]))
      ) {
        throw new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    if (rulesDaily) {
      for (let index = 0; index < rule.intervals.length; index++) {
        rulesDaily.map((rl) => {
          rl.intervals.map((interval) => {
            if (interval.start === rule.intervals[index].start) {
              throw new HttpException(
                'Some hour on intervals already exists!',
                HttpStatus.BAD_REQUEST,
              );
            }
          });
        });
      }
    }

    this.rulesRepo.createRule(rule);
  }

  createRuleWeekly(rule: RuleWeekly): any {
    const rules: Array<RuleWeekly> = this.getAllRules();
    const rulesWeekly = rules.filter(
      (existentRule) => existentRule.type === rule.type,
    );

    rule.days.map((day) => {
      if (!DaysOfWeekEnum[`${day}`])
        throw new HttpException(
          'Day invalid on array of days!',
          HttpStatus.BAD_REQUEST,
        );
    });

    if (rule.days.length > 4)
      throw new HttpException(
        'Use the /daily route to register everyday!',
        HttpStatus.BAD_REQUEST,
      );

    rule.intervals.map((interval) => {
      const partOfTimeStart = interval.start.split(':');
      const partOfTimeEnd = interval.end.split(':');

      if (isNaN(Number(partOfTimeStart[0])) || isNaN(Number(partOfTimeEnd[0])))
        throw new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        );
    });

    if (rulesWeekly)
      for (let index = 0; index < rule.intervals.length; index++) {
        rulesWeekly.map((rl) => {
          rl.intervals.map((interval) => {
            rl.days.map((day) => {
              if (
                rule.days.includes(day) &&
                interval.start === rule.intervals[index].start
              )
                throw new HttpException(
                  'Some day/hour relation already exists!',
                  HttpStatus.BAD_REQUEST,
                );
            });
          });
        });
      }

    this.rulesRepo.createRule(rule);
  }
}
