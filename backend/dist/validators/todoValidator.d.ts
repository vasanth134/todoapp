import Joi from 'joi';
export declare const createTodoSchema: Joi.ObjectSchema<any>;
export declare const updateTodoSchema: Joi.ObjectSchema<any>;
export declare const validateRequest: (schema: Joi.ObjectSchema) => (req: any, res: any, next: any) => any;
//# sourceMappingURL=todoValidator.d.ts.map