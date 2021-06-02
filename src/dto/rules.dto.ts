import { IsString, IsArray, IsNotEmpty } from 'class-validator';
import IntervalsInterface from '../interfaces/intervals.interface';
import { DaysOfWeekEnum } from '@models/rules';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRuleByDateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  date: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  intervals: Array<IntervalsInterface>;
}

export class CreateRuleDailyDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  intervals: Array<IntervalsInterface>;
}

export class CreateRuleWeeklyDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  intervals: Array<IntervalsInterface>;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  days: Array<DaysOfWeekEnum | string>;
}

export class GetRuleAvailableDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  since: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  until: string;
}
