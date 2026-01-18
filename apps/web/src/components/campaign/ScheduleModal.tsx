/**
 * Campaign Scheduling Modal
 * Allows user to select start date/time for 7-day campaign
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Clock, Globe, Loader2, X } from 'lucide-react';

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (startAt: string, timezone: string) => Promise<void>;
  isLoading?: boolean;
}

export function ScheduleModal({ open, onClose, onSchedule, isLoading }: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [timezone, setTimezone] = useState<string>('Europe/Vilnius');
  const [error, setError] = useState<string>('');

  if (!open) return null;

  const handleSchedule = async () => {
    if (!selectedDate) {
      setError('Pasirinkite datą');
      return;
    }

    if (!selectedTime) {
      setError('Pasirinkite laiką');
      return;
    }

    // Combine date and time into ISO string
    const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

    // Validate future date
    if (startDateTime < new Date()) {
      setError('Pasirinkite būsimą datą ir laiką');
      return;
    }

    setError('');

    // Convert to ISO string
    const startAt = startDateTime.toISOString();

    await onSchedule(startAt, timezone);
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const timezones = [
    { value: 'Europe/Vilnius', label: 'Vilnius (GMT+2/+3)' },
    { value: 'Europe/Riga', label: 'Riga (GMT+2/+3)' },
    { value: 'Europe/Tallinn', label: 'Tallinn (GMT+2/+3)' },
    { value: 'Europe/Warsaw', label: 'Warsaw (GMT+1/+2)' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1/+2)' },
    { value: 'Europe/London', label: 'London (GMT+0/+1)' },
    { value: 'America/New_York', label: 'New York (GMT-5/-4)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8/-7)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                Planuoti 7 dienų kampaniją
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Pasirinkite kada pradėti publikuoti turinį. Bus sugeneruoti 7 įrašai
                (po vieną kasdien).
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Pradžios data
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full"
            />
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Publikavimo laikas
            </label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Kiekvienos dienos įrašas bus publikuojamas šiuo laiku
            </p>
          </div>

          {/* Timezone Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Laiko juosta
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          {selectedDate && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 space-y-1">
              <p className="text-sm font-medium text-blue-900">📅 Kampanijos planas:</p>
              <ul className="text-xs text-blue-700 space-y-0.5">
                <li>• Pradžia: {new Date(selectedDate).toLocaleDateString('lt-LT')} {selectedTime}</li>
                <li>• 7 dienos: {new Date(selectedDate).toLocaleDateString('lt-LT')} - {new Date(new Date(selectedDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('lt-LT')}</li>
                <li>• 3 platformos: Instagram, Facebook, LinkedIn</li>
                <li>• ~21 įrašas su AI generuotais paveikslėliais</li>
              </ul>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Atšaukti
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generuojama...
              </>
            ) : (
              <>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Generuoti ir planuoti
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
