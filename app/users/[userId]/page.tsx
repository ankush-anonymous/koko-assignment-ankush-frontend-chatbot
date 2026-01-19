'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getConversationsByUserId, getUserById, User, Message } from '@/lib/api';

export default function UserConversationsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user and conversations in parallel
      const [userData, messagesData] = await Promise.all([
        getUserById(userId),
        getConversationsByUserId(userId),
      ]);

      setUser(userData);
      setMessages(messagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Group messages by session and sort chronologically
  const groupMessagesBySession = (messages: Message[]) => {
    const grouped: { [sessionId: string]: Message[] } = {};
    messages.forEach((message) => {
      const sessionId = message.sessionId || 'unknown';
      if (!grouped[sessionId]) {
        grouped[sessionId] = [];
      }
      grouped[sessionId].push(message);
    });
    
    // Sort messages within each session by timestamp
    Object.keys(grouped).forEach((sessionId) => {
      grouped[sessionId].sort((a, b) => {
        const timeA = a.timestamp || a.createdAt || '';
        const timeB = b.timestamp || b.createdAt || '';
        return new Date(timeA).getTime() - new Date(timeB).getTime();
      });
    });
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Retry
          </button>
          <button
            onClick={() => router.push('/users')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesBySession(messages);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/users')}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Conversations</h1>
          {user && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg font-medium text-gray-900">{user.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.phoneNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-900">{user.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conversations */}
        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No conversations found for this user.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages)
              .sort(([, a], [, b]) => {
                // Sort sessions by most recent message first
                const aTime = a[a.length - 1]?.timestamp || a[a.length - 1]?.createdAt || '';
                const bTime = b[b.length - 1]?.timestamp || b[b.length - 1]?.createdAt || '';
                return new Date(bTime).getTime() - new Date(aTime).getTime();
              })
              .map(([sessionId, sessionMessages]) => {
                const sessionStart = sessionMessages[0]?.timestamp || sessionMessages[0]?.createdAt;
                const sessionEnd = sessionMessages[sessionMessages.length - 1]?.timestamp || 
                                  sessionMessages[sessionMessages.length - 1]?.createdAt;
                
                return (
                  <div key={sessionId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">
                            Session: <span className="font-mono text-xs">{sessionId}</span>
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {sessionMessages.length} message(s) • Started: {formatDate(sessionStart)}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {sessionMessages.length > 1 && `Ended: ${formatDate(sessionEnd)}`}
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {sessionMessages.map((message, index) => (
                        <div
                          key={message._id}
                          className={`px-6 py-4 ${
                            message.role === 'user' 
                              ? 'bg-blue-50/50' 
                              : 'bg-white'
                          } ${index === 0 ? 'pt-4' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}>
                              {message.role === 'user' ? 'U' : 'B'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {message.role === 'user' ? 'User' : 'Bot'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(message.timestamp || message.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          Total messages: {messages.length} | Sessions: {Object.keys(groupedMessages).length}
        </div>
      </div>
    </div>
  );
}
