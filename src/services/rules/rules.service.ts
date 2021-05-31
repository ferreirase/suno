import {
  forwardRef,
  Inject,
  Injectable,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RuleByDate } from '@models/rules';
import { RulesRepository } from '@repositories/rules/rules.repository';
import { isValid } from 'date-fns';

@Injectable()
export class RulesService {
  constructor(
    @Inject(forwardRef(() => RulesRepository))
    private rulesRepo: RulesRepository,
  ) {}

  getAllRules(): Array<any> {
    const result = this.rulesRepo.getAllRules();
    return result;
  }

  createRuleByDate(rule: RuleByDate): any {
    const dateArray = rule.date.split('-');
    const rules: Array<RuleByDate> = this.getAllRules();
    const rulesByDate = rules.filter(
      (existentRule) => existentRule.date === rule.date,
    );

    if (rulesByDate) {
      for (let index = 0; index < rule.intervals.length; index++) {
        rulesByDate.map((rl) => {
          rl.intervals.map((interval) => {
            if (interval.start === rule.intervals[index].start) {
              throw new HttpException(
                'Some hour on intervals is invalid!',
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

    this.rulesRepo.createRuleByDate(rule);
  }
}
