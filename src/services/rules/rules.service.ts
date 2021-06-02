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
  TypeRuleEnum,
} from '@models/rules';
import { RulesRepository } from '@repositories/rules/rules.repository';
import { isValid, eachDayOfInterval, isBefore } from 'date-fns';

interface IReturnArrayAvailable {
  start: string;
  end: string;
}

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

  getAvailableHoursBySince(since: string): Array<Object> {
    const dateArraySince = JSON.parse(since).split('-');

    const newDateSince = new Date(
      Number(dateArraySince[2]),
      Number(dateArraySince[1]) - 1,
      Number(dateArraySince[0]),
    );

    if (!isValid(newDateSince)) {
      throw new HttpException('Date is invalid!', HttpStatus.BAD_REQUEST);
    }

    const rules = this.rulesRepo.getAllRules();

    if (!rules || !rules.length) {
      throw new HttpException('Not Rules here!', HttpStatus.BAD_REQUEST);
    }

    const rulesByDate = rules.filter(
      (rule: RuleByDate) =>
        rule.type === TypeRuleEnum.BD && rule.date === JSON.parse(since),
    );

    const rulesDaily = rules.filter(
      (rule: RuleDaily) => rule.type === TypeRuleEnum.DL,
    );

    const rulesWeekly: Array<any> = rules
      .filter((rule: RuleWeekly) => rule.type === TypeRuleEnum.WK)
      .filter((rule: RuleWeekly) =>
        rule.days.includes(
          newDateSince
            .toLocaleString('en-US', { weekday: 'long' })
            .toLowerCase(),
        ),
      );

    const intervals: Array<IReturnArrayAvailable> = [];

    if (rulesDaily)
      rulesDaily.map((rule: RuleDaily) => intervals.push(...rule.intervals));

    if (rulesByDate)
      rulesByDate.map((rule: RuleByDate) => intervals.push(...rule.intervals));

    if (rulesWeekly)
      rulesWeekly.map((rule: RuleWeekly) => intervals.push(...rule.intervals));

    return [
      {
        date: JSON.parse(since),
        intervals: [
          ...new Map(intervals.map((item) => [item.start, item])).values(),
        ],
      },
    ];
  }

  getAvailableHours(since: string, until?: string): Array<Object> {
    if (!until) return this.getAvailableHoursBySince(since);

    const dateArraySince = JSON.parse(since).split('-');
    const dateArrayUntil = JSON.parse(until).split('-');

    const newDateSince = new Date(
      Number(dateArraySince[2]),
      Number(dateArraySince[1]) - 1,
      Number(dateArraySince[0]),
    );

    const newDateUntil = new Date(
      Number(dateArrayUntil[2]),
      Number(dateArrayUntil[1]) - 1,
      Number(dateArrayUntil[0]),
    );

    if (!isValid(newDateUntil) || !isValid(newDateSince)) {
      throw new HttpException('Date is invalid!', HttpStatus.BAD_REQUEST);
    }

    if (isBefore(newDateUntil, newDateSince)) {
      throw new HttpException(
        'Until date must be after than Since date!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const everyDays = eachDayOfInterval({
      start: newDateSince,
      end: newDateUntil,
    });

    const datesRange = [];

    everyDays.map((day) =>
      datesRange.push(
        `${day.getUTCDate() < 10 ? `0${day.getUTCDate()}` : day.getUTCDate()}-${
          day.getUTCMonth() + 1 < 10
            ? `0${day.getUTCMonth() + 1}`
            : day.getUTCMonth() + 1
        }-${
          day.getUTCFullYear() < 10
            ? `0${day.getUTCFullYear()}`
            : day.getUTCFullYear()
        }`,
      ),
    );

    const result: Array<Object> = [];

    datesRange.map((date) =>
      result.push(...this.getAvailableHours(JSON.stringify(date))),
    );

    return result;
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
              rule.days.map((ruleDay) => {
                if (day === DaysOfWeekEnum[`${ruleDay}`])
                  if (interval.start === rule.intervals[index].start)
                    throw new HttpException(
                      'Some day/hour relation already exists!',
                      HttpStatus.BAD_REQUEST,
                    );
              });
            });
          });
        });
      }

    rule.days = rule.days.map((day) => DaysOfWeekEnum[`${day}`]);

    this.rulesRepo.createRule(rule);
  }
}
