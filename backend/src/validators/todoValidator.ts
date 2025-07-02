import Joi from 'joi'

export const createTodoSchema = Joi.object({
  title: Joi.string().required().min(1).max(255).trim(),
  description: Joi.string().optional().max(1000).trim(),
  priority: Joi.string().valid('low', 'medium', 'high').required(),
  dueDate: Joi.date().optional().iso(),
  categoryId: Joi.string().optional().uuid(),
})

export const updateTodoSchema = Joi.object({
  title: Joi.string().optional().min(1).max(255).trim(),
  description: Joi.string().optional().max(1000).trim().allow('', null),
  completed: Joi.boolean().optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().optional().iso().allow(null),
  categoryId: Joi.string().optional().uuid().allow(null),
}).options({ stripUnknown: true })

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      })
    }
    next()
  }
}
