import { Module } from '@nestjs/common';
import { RulesModule } from '@modules/rules/rules.module';

@Module({
  imports: [RulesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
