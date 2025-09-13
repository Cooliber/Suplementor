'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  persistent?: boolean;
}

interface UserFeedbackProps {
  messages: FeedbackMessage[];
  onDismiss: (id: string) => void;
}

const FeedbackIcon = ({ type }: { type: FeedbackType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5" />;
    case 'error':
      return <AlertCircle className="h-5 w-5" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5" />;
    case 'info':
      return <Info className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const FeedbackMessage = ({ 
  message, 
  onDismiss 
}: { 
  message: FeedbackMessage; 
  onDismiss: (id: string) => void; 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (!message.persistent && message.duration !== 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, message.duration || 5000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [message.id, message.persistent, message.duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(message.id), 300);
  };

  const baseClasses = cn(
    'fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg border p-4 transition-all duration-300',
    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
  );

  const typeClasses = {
    success: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    info: 'border-blue-500 bg-blue-50',
  };

  const iconClasses = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  return (
    <div className={cn(baseClasses, typeClasses[message.type])}>
      <div className="flex items-start space-x-3">
        <div className={cn('flex-shrink-0', iconClasses[message.type])}>
          <FeedbackIcon type={message.type} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{message.title}</h4>
          <p className="text-sm text-gray-700 mt-1">{message.message}</p>
          
          {message.action && (
            <button
              onClick={message.action.onClick}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-2"
            >
              {message.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const UserFeedback = ({ messages, onDismiss }: UserFeedbackProps) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((message) => (
        <FeedbackMessage
          key={message.id}
          message={message}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

// Hook for managing feedback messages
export const useUserFeedback = () => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);

  const addMessage = (message: Omit<FeedbackMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages((prev) => [...prev, { ...message, id }]);
  };

  const dismissMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    dismissMessage,
    clearMessages,
  };
};

// Predefined feedback messages
export const createFeedbackMessages = {
  supplementAdded: (name: string) => ({
    type: 'success' as const,
    title: 'Supplement Added',
    message: `${name} has been successfully added to your tracker.`,
    duration: 3000,
  }),

  supplementUpdated: (name: string) => ({
    type: 'success' as const,
    title: 'Supplement Updated',
    message: `${name} has been updated successfully.`,
    duration: 3000,
  }),

  supplementDeleted: (name: string) => ({
    type: 'info' as const,
    title: 'Supplement Removed',
    message: `${name} has been removed from your tracker.`,
    duration: 3000,
  }),

  logAdded: () => ({
    type: 'success' as const,
    title: 'Log Added',
    message: 'Your supplement log has been recorded.',
    duration: 2500,
  }),

  dataError: (action: string) => ({
    type: 'error' as const,
    title: 'Data Error',
    message: `Failed to ${action}. Please try again.`,
    action: {
      label: 'Retry',
      onClick: () => window.location.reload(),
    },
    duration: 0,
  }),

  validationError: (field: string) => ({
    type: 'warning' as const,
    title: 'Validation Error',
    message: `Please check the ${field} field and try again.`,
    duration: 4000,
  }),

  aiRecommendation: (count: number) => ({
    type: 'info' as const,
    title: 'AI Recommendations',
    message: `Generated ${count} new personalized recommendations for you.`,
    duration: 5000,
  }),

  dataSynced: () => ({
    type: 'success' as const,
    title: 'Data Synced',
    message: 'Your data has been successfully synchronized.',
    duration: 3000,
  }),

  offlineWarning: () => ({
    type: 'warning' as const,
    title: 'Offline Mode',
    message: 'You\'re currently offline. Changes will sync when you\'re back online.',
    duration: 0,
    persistent: true,
  }),

  backupCreated: () => ({
    type: 'success' as const,
    title: 'Backup Created',
    message: 'A backup of your data has been created successfully.',
    duration: 4000,
  }),
};

// Toast notifications system
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={4000}
        theme="light"
      />
    </>
  );
};

// Feedback messages for common operations
export const useFeedback = () => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showWarning = useCallback((message: string) => {
    toast.warning(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((toastId: string | number) => {
    toast.dismiss(toastId);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
  };
};

// Predefined feedback messages for supplement tracking
export const useSupplementFeedback = () => {
  const { showSuccess, showError, showWarning, showInfo } = useFeedback();

  const supplementAdded = useCallback(() => {
    showSuccess('Suplement został dodany do Twojej rutyny');
  }, [showSuccess]);

  const supplementUpdated = useCallback(() => {
    showSuccess('Informacje o suplemencie zostały zaktualizowane');
  }, [showSuccess]);

  const supplementRemoved = useCallback(() => {
    showSuccess('Suplement został usunięty z rutyny');
  }, [showSuccess]);

  const intakeLogged = useCallback((supplementName: string) => {
    showSuccess(`Spożycie ${supplementName} zostało zalogowane`);
  }, [showSuccess]);

  const intakeUpdated = useCallback((supplementName: string) => {
    showInfo(`Spożycie ${supplementName} zostało zaktualizowane`);
  }, [showInfo]);

  const doseWarning = useCallback((supplementName: string, maxDose: number) => {
    showWarning(`Uwaga: przekroczono zalecaną dawkę ${supplementName} (${maxDose})`);
  }, [showWarning]);

  const interactionWarning = useCallback((supplements: string[]) => {
    showWarning(`Potencjalna interakcja między: ${supplements.join(', ')}`);
  }, [showWarning]);

  const dataExportSuccess = useCallback(() => {
    showSuccess('Dane zostały wyeksportowane pomyślnie');
  }, [showSuccess]);

  const dataImportSuccess = useCallback(() => {
    showSuccess('Dane zostały zaimportowane pomyślnie');
  }, [showSuccess]);

  const dataError = useCallback((operation: string) => {
    showError(`Błąd podczas ${operation}. Spróbuj ponownie.`);
  }, [showError]);

  const validationError = useCallback((field: string) => {
    showError(`Pole ${field} zawiera nieprawidłowe dane`);
  }, [showError]);

  const reminderSet = useCallback((supplementName: string, time: string) => {
    showSuccess(`Przypomnienie o ${supplementName} ustawione na ${time}`);
  }, [showSuccess]);

  const streakAchieved = useCallback((days: number) => {
    showSuccess(`Gratulacje! ${days}-dniowa passa regularności!`);
  }, [showSuccess]);

  const complianceImproved = useCallback((percentage: number) => {
    showSuccess(`Twoja regularność wzrosła do ${percentage}%`);
  }, [showSuccess]);

  const aiRecommendationGenerated = useCallback(() => {
    showInfo('Nowe rekomendacje AI zostały wygenerowane');
  }, [showInfo]);

  return {
    supplementAdded,
    supplementUpdated,
    supplementRemoved,
    intakeLogged,
    intakeUpdated,
    doseWarning,
    interactionWarning,
    dataExportSuccess,
    dataImportSuccess,
    dataError,
    validationError,
    reminderSet,
    streakAchieved,
    complianceImproved,
    aiRecommendationGenerated,
  };
};

// Hook for tracking user actions with feedback
export const useActionTracker = () => {
  const { showSuccess, showError, showLoading } = useFeedback();

  const trackAction = useCallback(
    async function <T>(
      action: () => Promise<T>,
      options: {
        loading?: string;
        success?: string;
        error?: string;
      } = {},
    ): Promise<T> {
      const {
        loading = 'Przetwarzanie...',
        success = 'Operacja zakończona sukcesem',
        error = 'Operacja nie powiodła się',
      } = options;

      const toastId = showLoading(loading);

      try {
        const result = await action();
        showSuccess(success);
        return result;
      } catch (err) {
        showError(error);
        throw err;
      } finally {
        // Dismiss the loading toast
        setTimeout(() => {
          // Note: sonner handles toast dismissal internally
        }, 100);
      }
    },
    [showSuccess, showError, showLoading],
  );

  return { trackAction };
};