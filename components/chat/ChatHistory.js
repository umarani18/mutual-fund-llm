'use client';

// Native date formatting instead of date-fns to avoid dependency issues
const formatDate = (dateStr) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    } catch (e) {
        return 'Unknown';
    }
};

export default function ChatHistory({ chatList, currentChatId, onSelectChat, onDeleteChat, onNewChat, onClearHistory, loading }) {
    return (
        <div className="w-80 h-full bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold tracking-tight text-gray-400 dark:text-gray-500">
                        History
                    </h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onNewChat()}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {chatList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-40">
                        <div className="w-10 h-10 border border-dashed border-gray-400 rounded-full flex items-center justify-center">
                            <span className="text-sm">📭</span>
                        </div>
                        <p className="text-xs font-semibold tracking-tight text-gray-500">No active nodes</p>
                    </div>
                ) : (
                    chatList.map((chat) => (
                        <div
                            key={chat.Timestamp}
                            className={`group relative px-4 py-3 rounded-xl cursor-pointer transition-all border ${currentChatId === chat.Timestamp
                                ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-200 dark:border-indigo-500/30'
                                : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-100 dark:hover:border-gray-800'
                                }`}
                            onClick={() => onSelectChat(chat.Timestamp)}
                        >
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-start justify-between">
                                    <span className={`text-sm font-semibold leading-tight tracking-tight truncate pr-6 ${currentChatId === chat.Timestamp ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {chat.title || 'Untitled Node'}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat.Timestamp);
                                        }}
                                        className="p-1.5 text-gray-300 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md flex-shrink-0"
                                        title="Delete Session"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-1 h-1 rounded-full ${currentChatId === chat.Timestamp ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-700'
                                        }`}></div>
                                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 tracking-tight">
                                        {formatDate(chat.Timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
