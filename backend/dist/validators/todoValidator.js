"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.updateTodoSchema = exports.createTodoSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createTodoSchema = joi_1.default.object({
    title: joi_1.default.string().required().min(1).max(255).trim(),
    description: joi_1.default.string().optional().max(1000).trim(),
    priority: joi_1.default.string().valid('low', 'medium', 'high').required(),
    dueDate: joi_1.default.date().optional().iso(),
    categoryId: joi_1.default.string().optional().uuid(),
});
exports.updateTodoSchema = joi_1.default.object({
    title: joi_1.default.string().optional().min(1).max(255).trim(),
    description: joi_1.default.string().optional().max(1000).trim().allow('', null),
    completed: joi_1.default.boolean().optional(),
    priority: joi_1.default.string().valid('low', 'medium', 'high').optional(),
    dueDate: joi_1.default.date().optional().iso().allow(null),
    categoryId: joi_1.default.string().optional().uuid().allow(null),
}).options({ stripUnknown: true });
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message,
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=todoValidator.js.map