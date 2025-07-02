export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
  updatedAt: string
  categoryId?: string
}

export interface Category {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  categoryId?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  completed?: boolean
  priority?: 'high' | 'medium' | 'low'
  dueDate?: string
  categoryId?: string
}

export interface DashboardStats {
  totalTodos: number
  completedTodos: number
  pendingTodos: number
  overdueTodos: number
  todayTodos: number
  upcomingTodos: number
}
