// Message.tsx
import React from 'react';
import { DateTime } from 'luxon';

interface MessageProps {
  message: {
    id: string;
    message: string;
    messagefrom: string;
    time: string;
    respondTo?: {
      id: string;
      message: string;
    };
  };
  isSender: boolean;
  onReply?: (messageId: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, isSender, onReply }) => {
  const formattedTime = DateTime.fromISO(message.time).toLocaleString(
    DateTime.TIME_SIMPLE
  );

  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 px-4`}
    >
      <div
        className={`relative max-w-[70%] rounded-lg p-3 ${
          isSender
            ? 'bg-teal-600 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Reply Preview */}
        {message.respondTo && (
          <div
            className={`mb-2 p-2 rounded text-sm ${
              isSender
                ? 'bg-teal-700 text-teal-100'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => onReply?.(message.respondTo?.id || '')}
          >
            <div className="font-medium">Reply to:</div>
            <div className="truncate">{message.respondTo.message}</div>
          </div>
        )}

        {/* Message Content */}
        <div className="break-words">{message.message}</div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isSender ? 'text-teal-100' : 'text-gray-500'
          }`}
        >
          {formattedTime}
        </div>

        {/* Reply Button */}
        {!isSender && (
          <button
            onClick={() => onReply?.(message.id)}
            className="absolute -bottom-2 -right-2 bg-white text-teal-600 p-1 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Reply to message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;