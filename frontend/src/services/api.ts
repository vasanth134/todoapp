import type { Todo, CreateTodoInput, UpdateTodoInput, DashboardStats } from '../types'

const API_BASE_URL = 'http://localhost:5001/api'

export const todoService = {
  // Get all todos
  async getAllTodos(): Promise<Todo[]> {
    console.log('🔄 API: Fetching all todos...')
    const response = await fetch(`${API_BASE_URL}/todos`)
    const data = await response.json()
    console.log('✅ API: Received todos:', data)
    return data.success ? data.data : []
  },

  // Create a new todo
  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    console.log('🔄 API: Creating todo:', todo)
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
    const data = await response.json()
    console.log('✅ API: Created todo response:', data)
    if (!data.success) {
      throw new Error(data.error || 'Failed to create todo')
    }
    return data.data
  },

  // Update a todo
  async updateTodo(id: string, todo: UpdateTodoInput): Promise<Todo> {
    console.log('🔄 API: Updating todo:', id, todo)
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })
    const data = await response.json()
    console.log('✅ API: Updated todo response:', data)
    if (!data.success) {
      throw new Error(data.error || 'Failed to update todo')
    }
    return data.data
  },

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    console.log('🔄 API: Deleting todo:', id)
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    console.log('✅ API: Deleted todo response:', data)
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete todo')
    }
  },

  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/todos/stats`)
    const data = await response.json()
    return data.success ? data.data : {
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0,
      overdueTodos: 0,
      todayTodos: 0,
      upcomingTodos: 0,
    }
  },
}
