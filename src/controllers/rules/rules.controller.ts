import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UsePipes,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RulesService } from '@services/rules/rules.service';
import { RuleByDate, TypeRuleEnum, RuleWeekly, RuleDaily } from '@models/rules';
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
import { Request } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('rules')
@Controller()
export class RulesController {
  constructor(private readonly ruleService: RulesService) {}

  @Get('/rules')
  getAllRules(): Array<any> {
    return this.ruleService.getAllRules();
  }

  @Get('/rules/available')
  getAvailableHours(@Req() { query }: Request): Array<Object> {
    if (query.since === undefined)
      throw new HttpException(
        'Insert since query param',
        HttpStatus.BAD_REQUEST,
      );

    if (Object.keys(query.since).length === 0)
      throw new HttpException(
        'Insert since query param',
        HttpStatus.BAD_REQUEST,
      );

    return this.ruleService.getAvailableHours(
      JSON.stringify(query.since),
      JSON.stringify(query.until),
    );
  }

  @Delete('/rules/:id')
  deleteRule(@Param('id') id: string): void {
    return this.ruleService.deleteRule(id);
  }

  @ApiResponse({ type: RuleByDate })
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

  @ApiResponse({ type: RuleDaily })
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

  @ApiResponse({ type: RuleWeekly })
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
