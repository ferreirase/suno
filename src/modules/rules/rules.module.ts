import { Module } from '@nestjs/common';
import { RulesController } from '@controllers/rules/rules.controller';
import { RulesService } from '@services/rules/rules.service';
import { RulesRepository } from '@repositories/rules/rules.repository';

@Module({
  imports: [],
  controllers: [RulesController],
  providers: [
    RulesService,
    {
      provide: RulesRepository,
      useClass: RulesRepository,
    },
  ],
  exports: [RulesService],
})
export class RulesModule {}
