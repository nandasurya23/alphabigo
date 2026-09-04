import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
          <div className="studio-card" style={{ maxWidth: '520px', textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 className="card-title-gold" style={{ fontSize: '20px', marginBottom: '12px' }}>
              Terjadi Kendala Sistem
            </h2>
            <p style={{ color: '#A3A3A3', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Aplikasi kalkulator mengalami kesalahan internal yang tidak terduga. Silakan muat ulang halaman untuk melanjutkan.
            </p>
            <button
              type="button"
              className="btn-calculate-now"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={this.handleReload}
            >
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
