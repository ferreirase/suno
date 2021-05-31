import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { RulesService } from '@services/rules/rules.service';
import { RuleByDate, TypeRuleEnum } from '@models/rules';
import { CreateRuleByDateDto } from '@dto/rules.dto';
import { JoiValidationPipe } from '@shared/validations/validation.pipe';
import { CreateRuleByDateSchema } from '../../schemas/rulesSchemasValidation';
import { v4 } from 'uuid';

@Controller()
export class RulesController {
  constructor(private readonly ruleService: RulesService) {}

  @Get('/rules')
  getAllRules(): Array<any> {
    return this.ruleService.getAllRules();
  }

  @Post('/rules')
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
}
