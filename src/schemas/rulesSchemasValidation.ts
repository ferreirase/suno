import Joi from 'joi';

export const CreateRuleByDateSchema = Joi.object({
  date: Joi.string().required(),
  intervals: Joi.array()
    .items(
      Joi.object({
        start: Joi.string().required(),
        end: Joi.string().required(),
      }).required(),
    )
    .required(),
}).required();
