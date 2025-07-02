import { Request, Response } from 'express'
import { query } from '../database/config'
import { Todo, CreateTodoInput, UpdateTodoInput, DashboardStats } from '../types'

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const { status, priority, sort } = req.query

    let queryText = `
      SELECT 
        id, 
        title, 
        description, 
        completed, 
        priority, 
        due_date, 
        created_at, 
        updated_at 
      FROM todos
    `
    const queryParams: any[] = []
    const conditions: string[] = []

    // Filter by status
    if (status === 'completed') {
      conditions.push('completed = true')
    } else if (status === 'pending') {
      conditions.push('completed = false')
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      conditions.push(`priority = $${queryParams.length + 1}`)
      queryParams.push(priority)
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`
    }

    // Add sorting
    if (sort === 'priority') {
      queryText += ` ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END`
    } else if (sort === 'dueDate') {
      queryText += ` ORDER BY due_date ASC NULLS LAST`
    } else {
      queryText += ` ORDER BY created_at DESC`
    }

    const result = await query(queryText, queryParams)

    // Transform the data to match frontend expectations
    const todos = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      priority: row.priority,
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }))

    res.json({
      success: true,
      data: todos,
    })
  } catch (error) {
    console.error('Error getting todos:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos',
    })
  }
}

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await query('SELECT * FROM todos WHERE id = $1', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    const row = result.rows[0]
    const todo = {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      priority: row.priority,
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }

    res.json({
      success: true,
      data: todo,
    })
  } catch (error) {
    console.error('Error getting todo:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todo',
    })
  }
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate }: CreateTodoInput = req.body

    const result = await query(
      `INSERT INTO todos (title, description, priority, due_date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title, description || null, priority, dueDate || null]
    )

    const row = result.rows[0]
    const todo: Todo = {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      priority: row.priority,
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }

    res.status(201).json({
      success: true,
      data: todo,
      message: 'Todo created successfully',
    })
  } catch (error) {
    console.error('Error creating todo:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create todo',
    })
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData: UpdateTodoInput = req.body

    // Build dynamic update query
    const setClause: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (updateData.title !== undefined) {
      setClause.push(`title = $${paramCount}`)
      values.push(updateData.title)
      paramCount++
    }

    if (updateData.description !== undefined) {
      setClause.push(`description = $${paramCount}`)
      values.push(updateData.description)
      paramCount++
    }

    if (updateData.completed !== undefined) {
      setClause.push(`completed = $${paramCount}`)
      values.push(updateData.completed)
      paramCount++
    }

    if (updateData.priority !== undefined) {
      setClause.push(`priority = $${paramCount}`)
      values.push(updateData.priority)
      paramCount++
    }

    if (updateData.dueDate !== undefined) {
      setClause.push(`due_date = $${paramCount}`)
      values.push(updateData.dueDate)
      paramCount++
    }

    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      })
    }

    // Add updated_at timestamp
    setClause.push(`updated_at = CURRENT_TIMESTAMP`)
    
    // Add the id parameter
    values.push(id)

    const updateQuery = `
      UPDATE todos 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `

    const result = await query(updateQuery, values)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    const row = result.rows[0]
    const todo: Todo = {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      priority: row.priority,
      dueDate: row.due_date ? row.due_date.toISOString().split('T')[0] : undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }

    res.json({
      success: true,
      data: todo,
      message: 'Todo updated successfully',
    })
  } catch (error) {
    console.error('Error updating todo:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update todo',
    })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await query('DELETE FROM todos WHERE id = $1 RETURNING id', [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting todo:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete todo',
    })
  }
}

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed,
        COUNT(CASE WHEN completed = false THEN 1 END) as pending,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND completed = false THEN 1 END) as overdue
      FROM todos
    `

    const result = await query(statsQuery)
    const row = result.rows[0]

    const stats: DashboardStats = {
      total: parseInt(row.total),
      completed: parseInt(row.completed),
      pending: parseInt(row.pending),
      highPriority: parseInt(row.high_priority),
      overdue: parseInt(row.overdue),
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
    })
  }
}
