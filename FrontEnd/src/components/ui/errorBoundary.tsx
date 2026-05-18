import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ServerError from "../features/notFound/500";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // In a real app we could pass resetErrorBoundary={this.handleReset}
      // But because ServerError uses useNavigate which must be inside a Router,
      // we need to be careful. ErrorBoundary wraps the whole app inside the router in App.tsx.
      return <ServerError error={this.state.error} resetErrorBoundary={this.handleReset} />;
    }

    return this.props.children;
  }
}
