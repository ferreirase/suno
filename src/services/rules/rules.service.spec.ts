import { HttpException, HttpStatus } from '@nestjs/common';
import { RulesRepository } from '@repositories/rules/rules.repository';
import { Test, TestingModule } from '@nestjs/testing';
import TestUtil from '@shared/test/testUtil';
import { RulesService } from './rules.service';

describe('Rules Services', () => {
  let service: RulesService;

  const mockRepository = {
    getAllRules: jest.fn(),
    createRuleByDate: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RulesService,
        {
          provide: RulesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RulesService>(RulesService);
  });

  beforeEach(() => {
    mockRepository.getAllRules.mockReset();
    mockRepository.createRuleByDate.mockReset();
  });

  describe('When search all Rules', () => {
    it('should return an array of rules or []', () => {
      mockRepository.getAllRules.mockReturnValue([]);
      const rules = service.getAllRules();

      expect(rules).toBeInstanceOf(Array);
      expect(rules).toMatchObject([]);
      expect(mockRepository.getAllRules).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create a new Rule by Date', () => {
    it('should create successfully', () => {
      const rule = TestUtil.giveMeAValidRule();
      mockRepository.getAllRules.mockReturnValue([]);

      service.createRuleByDate(rule);

      mockRepository.getAllRules.mockReturnValue([rule]);
      const rules = service.getAllRules();

      expect(rules).toBeInstanceOf(Array);
      expect(rules[0]).toMatchObject(rule);
      expect(mockRepository.createRuleByDate).toHaveBeenCalledTimes(1);
    });

    it('should throw error when hour on intervals is invalid', () => {
      const rule = TestUtil.giveMeAValidRule();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRuleByDate.mockReturnValue(
        new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        service.createRuleByDate(rule);
        expect(mockRepository.createRuleByDate).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some hour on intervals is invalid!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when date field be invalid', () => {
      const rule = TestUtil.giveMeAValidRule();
      rule.date = '';
      mockRepository.getAllRules.mockReturnValue([]);
      mockRepository.createRuleByDate.mockReturnValue(
        new HttpException('Date invalid!', HttpStatus.BAD_REQUEST),
      );

      try {
        service.createRuleByDate(rule);
        expect(mockRepository.createRuleByDate).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Date invalid!');
        expect(error.status).toBe(400);
      }
    });
  });
});
