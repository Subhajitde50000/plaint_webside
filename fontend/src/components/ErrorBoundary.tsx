"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9f9f6]">
          <div className="text-center p-8 max-w-md">
            <div className="text-5xl mb-4">🌿</div>
            <h1 className="text-2xl font-bold text-[#1c1c1c] mb-2">
              Something went wrong
            </h1>
            <p className="text-[#6b7280] text-sm mb-6">
              We hit an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, message: "" });
                window.location.reload();
              }}
              className="bg-[#00b566] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#009955] transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
