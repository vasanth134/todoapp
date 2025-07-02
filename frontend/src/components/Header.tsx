import { Layout, Switch, Typography, Space, Avatar } from 'antd'
import { BulbOutlined, RocketOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <AntHeader
      className="header-glass"
      style={{
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Avatar 
          size={48}
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          icon={<RocketOutlined style={{ fontSize: '20px' }} />}
        />
        <div>
          <Typography.Title 
            level={3} 
            style={{ 
              margin: 0,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700',
              fontSize: '24px',
              position:"relative",
              top:"30px"
            }}
          >
            TaskFlow
          </Typography.Title>
          <Typography.Text 
            type="secondary" 
            style={{ 
              fontSize: '12px',
              fontWeight: '500',
              opacity: 0.8,
            }}
          >
            Get things done with style
          </Typography.Text>
        </div>
      </div>

      <Space align="center" size="large">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BulbOutlined 
            style={{ 
              fontSize: '18px',
              color: isDarkMode ? '#f59e0b' : '#3b82f6',
              transition: 'all 0.3s ease',
            }} 
          />
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            size="default"
            style={{
              background: isDarkMode ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' : undefined,
            }}
            checkedChildren={
              <span style={{ fontSize: '12px' }}>🌙</span>
            }
            unCheckedChildren={
              <span style={{ fontSize: '12px' }}>☀️</span>
            }
          />
        </div>
      </Space>
    </AntHeader>
  )
}

export default Header
