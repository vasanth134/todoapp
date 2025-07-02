import { useState, useEffect } from 'react'
import {
  Card,
  List,
  Button,
  Tag,
  Space,
  Checkbox,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Popconfirm,
  Tooltip,
  message,
  Progress,
  Statistic,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  StarOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types'
import { todoService } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'

const { Title, Text } = Typography
const { TextArea } = Input

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [form] = Form.useForm()
  const { isDarkMode } = useTheme()

  // Computed statistics
  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  // Fetch todos from API
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching todos from database...')
      const fetchedTodos = await todoService.getAllTodos()
      console.log('✅ Received todos:', fetchedTodos)
      setTodos(fetchedTodos)
    } catch (error) {
      console.error('❌ Error fetching todos:', error)
      message.error('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTodo = async (values: CreateTodoInput) => {
    try {
      console.log('🔄 Creating todo:', values)
      const newTodo = await todoService.createTodo(values)
      console.log('✅ Todo created:', newTodo)
      setTodos([newTodo, ...todos])
      setIsModalVisible(false)
      form.resetFields()
      message.success('Todo created successfully!')
    } catch (error) {
      console.error('❌ Error creating todo:', error)
      message.error('Failed to create todo')
    }
  }

  const handleUpdateTodo = async (values: UpdateTodoInput) => {
    if (!editingTodo) return

    try {
      console.log('🔄 Updating todo:', editingTodo.id, values)
      const updatedTodo = await todoService.updateTodo(editingTodo.id, values)
      console.log('✅ Todo updated:', updatedTodo)
      
      const updatedTodos = todos.map((todo) =>
        todo.id === editingTodo.id ? updatedTodo : todo
      )
      setTodos(updatedTodos)
      setIsModalVisible(false)
      setEditingTodo(null)
      form.resetFields()
      message.success('Todo updated successfully!')
    } catch (error) {
      console.error('❌ Error updating todo:', error)
      message.error('Failed to update todo')
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      console.log('🔄 Deleting todo:', id)
      await todoService.deleteTodo(id)
      console.log('✅ Todo deleted:', id)
      setTodos(todos.filter((todo) => todo.id !== id))
      message.success('Todo deleted successfully!')
    } catch (error) {
      console.error('❌ Error deleting todo:', error)
      message.error('Failed to delete todo')
    }
  }

  const handleToggleComplete = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      console.log('🔄 Toggling todo completion:', id, !todo.completed)
      const updatedTodo = await todoService.updateTodo(id, { completed: !todo.completed })
      console.log('✅ Todo completion toggled:', updatedTodo)
      
      const updatedTodos = todos.map((t) =>
        t.id === id ? updatedTodo : t
      )
      setTodos(updatedTodos)
      message.success(`Todo marked as ${updatedTodo.completed ? 'completed' : 'incomplete'}!`)
    } catch (error) {
      console.error('❌ Error toggling todo completion:', error)
      message.error('Failed to update todo')
    }
  }

  const openCreateModal = () => {
    setEditingTodo(null)
    setIsModalVisible(true)
    form.resetFields()
  }

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalVisible(true)
    form.setFieldsValue({
      title: todo.title || '',
      description: todo.description || '',
      priority: todo.priority || 'medium',
      dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
    })
  }

  const handleSubmit = (values: any) => {
    const formData = {
      title: values.title?.trim() || '',
      description: values.description?.trim() || '',
      priority: values.priority || 'medium',
      dueDate: values.dueDate ? dayjs(values.dueDate).format('YYYY-MM-DD') : undefined,
    }

    if (editingTodo) {
      handleUpdateTodo(formData)
    } else {
      handleCreateTodo(formData)
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !todos.find(t => t.dueDate === dueDate)?.completed
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
      {/* Hero Section */}
      <div style={{ 
        marginBottom: '40px', 
        textAlign: 'center',
        padding: '40px 0',
      }}>
        <div className="animate-slideInUp">
          <Title 
            level={1} 
            style={{ 
              margin: 0, 
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '48px',
              fontWeight: '800',
            }}
          >
            My Tasks
          </Title>
          <Text 
            style={{ 
              fontSize: '18px',
              opacity: 0.8,
              fontWeight: '400',
            }}
          >
            Stay organized and productive with style ✨
          </Text>
        </div>

        {/* Statistics Cards */}
        {totalTodos > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center', 
            marginTop: '32px',
            flexWrap: 'wrap',
          }}>
            <Card className="glass-card" style={{ minWidth: '140px', textAlign: 'center' }}>
              <Statistic
                title="Total Tasks"
                value={totalTodos}
                prefix={<TrophyOutlined style={{ color: '#3b82f6' }} />}
                valueStyle={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: '600' }}
              />
            </Card>
            <Card className="glass-card" style={{ minWidth: '140px', textAlign: 'center' }}>
              <Statistic
                title="Completed"
                value={completedTodos}
                prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
                valueStyle={{ color: '#10b981', fontWeight: '600' }}
              />
            </Card>
            <Card className="glass-card" style={{ minWidth: '160px', textAlign: 'center' }}>
              <div style={{ marginBottom: '8px' }}>
                <Text strong style={{ color: isDarkMode ? '#cbd5e1' : '#64748b' }}>Progress</Text>
              </div>
              <Progress
                type="circle"
                size={60}
                percent={completionRate}
                strokeColor={{
                  '0%': '#3b82f6',
                  '100%': '#10b981',
                }}
                trailColor={isDarkMode ? '#374151' : '#e2e8f0'}
              />
            </Card>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={openCreateModal}
          className="animate-pulse"
          style={{
            height: '56px',
            paddingLeft: '32px',
            paddingRight: '32px',
            fontWeight: '600',
            fontSize: '16px',
            borderRadius: '28px',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
          }}
        >
          Create New Task
        </Button>
      </div>

      {/* Tasks List */}
      <Card className="glass-card" style={{ marginBottom: '32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="custom-spinner" style={{ margin: '0 auto 16px' }}></div>
            <Text>Loading your tasks...</Text>
          </div>
        ) : todos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ marginBottom: '24px' }}>
              <StarOutlined 
                style={{ 
                  fontSize: '64px',
                  color: isDarkMode ? '#475569' : '#cbd5e1',
                  marginBottom: '16px',
                  display: 'block',
                }} 
              />
            </div>
            <Title level={3} style={{ opacity: 0.7, marginBottom: '8px' }}>
              No tasks yet!
            </Title>
            <Text style={{ fontSize: '16px', opacity: 0.6 }}>
              Create your first task and start being productive 🚀
            </Text>
          </div>
        ) : (
          <List
            dataSource={todos}
            renderItem={(todo, index) => (
              <List.Item
                className={`todo-item priority-${todo.priority} ${todo.completed ? 'todo-completed' : ''}`}
                style={{
                  borderBottom: 'none',
                  animationDelay: `${index * 0.1}s`,
                }}
                actions={[
                  <Tooltip title="Edit Task">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(todo)}
                      style={{ 
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        borderRadius: '12px',
                      }}
                      size="large"
                    />
                  </Tooltip>,
                  <Popconfirm
                    title="Delete Task"
                    description="Are you sure you want to delete this task?"
                    onConfirm={() => handleDeleteTodo(todo.id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      style: { borderRadius: '8px' }
                    }}
                    cancelButtonProps={{
                      style: { borderRadius: '8px' }
                    }}
                  >
                    <Tooltip title="Delete Task">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{ 
                          color: '#ef4444',
                          borderRadius: '12px',
                        }}
                        size="large"
                      />
                    </Tooltip>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      style={{ 
                        marginTop: '8px',
                        transform: 'scale(1.2)',
                      }}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <Text
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          opacity: todo.completed ? 0.6 : 1,
                          color: isDarkMode ? '#f1f5f9' : '#1e293b',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {todo.title}
                      </Text>
                      
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
                        <Tag 
                          color={
                            todo.priority === 'high' ? '#ef4444' :
                            todo.priority === 'medium' ? '#f59e0b' : '#10b981'
                          }
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: '600',
                            borderRadius: '8px',
                            padding: '2px 8px',
                            border: 'none',
                          }}
                          icon={
                            todo.priority === 'high' ? <FireOutlined /> :
                            todo.priority === 'medium' ? <ClockCircleOutlined /> : 
                            <CheckCircleOutlined />
                          }
                        >
                          {todo.priority.toUpperCase()}
                        </Tag>
                        
                        {todo.dueDate && isOverdue(todo.dueDate) && !todo.completed && (
                          <Tag 
                            color="#ef4444" 
                            icon={<ExclamationCircleOutlined />} 
                            style={{ 
                              fontSize: '11px',
                              fontWeight: '600',
                              borderRadius: '8px',
                              animation: 'pulse 2s infinite',
                            }}
                          >
                            OVERDUE
                          </Tag>
                        )}
                        
                        {todo.completed && (
                          <Tag 
                            color="#10b981" 
                            icon={<CheckCircleOutlined />} 
                            style={{ 
                              fontSize: '11px',
                              fontWeight: '600',
                              borderRadius: '8px',
                            }}
                          >
                            COMPLETED
                          </Tag>
                        )}
                      </div>
                    </div>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%', marginTop: '8px' }}>
                      {todo.description && (
                        <Text 
                          style={{ 
                            fontSize: '15px',
                            lineHeight: '1.5',
                            color: isDarkMode ? '#cbd5e1' : '#64748b',
                            opacity: todo.completed ? 0.6 : 1,
                          }}
                        >
                          {todo.description}
                        </Text>
                      )}
                      {todo.dueDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CalendarOutlined 
                            style={{ 
                              color: isOverdue(todo.dueDate) && !todo.completed ? '#ef4444' : '#94a3b8',
                              fontSize: '14px' 
                            }} 
                          />
                          <Text 
                            style={{ 
                              fontSize: '13px',
                              color: isOverdue(todo.dueDate) && !todo.completed ? '#ef4444' : '#94a3b8',
                              fontWeight: '500',
                            }}
                          >
                            Due: {new Date(todo.dueDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Text>
                        </div>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title={
          <div style={{ 
            textAlign: 'center', 
            paddingBottom: '20px',
            borderBottom: `1px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`,
          }}>
            <Title level={3} style={{ margin: 0, color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
              {editingTodo ? '✏️ Edit Task' : '✨ Create New Task'}
            </Title>
            <Text style={{ opacity: 0.7 }}>
              {editingTodo ? 'Make changes to your task' : 'Add a new task to your list'}
            </Text>
          </div>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingTodo(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
        centered
        style={{ borderRadius: '20px' }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '32px' }}
          size="large"
        >
          <Form.Item
            name="title"
            label={<Text strong style={{ fontSize: '16px' }}>Task Title</Text>}
            rules={[{ required: true, message: 'Please enter a task title' }]}
          >
            <Input 
              placeholder="Enter your task title..." 
              style={{ 
                fontSize: '16px',
                padding: '12px 16px',
              }}
            />
          </Form.Item>

          <Form.Item 
            name="description" 
            label={<Text strong style={{ fontSize: '16px' }}>Description</Text>}
          >
            <TextArea
              placeholder="Add more details about your task (optional)"
              rows={4}
              style={{ 
                fontSize: '15px',
                lineHeight: '1.6',
              }}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label={<Text strong style={{ fontSize: '16px' }}>Priority Level</Text>}
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select 
                  placeholder="Select priority" 
                  style={{ fontSize: '16px' }}
                >
                  <Select.Option value="low">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircleOutlined style={{ color: '#10b981' }} />
                      <Tag color="#10b981" style={{ margin: 0, borderRadius: '6px' }}>Low Priority</Tag>
                    </div>
                  </Select.Option>
                  <Select.Option value="medium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ClockCircleOutlined style={{ color: '#f59e0b' }} />
                      <Tag color="#f59e0b" style={{ margin: 0, borderRadius: '6px' }}>Medium Priority</Tag>
                    </div>
                  </Select.Option>
                  <Select.Option value="high">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FireOutlined style={{ color: '#ef4444' }} />
                      <Tag color="#ef4444" style={{ margin: 0, borderRadius: '6px' }}>High Priority</Tag>
                    </div>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="dueDate" 
                label={<Text strong style={{ fontSize: '16px' }}>Due Date</Text>}
              >
                <DatePicker
                  placeholder="Select due date"
                  style={{ width: '100%', fontSize: '16px' }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => {
                    // Disable dates before today (only for new todos)
                    return !editingTodo && current && current < dayjs().startOf('day')
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: '40px', marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'center' }} size="large">
              <Button
                onClick={() => {
                  setIsModalVisible(false)
                  setEditingTodo(null)
                  form.resetFields()
                }}
                size="large"
                style={{
                  borderRadius: '12px',
                  padding: '0 24px',
                  height: '48px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  borderRadius: '12px',
                  padding: '0 32px',
                  height: '48px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                }}
              >
                {editingTodo ? '💾 Update Task' : '🚀 Create Task'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TodoList
