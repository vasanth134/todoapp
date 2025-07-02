import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import { ConfigProvider } from 'antd'
import Header from './components/Header'
import TodoList from './pages/TodoList'
import { useTheme } from './contexts/ThemeContext'

const { Content } = Layout

const App: React.FC = () => {
  const { antdTheme } = useTheme()

  return (
    <ConfigProvider theme={antdTheme}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Content style={{ padding: '24px' }}>
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/todos" element={<TodoList />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App