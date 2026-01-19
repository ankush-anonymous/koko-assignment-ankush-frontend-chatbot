'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type TimeSlot = {
  id: string;
  date?: string;
  startTime: string;
  endTime: string;
  status?: string;
};

type CreateSlotPayload = {
  date: string;
  startTime: string;
  endTime: string;
};

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').trim();
const apiRoute = (process.env.NEXT_PUBLIC_API_ROUTE || 'api/v1').trim();

const buildUrl = (path: string) => {
  if (!baseUrl) return '';
  const base = baseUrl.replace(/\/+$/, '');
  const route = apiRoute.replace(/^\/+/, '').replace(/\/+$/, '');
  const cleanedPath = path.replace(/^\/+/, '');
  return `${base}/${route}/${cleanedPath}`;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function TimeSlotsPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiReady = useMemo(() => Boolean(baseUrl), []);

  const fetchSlots = useCallback(async () => {
    if (!baseUrl) {
      setError('Missing NEXT_PUBLIC_BASE_URL. Configure .env.local to enable API calls.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const url =
        'http://localhost:3000/api/v1/timeslots/getAllTimeSlots?startTime=2026-01-18T22:23:41.701Z&endTime=2026-01-20T22:23:41.701Z';
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Failed to fetch slots (${response.status})`);
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : data?.data || data?.slots || [];
      setSlots(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleCreate = async () => {
    if (!baseUrl) {
      setError('Missing NEXT_PUBLIC_BASE_URL. Configure .env.local to enable API calls.');
      return;
    }

    if (!date || !startTime || !endTime) {
      setError('Please provide date, start time, and end time.');
      return;
    }

    const startIso = new Date(`${date}T${startTime}:00`).toISOString();
    const endIso = new Date(`${date}T${endTime}:00`).toISOString();
    if (new Date(endIso) <= new Date(startIso)) {
      setError('End time must be after start time.');
      return;
    }

    const payload: CreateSlotPayload = {
      date,
      startTime: startIso,
      endTime: endIso,
    };

    setIsSubmitting(true);
    setError(null);
    try {
      const url = 'http://localhost:3000/api/v1/timeslots/createTimeSlot';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to create slot (${response.status})`);
      }
      setDate('');
      setStartTime('');
      setEndTime('');
      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Time Slots Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage appointment slots for the next two days</p>
          </div>
          <button
            type="button"
            onClick={fetchSlots}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {!apiReady && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Missing `NEXT_PUBLIC_BASE_URL`. Add it to `.env.local` to enable API calls.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-black">Create New Time Slot</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCreate}
              disabled={isSubmitting || !apiReady || !date || !startTime || !endTime}
              className="rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Slot'}
            </button>
            <p className="text-xs text-gray-500">Times are in your local timezone</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-black">Upcoming Slots</h2>
            <p className="mt-1 text-sm text-gray-600">
              {slots.length} slot{slots.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
              <p className="mt-3 text-sm text-gray-500">Loading slots...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500">No slots found for the next two days.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Start</th>
                    <th className="px-6 py-3 font-medium">End</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {slots.map((slot, index) => (
                    <tr key={slot.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-black">{formatDate(slot.date || slot.startTime)}</td>
                      <td className="px-6 py-4 text-gray-700">{formatTime(slot.startTime)}</td>
                      <td className="px-6 py-4 text-gray-700">{formatTime(slot.endTime)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            slot.status === 'booked'
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {slot.status || 'available'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}