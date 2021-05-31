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
});
