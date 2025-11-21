import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

// Error Boundary to catch crashes and display them
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px', 
          background: '#0a0a0a', 
          height: '100vh', 
          color: '#ff5555', 
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{fontSize: '24px', marginBottom: '20px'}}>SYSTEM FAILURE // CRITICAL ERROR</h1>
          <div style={{background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333', maxWidth: '800px', overflow: 'auto'}}>
            <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{this.state.error?.toString()}</pre>
          </div>
          <p style={{marginTop: '20px', color: '#888'}}>Please check the console (F12) for more details.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '30px',
              padding: '10px 20px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);