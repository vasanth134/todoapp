"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todoController_1 = require("../controllers/todoController");
const todoValidator_1 = require("../validators/todoValidator");
const router = express_1.default.Router();
// Get dashboard stats
router.get('/stats', todoController_1.getDashboardStats);
// Get all todos
router.get('/', todoController_1.getAllTodos);
// Get todo by ID
router.get('/:id', todoController_1.getTodoById);
// Create new todo
router.post('/', (0, todoValidator_1.validateRequest)(todoValidator_1.createTodoSchema), todoController_1.createTodo);
// Update todo
router.put('/:id', (0, todoValidator_1.validateRequest)(todoValidator_1.updateTodoSchema), todoController_1.updateTodo);
// Delete todo
router.delete('/:id', todoController_1.deleteTodo);
exports.default = router;
//# sourceMappingURL=todoRoutes.js.map