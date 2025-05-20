import * as React from "react";

interface ToastProps {
    variant?: "default" | "destructive";
    title?: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = React.useState<ToastProps | null>(null);

    const showToast = React.useCallback((props: ToastProps) => {
        setToast(props);

        // Auto-dismiss after duration (default 3 seconds)
        const timer = setTimeout(() => {
            setToast(null);
        }, props.duration || 3000);

        return () => clearTimeout(timer);
    }, []);

    return React.createElement(
        ToastContext.Provider,
        { value: { toast: showToast } },
        children,
        toast && React.createElement(
            'div',
            {
                className: `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg 
                    ${toast.variant === 'destructive'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'}`
            },
            toast.title && React.createElement('div', { className: "font-bold" }, toast.title),
            toast.description && React.createElement('div', { className: "text-sm" }, toast.description)
        )
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);

    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

// Global toast function that can be imported directly
export function toast(props: ToastProps) {
    const context = React.useContext(ToastContext);

    if (context === undefined) {
        throw new Error('toast must be used within a ToastProvider');
    }

    return context.toast(props);
} 