import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #f5222d',
          borderRadius: '4px',
          backgroundColor: '#fff2f0'
        }}>
          <h2 style={{ color: '#f5222d' }}>Oops! Something went wrong</h2>
          <p style={{ color: '#8b0000' }}>
            We encountered an error. Please refresh the page to try again.
          </p>
          <details style={{ whitespace: 'pre-wrap', marginTop: '10px', color: '#595959' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
