import { Component } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Component crashed:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  }

  handleGoToDashboard = () => {
    // This assumes you are using a router that can handle this navigation.
    // If not using react-router-dom, this might need adjustment.
    window.location.href = '/dashboard';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '2rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '3rem',
            maxWidth: '550px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={30} />
            </div>
            <h2 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 700 }}>
              An Application Error Occurred
            </h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
              A critical part of the UI has failed. You can attempt to retry the action or navigate to a safe place.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 500, color: '#475569' }}>
                  Error Details (Development Mode)
                </summary>
                <p style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#475569',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  marginTop: '0.5rem',
                  wordBreak: 'break-word'
                }}>
                  {this.state.error.message}
                </p>
              </details>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={this.handleGoToDashboard}
                style={{
                  background: 'var(--ieee-blue, #00629B)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Home size={16} />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

