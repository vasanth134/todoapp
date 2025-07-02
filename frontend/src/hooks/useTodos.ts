import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { todoService } from '../services/api'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types'

// Query keys for better organization and type safety
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
}

// Hook for fetching all todos
export const useTodos = () => {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: todoService.getAllTodos,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    select: (data) => {
      // Sort todos by creation date (newest first)
      return data.sort((a: Todo, b: Todo) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  })
}

// Hook for creating a todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTodo: CreateTodoInput) => todoService.createTodo(newTodo),
    onSuccess: (createdTodo) => {
      // Update the cache with the new todo
      queryClient.setQueryData<Todo[]>(todoKeys.lists(), (oldTodos = []) => [
        createdTodo,
        ...oldTodos,
      ])
      
      // Show success message
      message.success('Todo created successfully! 🎉')
    },
    onError: (error) => {
      console.error('❌ Error creating todo:', error)
      message.error('Failed to create todo. Please try again.')
    },
  })
}

// Hook for updating a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTodoInput }) =>
      todoService.updateTodo(id, updates),
    onSuccess: (updatedTodo, { id }) => {
      // Update the specific todo in the cache
      queryClient.setQueryData<Todo[]>(todoKeys.lists(), (oldTodos = []) =>
        oldTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      )
      
      // Show success message
      message.success('Todo updated successfully! ✅')
    },
    onError: (error) => {
      console.error('❌ Error updating todo:', error)
      message.error('Failed to update todo. Please try again.')
    },
  })
}

// Hook for toggling todo completion
export const useToggleTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoService.updateTodo(id, { completed }),
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.lists())

      // Optimistically update the cache
      queryClient.setQueryData<Todo[]>(todoKeys.lists(), (oldTodos = []) =>
        oldTodos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      )

      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos)
      }
      console.error('❌ Error toggling todo:', error)
      message.error('Failed to update todo status. Please try again.')
    },
    onSuccess: (updatedTodo) => {
      // Show success message
      const action = updatedTodo.completed ? 'completed' : 'reopened'
      message.success(`Todo ${action}! ${updatedTodo.completed ? '🎉' : '🔄'}`)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

// Hook for deleting a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => todoService.deleteTodo(id),
    onMutate: async (deletedId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() })

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.lists())

      // Optimistically remove the todo
      queryClient.setQueryData<Todo[]>(todoKeys.lists(), (oldTodos = []) =>
        oldTodos.filter((todo) => todo.id !== deletedId)
      )

      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.lists(), context.previousTodos)
      }
      console.error('❌ Error deleting todo:', error)
      message.error('Failed to delete todo. Please try again.')
    },
    onSuccess: () => {
      message.success('Todo deleted successfully! 🗑️')
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() })
    },
  })
}

// Hook for getting todo statistics (computed from cached data)
export const useTodoStats = () => {
  const { data: todos = [] } = useTodos()

  return {
    totalTodos: todos.length,
    completedTodos: todos.filter((todo) => todo.completed).length,
    pendingTodos: todos.filter((todo) => !todo.completed).length,
    highPriorityTodos: todos.filter((todo) => todo.priority === 'high').length,
    overdueTodos: todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false
      return new Date(todo.dueDate) < new Date()
    }).length,
    completionRate: todos.length > 0 
      ? Math.round((todos.filter((todo) => todo.completed).length / todos.length) * 100)
      : 0,
  }
}
