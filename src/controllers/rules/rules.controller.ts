import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UsePipes,
  Param,
} from '@nestjs/common';
import { RulesService } from '@services/rules/rules.service';
import { RuleByDate, TypeRuleEnum, RuleWeekly } from '@models/rules';
import {
  CreateRuleByDateDto,
  CreateRuleDailyDto,
  CreateRuleWeeklyDto,
} from '@dto/rules.dto';
import { JoiValidationPipe } from '@shared/validations/validation.pipe';
import {
  CreateRuleByDateSchema,
  CreateRuleDailySchema,
  CreateRuleWeeklySchema,
} from '../../schemas/rulesSchemasValidation';
import { v4 } from 'uuid';

@Controller()
export class RulesController {
  constructor(private readonly ruleService: RulesService) {}

  @Get('/rules')
  getAllRules(): Array<any> {
    return this.ruleService.getAllRules();
  }

  @Delete('/rules/:id')
  deleteRule(@Param('id') id: string): void {
    return this.ruleService.deleteRule(id);
  }

  @Post('/rules/byDate')
  @UsePipes(new JoiValidationPipe(CreateRuleByDateSchema))
  createRuleByDate(@Body() createDto: CreateRuleByDateDto): void {
    const newRule: RuleByDate = new RuleByDate();

    newRule.id = v4();
    newRule.intervals = [
      ...new Map(
        createDto.intervals.map((item) => [item['start'], item]),
      ).values(),
    ];
    newRule.type = TypeRuleEnum['BD'];
    newRule.date = createDto.date;

    return this.ruleService.createRuleByDate(newRule);
  }

  @Post('/rules/daily')
  @UsePipes(new JoiValidationPipe(CreateRuleDailySchema))
  createRuleDaily(@Body() createDto: CreateRuleDailyDto): void {
    const newRule: RuleByDate = new RuleByDate();

    newRule.id = v4();
    newRule.intervals = [
      ...new Map(
        createDto.intervals.map((item) => [item['start'], item]),
      ).values(),
    ];
    newRule.type = TypeRuleEnum['DL'];

    return this.ruleService.createRuleDaily(newRule);
  }

  @Post('/rules/weekly')
  @UsePipes(new JoiValidationPipe(CreateRuleWeeklySchema))
  createRuleWeekly(@Body() createDto: CreateRuleWeeklyDto): void {
    const newRule: RuleWeekly = new RuleWeekly();

    newRule.id = v4();
    newRule.type = TypeRuleEnum.WK;

    newRule.intervals = [
      ...new Map(
        createDto.intervals.map((item) => [item['start'], item]),
      ).values(),
    ];
    newRule.days = [
      ...new Map(createDto.days.map((item) => [item[0], item])).values(),
    ];

    return this.ruleService.createRuleWeekly(newRule);
  }
}
