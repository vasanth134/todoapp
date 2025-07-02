import express from 'express'
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getDashboardStats,
} from '../controllers/todoController'
import { validateRequest, createTodoSchema, updateTodoSchema } from '../validators/todoValidator'

const router = express.Router()

// Get dashboard stats
router.get('/stats', getDashboardStats)

// Get all todos
router.get('/', getAllTodos)

// Get todo by ID
router.get('/:id', getTodoById)

// Create new todo
router.post('/', validateRequest(createTodoSchema), createTodo)

// Update todo
router.put('/:id', validateRequest(updateTodoSchema), updateTodo)

// Delete todo
router.delete('/:id', deleteTodo)

export default router
