import { Test, TestingModule } from '@nestjs/testing';
import { RulesController } from './rules.controller';
import { RulesService } from '@services/rules/rules.service';
import { RulesRepository } from '@repositories/rules/rules.repository';
import TestUtil from '@shared/test/testUtil';

describe('AppController', () => {
  let controller: RulesController;
  let service: RulesService;

  const mockService = {
    getAllRules: jest.fn(),
    createRuleByDate: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RulesController],
      providers: [
        RulesService,
        {
          provide: RulesRepository,
          useClass: RulesRepository,
        },
      ],
    }).compile();

    controller = app.get<RulesController>(RulesController);
    service = app.get<RulesService>(RulesService);
  });

  beforeEach(() => {
    mockService.getAllRules.mockReset();
    mockService.createRuleByDate.mockReset();
  });

  describe('When search all Rules', () => {
    it('should return an array of rules or []', () => {
      mockService.getAllRules.mockReturnValue([TestUtil.giveMeAValidRule()]);
      const rules = service.getAllRules();
      jest.spyOn(service, 'getAllRules').mockImplementation(() => rules);

      expect(controller.getAllRules()).toBeInstanceOf(Array);
      expect(controller.getAllRules()).toBe(rules);
    });
  });

  describe('When create Rule by date', () => {
    it('should be successfull', () => {
      const newRule = TestUtil.giveMeAValidRule();
      mockService.createRuleByDate.mockReturnValue([]);

      jest.spyOn(service, 'createRuleByDate').mockImplementation(() => newRule);

      controller.createRuleByDate(newRule);
      mockService.getAllRules.mockReturnValue([newRule]);
      const rules = mockService.getAllRules();

      expect(rules[0]).toMatchObject(newRule);
      expect(controller.getAllRules()).toBeInstanceOf(Array);
    });
  });
});
