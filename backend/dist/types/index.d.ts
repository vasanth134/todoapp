export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    categoryId?: string;
}
export interface CreateTodoInput {
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
    categoryId?: string;
}
export interface UpdateTodoInput {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: 'high' | 'medium' | 'low';
    dueDate?: string;
    categoryId?: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface DashboardStats {
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    overdue: number;
}
//# sourceMappingURL=index.d.ts.map