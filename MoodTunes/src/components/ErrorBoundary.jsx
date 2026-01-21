import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-black bg-opacity-20 backdrop-blur-md rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">⚠️</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>

                        <p className="text-gray-300 mb-6">
                            The music app encountered an unexpected error. This might be due to:
                        </p>

                        <ul className="text-left text-gray-300 mb-6 space-y-2">
                            <li>• Network connectivity issues</li>
                            <li>• API service temporarily unavailable</li>
                            <li>• Browser compatibility issues</li>
                        </ul>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Refresh Page
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-gray-400 hover:text-white">
                                    Developer Details
                                </summary>
                                <div className="mt-2 bg-gray-900 p-4 rounded text-xs overflow-auto">
                                    <div className="text-red-400 font-bold">Error:</div>
                                    <div className="mb-2">{this.state.error.toString()}</div>

                                    <div className="text-red-400 font-bold">Stack Trace:</div>
                                    <pre className="whitespace-pre-wrap text-gray-300">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;