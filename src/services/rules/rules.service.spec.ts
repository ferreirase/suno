import { HttpException, HttpStatus } from '@nestjs/common';
import { RulesRepository } from '@repositories/rules/rules.repository';
import { Test, TestingModule } from '@nestjs/testing';
import TestUtil from '@shared/test/testUtil';
import { RulesService } from './rules.service';

describe('Rules Services', () => {
  let service: RulesService;

  const mockRepository = {
    getAllRules: jest.fn(),
    createRule: jest.fn(),
    deleteRule: jest.fn(),
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
    mockRepository.createRule.mockReset();
    mockRepository.deleteRule.mockReset();
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

  describe('When delete one rule by ID', () => {
    it('should delete successfully', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([rule]);

      service.deleteRule(rule.id);
      expect(mockRepository.deleteRule).toHaveBeenCalledTimes(1);
    });

    it('should throw error when not have rules', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue(null);

      try {
        service.deleteRule(rule.id);
        expect(mockRepository.deleteRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Not Rules here!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when not found a rule', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([rule]);

      const newRule = TestUtil.giveMeARuleWeekly();
      newRule.id = 'teste';

      try {
        service.deleteRule(newRule.id);
        expect(mockRepository.deleteRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Rule not found!');
        expect(error.status).toBe(404);
      }
    });
  });

  describe('When create a new Rule by Date', () => {
    it('should create successfully', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([]);

      service.createRuleByDate(rule);

      mockRepository.getAllRules.mockReturnValue([rule]);
      const rules = service.getAllRules();

      expect(rules).toBeInstanceOf(Array);
      expect(rules[0]).toMatchObject(rule);
      expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
    });

    it('should throw error when hour on intervals already exists', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Some hour on intervals already exists!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        service.createRuleByDate(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some hour on intervals already exists!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when hour on intervals is invalid', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      rule.intervals = [
        {
          start: 'teste',
          end: '19:00',
        },
      ];

      try {
        service.createRuleByDate(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some hour on intervals is invalid!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when date field be invalid', () => {
      const rule = TestUtil.giveMeARuleByDate();
      rule.date = '';
      mockRepository.getAllRules.mockReturnValue([]);
      mockRepository.createRule.mockReturnValue(
        new HttpException('Date invalid!', HttpStatus.BAD_REQUEST),
      );

      try {
        service.createRuleByDate(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Date invalid!');
        expect(error.status).toBe(400);
      }
    });
  });

  describe('When create a new Rule Daily', () => {
    it('should create successfully', () => {
      const rule = TestUtil.giveMeARuleDaily();
      mockRepository.getAllRules.mockReturnValue([]);

      service.createRuleDaily(rule);

      mockRepository.getAllRules.mockReturnValue([rule]);
      const rules = service.getAllRules();

      expect(rules).toBeInstanceOf(Array);
      expect(rules[0]).toMatchObject(rule);
      expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
    });

    it('should throw error when hour on intervals already exists', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Some hour on intervals already exists!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        service.createRuleDaily(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some hour on intervals already exists!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when hour on intervals is invalid', () => {
      const rule = TestUtil.giveMeARuleByDate();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      rule.intervals = [
        {
          start: 'teste',
          end: '19:00',
        },
      ];

      try {
        service.createRuleDaily(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some hour on intervals is invalid!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when date field be invalid', () => {
      const rule = TestUtil.giveMeARuleByDate();
      rule.date = '';
      mockRepository.getAllRules.mockReturnValue([]);
      mockRepository.createRule.mockReturnValue(
        new HttpException('Date invalid!', HttpStatus.BAD_REQUEST),
      );

      try {
        service.createRuleByDate(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Date invalid!');
        expect(error.status).toBe(400);
      }
    });
  });

  describe('When create a new Rule Weekly', () => {
    it('should create successfully', () => {
      const rule = TestUtil.giveMeARuleWeekly();
      mockRepository.getAllRules.mockReturnValue([]);

      service.createRuleWeekly(rule);

      mockRepository.getAllRules.mockReturnValue([rule]);
      const rules = service.getAllRules();

      expect(rules).toBeInstanceOf(Array);
      expect(rules[0]).toMatchObject(rule);
      expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
    });

    it('should throw error when one day on days array is invalid', () => {
      const rule = TestUtil.giveMeARuleWeekly();
      rule.days = ['TESTE'];
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Day invalid on array of days!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        service.createRuleWeekly(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Day invalid on array of days!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when days array length is > 4', () => {
      const rule = TestUtil.giveMeARuleWeekly();
      rule.days.push('TUE', 'WED', 'THU');
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Use the /daily route to register everyday!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        service.createRuleWeekly(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(
          'Use the /daily route to register everyday!',
        );
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when hour on intervals is invalid', () => {
      const rule = TestUtil.giveMeARuleWeekly();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Some hour on intervals is invalid!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      rule.intervals = [
        {
          start: 'teste',
          end: '19:00',
        },
      ];

      try {
        service.createRuleWeekly(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some hour on intervals is invalid!');
        expect(error.status).toBe(400);
      }
    });

    it('should throw error when days/hours relation already exists', () => {
      const rule = TestUtil.giveMeARuleWeekly();
      mockRepository.getAllRules.mockReturnValue([rule]);
      mockRepository.createRule.mockReturnValue(
        new HttpException(
          'Some day/hour relation already exists!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      try {
        service.createRuleWeekly(rule);
        expect(mockRepository.createRule).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Some day/hour relation already exists!');
        expect(error.status).toBe(400);
      }
    });
  });
});
