import React from 'react';
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  AlertCircle,
  LogOut
} from 'lucide-react';
import { GoogleChatSpace, GoogleChatMessage } from '../lib/calendar';

interface GoogleChatHubProps {
  calendarUser: any;
  calendarToken: string | null;
  calendarLoading: boolean;
  chatSpaces: GoogleChatSpace[];
  selectedSpaceName: string | null;
  setSelectedSpaceName: (name: string | null) => void;
  chatMessages: GoogleChatMessage[];
  chatLoading: boolean;
  chatError: string | null;
  newChatMessageText: string;
  setNewChatMessageText: (text: string) => void;
  handleCalendarLogin: () => void;
  handleCalendarLogout: () => void;
  loadChatData: (token: string) => void;
  loadSpaceMessages: (token: string, spaceName: string) => void;
  handleSendChatMessageSubmit: (e?: React.FormEvent) => void;
}

export const GoogleChatHub: React.FC<GoogleChatHubProps> = ({
  calendarUser,
  calendarToken,
  calendarLoading,
  chatSpaces,
  selectedSpaceName,
  setSelectedSpaceName,
  chatMessages,
  chatLoading,
  chatError,
  newChatMessageText,
  setNewChatMessageText,
  handleCalendarLogin,
  handleCalendarLogout,
  loadChatData,
  loadSpaceMessages,
  handleSendChatMessageSubmit
}) => {
  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 select-text w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header description */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-100" />
              Google Chat Workspace Hub
            </h2>
            <p className="text-xs text-cyan-100 mt-1 max-w-xl">
              Collaborate in real-time with your engineering squads. Monitor and dispatch converted Jetpack Compose code sheets, code review plans, or custom instructions directly to Google Chat spaces.
            </p>
          </div>
          
          {!calendarUser ? (
            <button 
              onClick={handleCalendarLogin}
              disabled={calendarLoading}
              className="bg-white text-slate-800 hover:bg-slate-100 transition-all font-semibold rounded-lg px-4 py-2.5 shadow-md flex items-center gap-2.5 shrink-0 text-xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4.5 h-4.5 shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Connect Google Chat</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-mono text-cyan-100 animate-pulse">Live Link Active</p>
                <p className="text-xs font-bold">{calendarUser.email}</p>
              </div>
              <button 
                onClick={handleCalendarLogout}
                className="p-2 bg-cyan-850 hover:bg-cyan-750 border border-cyan-500/20 rounded-lg text-white transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5"
                title="Disconnect google login session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Indicators */}
        {chatError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5 select-text">
            <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h5 className="font-bold">Google Chat Diagnostic:</h5>
              <p>{chatError}</p>
              <button 
                onClick={() => {
                  if (calendarToken) {
                    loadChatData(calendarToken);
                  } else {
                    handleCalendarLogin();
                  }
                }}
                className="mt-1.5 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-[10px] font-bold text-red-800 transition-colors cursor-pointer"
              >
                Retry Workspace Auth Sync
              </button>
            </div>
          </div>
        )}

        {!calendarUser ? (
          /* Signed Out Showcase view */
          <div className="border border-slate-200 bg-white rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 bg-cyan-105 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-cyan-100">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-sans">Authorize Google Chat Integration</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
              Sign in with Google to retrieve active developer rooms, spaces, or direct threads, then broadcast source review packages directly to your product channels.
            </p>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleCalendarLogin}
                disabled={calendarLoading}
                className="gsi-material-button hover:shadow-md border border-slate-200 hover:bg-slate-50 bg-white transition-all font-semibold rounded-lg px-6 py-2.5 shrink-0 text-xs flex items-center gap-3 cursor-pointer"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-[18px] h-[18px] shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span className="text-slate-700 font-sans text-xs">Sign in with Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* Signed In Workspace layout */
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Space Selector Sidebar (Left 4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col h-[580px]">
              <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-650" />
                  Chat Spaces
                </h3>
                <button
                  onClick={() => calendarToken && loadChatData(calendarToken)}
                  disabled={chatLoading}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  title="Reload Spaces"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-550 ${chatLoading && chatSpaces.length === 0 ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {chatLoading && chatSpaces.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs text-center font-sans space-y-2">
                    <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
                    <p className="font-mono text-[11px] text-slate-500">Querying secure channel pool...</p>
                  </div>
                ) : chatSpaces.length === 0 ? (
                  <div className="py-16 text-center max-w-xs mx-auto space-y-2.5 text-slate-400 select-none">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-700 text-xs">No Spaces Discovered</h4>
                    <p className="text-[10px] leading-relaxed">No active Google Chat spaces were resolved under your Workspace account.</p>
                  </div>
                ) : (
                  chatSpaces.map((space) => {
                    const isSelected = selectedSpaceName === space.name;
                    return (
                      <div
                        key={space.name}
                        onClick={() => {
                          setSelectedSpaceName(space.name);
                          if (calendarToken) {
                            loadSpaceMessages(calendarToken, space.name);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden ${
                          isSelected
                            ? 'bg-cyan-50 border-cyan-250 shadow-xs'
                            : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
                        }`}
                      >
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight mb-1">
                          {space.displayName || 'Unnamed Space'}
                        </h4>
                        <p className="text-[9px] font-mono text-slate-400 truncate">{space.name}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Active Space Message feed (Right 8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col h-[580px] overflow-hidden">
              {selectedSpaceName ? (
                <div className="flex flex-col h-full justify-between">
                  
                  {/* Active Space Header */}
                  <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        {chatSpaces.find(s => s.name === selectedSpaceName)?.displayName || 'Conversation Log'}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{selectedSpaceName}</p>
                    </div>
                    
                    <button
                      onClick={() => calendarToken && loadSpaceMessages(calendarToken, selectedSpaceName)}
                      disabled={chatLoading}
                      className="text-xs text-slate-500 hover:text-slate-850 px-2.5 py-1 border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      <RefreshCw className={`w-3 h-3 ${chatLoading ? 'animate-spin' : ''}`} />
                      <span>Fetch Logs</span>
                    </button>
                  </div>

                  {/* Msg Feed List */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 mb-3 bg-slate-50 rounded-xl p-4.5 select-text">
                    {chatLoading && chatMessages.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs text-center font-sans space-y-2">
                        <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
                        <p className="font-mono text-[11px] text-slate-500">Retrieving stream logs...</p>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="py-20 text-center max-w-sm mx-auto space-y-2.5 text-slate-400 select-none">
                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-xs text-slate-700">No Messages</h4>
                        <p className="text-[10.5px] leading-relaxed max-w-xs mx-auto text-slate-500">
                          This room log is currently empty. Converted Jetpack Compose code can be shared here. Type a message or click **"Chat Code"** on the code editor tab!
                        </p>
                      </div>
                    ) : (
                      chatMessages.map((msg, index) => {
                        const senderName = msg.sender?.displayName || 'Teammate';
                        const selfSent = calendarUser && msg.sender?.displayName === calendarUser.displayName;
                        const dateStr = msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                        return (
                          <div
                            key={msg.name || index}
                            className={`flex items-start gap-2.5 max-w-[85%] ${selfSent ? 'ml-auto flex-row-reverse' : ''}`}
                          >
                            {/* Sender Icon Badge */}
                            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs shrink-0 select-none shadow-xs">
                              {senderName.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="space-y-1">
                              {/* Author label details */}
                              <div className={`flex items-center gap-1.5 text-[10.5px] font-medium text-slate-400 ${selfSent ? 'justify-end' : ''}`}>
                                <span className="text-slate-800 font-bold select-text">{senderName}</span>
                                <span className="text-[9.5px] font-mono">{dateStr}</span>
                              </div>

                              {/* Chat bubble body text */}
                              <div className={`p-3 rounded-2xl text-xs leading-relaxed select-text ${
                                selfSent 
                                  ? 'bg-cyan-600 text-white rounded-tr-none' 
                                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                              }`}>
                                {msg.text.includes('\n') ? (
                                  <pre className={`font-mono text-[10.5px] overflow-x-auto p-1 max-w-full break-all whitespace-pre-wrap ${selfSent ? 'text-cyan-50' : 'text-slate-700 bg-slate-50 border border-slate-100 rounded-lg'}`}>
                                    <code>{msg.text}</code>
                                  </pre>
                                ) : (
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Msg Composer field */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessageSubmit(e);
                    }} 
                    className="flex items-stretch gap-2.5 shrink-0 border-t border-slate-100 pt-3"
                  >
                    <textarea
                      value={newChatMessageText}
                      onChange={(e) => setNewChatMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChatMessageSubmit();
                        }
                      }}
                      placeholder="Compose markdown message (or hit Enter to Send)..."
                      className="flex-1 text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 font-sans text-slate-700 bg-slate-50/50 resize-none h-11"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !newChatMessageText.trim()}
                      className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center shadow-xs text-xs active:scale-95 shrink-0"
                      title="Dispatch message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 text-center select-none">
                  <MessageSquare className="w-10 h-10 text-slate-200 mb-2" />
                  <h4 className="font-bold text-slate-700 text-xs">No Channel Selected</h4>
                  <p className="text-[10.5px] max-w-xs mt-1 leading-relaxed text-slate-500 font-sans">
                    Choose an active developer stream or workspace channel from the sidebar list on the left to start collaborating in real-time!
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
