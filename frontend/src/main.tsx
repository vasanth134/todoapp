import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1f2937',
            borderRadius: 8,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
