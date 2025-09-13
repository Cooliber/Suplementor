'use client';

import { format, addHours, isAfter, isBefore } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Bell, Clock, AlertTriangle, CheckCircle, X, Settings } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import  { type SupplementItem } from './OptimizedDashboard';

interface Notification {
  id: string;
  type: 'supplement' | 'reminder' | 'warning' | 'achievement';
  title: string;
  message: string;
  time: Date;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  supplementId?: string;
}

interface SmartNotificationsProps {
  supplements: SupplementItem[];
  onSupplementTaken?: (id: string) => void;
}

/**
 *
 */
const SmartNotifications = ({ supplements, onSupplementTaken }: SmartNotificationsProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState({
    supplementReminders: true,
    achievementAlerts: true,
    healthWarnings: true,
    quietHours: false
  });
  const [showSettings, setShowSettings] = useState(false);

  // Generate smart notifications based on supplement schedule and user behavior
  const generateNotifications = useMemo(() => {
    const now = new Date();
    const newNotifications: Notification[] = [];

    // Supplement reminders
    if (settings.supplementReminders) {
      supplements.forEach((supplement) => {
        if (supplement.status !== 'taken') {
          const scheduledTime = new Date();
          
          // Set different times based on supplement type
          if (supplement.name.includes('Omega-3')) {
            scheduledTime.setHours(8, 0, 0, 0); // Morning with breakfast
          } else if (supplement.name.includes('Lion\'s Mane')) {
            scheduledTime.setHours(9, 0, 0, 0); // Morning for cognitive boost
          } else if (supplement.name.includes('Bacopa')) {
            scheduledTime.setHours(12, 0, 0, 0); // Lunch time
          } else if (supplement.name.includes('L-Theanine')) {
            scheduledTime.setHours(14, 0, 0, 0); // Afternoon for focus
          }

          const isOverdue = isAfter(now, addHours(scheduledTime, 2));
          const isUpcoming = isBefore(now, scheduledTime) && isAfter(now, addHours(scheduledTime, -1));

          if (isOverdue) {
            newNotifications.push({
              id: `supplement-overdue-${supplement.id}`,
              type: 'warning',
              title: 'Zapomniano o suplemencie',
              message: `${supplement.name} - zaplanowane na ${format(scheduledTime, 'HH:mm', { locale: pl })}`,
              time: scheduledTime,
              priority: 'high',
              actionable: true,
              supplementId: supplement.id
            });
          } else if (isUpcoming) {
            newNotifications.push({
              id: `supplement-reminder-${supplement.id}`,
              type: 'reminder',
              title: 'Przypomnienie o suplemencie',
              message: `Za chwilę czas na ${supplement.name}`,
              time: scheduledTime,
              priority: 'medium',
              actionable: true,
              supplementId: supplement.id
            });
          }
        }
      });
    }

    // Achievement notifications
    if (settings.achievementAlerts) {
      const takenToday = supplements.filter(s => s.status === 'taken').length;
      const totalToday = supplements.length;
      
      if (takenToday === totalToday && totalToday > 0) {
        newNotifications.push({
          id: 'achievement-complete',
          type: 'achievement',
          title: 'Gratulacje! 🎉',
          message: 'Zażyłeś wszystkie dzisiejsze suplementy!',
          time: now,
          priority: 'low',
          actionable: false
        });
      }
    }

    // Health warnings based on patterns
    if (settings.healthWarnings) {
      const missedSupplements = supplements.filter(s => s.status !== 'taken').length;
      
      if (missedSupplements >= 3) {
        newNotifications.push({
          id: 'health-warning-missed',
          type: 'warning',
          title: 'Uwaga na regularność',
          message: `Pominięto ${missedSupplements} suplementów. Regularność jest kluczowa dla efektów.`,
          time: now,
          priority: 'high',
          actionable: false
        });
      }

      // Interaction warnings
      const hasOmega3 = supplements.some(s => s.name.includes('Omega-3') && s.status === 'taken');
      const hasLTheanine = supplements.some(s => s.name.includes('L-Theanine') && s.status === 'taken');
      
      if (hasOmega3 && hasLTheanine) {
        const timeDiff = Math.abs(now.getHours() - 14); // Assuming L-Theanine at 2 PM
        if (timeDiff < 2) {
          newNotifications.push({
            id: 'interaction-info',
            type: 'reminder',
            title: 'Optymalizacja wchłaniania',
            message: 'L-Theanine z kofeiną najlepiej działa na pusty żołądek, 2h po Omega-3',
            time: now,
            priority: 'low',
            actionable: false
          });
        }
      }
    }

    return newNotifications;
  }, [supplements, settings]);

  useEffect(() => {
    setNotifications(generateNotifications);
  }, [generateNotifications]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSupplementAction = (supplementId: string, notificationId: string) => {
    if (onSupplementTaken) {
      onSupplementTaken(supplementId);
    }
    dismissNotification(notificationId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'supplement': return <Clock className="h-4 w-4" />;
      case 'reminder': return <Bell className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'achievement': return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const activeNotifications = notifications.filter(n => {
    if (settings.quietHours) {
      const hour = new Date().getHours();
      return !(hour >= 22 || hour <= 6); // Quiet hours: 10 PM - 6 AM
    }
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-600" />
            Inteligentne powiadomienia
            {activeNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {activeNotifications.length}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showSettings && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Ustawienia powiadomień</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="supplement-reminders">Przypomnienia o suplementach</Label>
                <Switch
                  id="supplement-reminders"
                  checked={settings.supplementReminders}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, supplementReminders: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="achievement-alerts">Powiadomienia o osiągnięciach</Label>
                <Switch
                  id="achievement-alerts"
                  checked={settings.achievementAlerts}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, achievementAlerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="health-warnings">Ostrzeżenia zdrowotne</Label>
                <Switch
                  id="health-warnings"
                  checked={settings.healthWarnings}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, healthWarnings: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Tryb cichy (22:00-6:00)</Label>
                <Switch
                  id="quiet-hours"
                  checked={settings.quietHours}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, quietHours: checked }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {activeNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <p>Wszystko pod kontrolą!</p>
              <p className="text-sm">Brak aktywnych powiadomień</p>
            </div>
          ) : (
            activeNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {format(notification.time, 'HH:mm', { locale: pl })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notification.actionable && notification.supplementId && (
                      <Button
                        size="sm"
                        onClick={() => handleSupplementAction(
                          notification.supplementId!,
                          notification.id
                        )}
                      >
                        Zażyj
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartNotifications;