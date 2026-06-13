import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App uniquely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request explicit Google Calendar, Gmail, and Google Chat scopes
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');
provider.addScope('https://www.googleapis.com/auth/chat.messages');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Listen to auth state transitions
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Clear cached state if we don't have token and we are not in progress of sign-in
        cachedAccessToken = null;
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Trigger sign-in popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Access token not returned from Google Auth provider.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Auth Popup Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Log out user
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Get current cached token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Set token directly if we restored it during signin
export const setCachedToken = (token: string) => {
  cachedAccessToken = token;
};

// Interface for Calendar list items
export interface GoogleCalendarItem {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  backgroundColor?: string;
  textColor?: string;
}

// Interface for Calendar event items
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink?: string;
}

// Fetch list of user's Google Calendars
export const fetchUserCalendars = async (token: string): Promise<GoogleCalendarItem[]> => {
  const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to download user calendars from Google Calendar API.');
  }
  const data = await response.json();
  return data.items || [];
};

// Fetch upcoming events from a specific calendar
export const fetchCalendarEvents = async (
  token: string, 
  calendarId: string = 'primary'
): Promise<GoogleCalendarEvent[]> => {
  const now = new Date().toISOString();
  // Fetch up to 40 events ordered by start time
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?maxResults=40&orderBy=startTime&singleEvents=true&timeMin=${now}`;
  
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to retrieve events for the selected calendar.');
  }
  const data = await response.json();
  return data.items || [];
};

// Create a new event on a calendar
export const createCalendarEvent = async (
  token: string,
  calendarId: string = 'primary',
  eventData: {
    summary: string;
    description: string;
    start: string; // ISO string format
    end: string;   // ISO string format
    location?: string;
  }
): Promise<GoogleCalendarEvent> => {
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  
  const body = {
    summary: eventData.summary,
    description: eventData.description,
    location: eventData.location || 'Android Compose Converter IDE',
    start: {
      dateTime: eventData.start,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    },
    end: {
      dateTime: eventData.end,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create calendar event: ${errText}`);
  }

  return await response.json();
};

// Delete a calendar event
export const deleteCalendarEvent = async (
  token: string,
  calendarId: string,
  eventId: string
): Promise<void> => {
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;
  
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to remove event from your calendar.');
  }
};

// Interface for Gmail message list items from Gmail list API
export interface GmailMessageItem {
  id: string;
  threadId: string;
}

// Interface for detailed Gmail message
export interface GmailMessageDetails {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  body: string;
}

// Fetch list of user's Gmail messages
export const fetchGmailMessages = async (token: string, q?: string): Promise<GmailMessageItem[]> => {
  let endpoint = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15';
  if (q) {
    endpoint += `&q=${encodeURIComponent(q)}`;
  }
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to download message list from Gmail.');
  }
  const data = await response.json();
  return data.messages || [];
};

// Fetch Gmail message details (headers, snippet, and body)
export const fetchGmailMessageDetails = async (token: string, messageId: string): Promise<GmailMessageDetails> => {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error(`Failed to retrieve message part: ${messageId}`);
  }
  const message = await response.json();
  
  // Extract headers
  const headers = message.payload?.headers || [];
  const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject');
  const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from');
  const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date');
  
  const subject = subjectHeader ? subjectHeader.value : '(No Subject)';
  const from = fromHeader ? fromHeader.value : '(No Sender)';
  const date = dateHeader ? dateHeader.value : '';
  const snippet = message.snippet || '';
  
  // Parse body text recursively
  const body = getGmailBody(message.payload);

  return {
    id: message.id,
    threadId: message.threadId,
    snippet,
    subject,
    from,
    date,
    body: body || snippet
  };
};

// Utility function to decode base64url string safely
const decodeBase64Url = (base64UrlStr: string): string => {
  let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    try {
      return atob(base64);
    } catch (err) {
      return 'Error decoding body';
    }
  }
};

// Recursively find body text
const getGmailBody = (payload: any): string => {
  if (!payload) return '';
  if (payload.body && payload.body.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
    if (htmlPart && htmlPart.body && htmlPart.body.data) {
      return decodeBase64Url(htmlPart.body.data);
    }
    const plainPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
    if (plainPart && plainPart.body && plainPart.body.data) {
      return decodeBase64Url(plainPart.body.data);
    }
    for (const part of payload.parts) {
      const nested = getGmailBody(part);
      if (nested) return nested;
    }
  }
  return '';
};

// Send a client-side Gmail email
export const sendGmailEmail = async (
  token: string,
  to: string,
  subject: string,
  bodyHtml: string
): Promise<any> => {
  // Construct a standard RFC822/MIME-conforming email message
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    '',
    bodyHtml
  ];
  
  const emailStr = emailLines.join('\r\n');
  const base64UrlEmail = btoa(unescape(encodeURIComponent(emailStr)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: base64UrlEmail
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to send Gmail email: ${errText}`);
  }

  return await response.json();
};

// Interface for Google Chat Spaces
export interface GoogleChatSpace {
  name: string;
  displayName?: string;
  spaceType?: string;
}

// Interface for Google Chat Messages
export interface GoogleChatMessage {
  name: string;
  sender?: {
    name: string;
    displayName?: string;
    avatarUrl?: string;
    type?: string;
  };
  createTime: string;
  text: string;
}

// Fetch list of user's Google Chat spaces
export const fetchChatSpaces = async (token: string): Promise<GoogleChatSpace[]> => {
  const response = await fetch('https://chat.googleapis.com/v1/spaces?pageSize=50', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to download spaces from Google Chat: ${errText}`);
  }
  const data = await response.json();
  return data.spaces || [];
};

// Fetch messages in a Google Chat space
export const fetchChatMessages = async (token: string, spaceName: string): Promise<GoogleChatMessage[]> => {
  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=40`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch messages for space ${spaceName}: ${errText}`);
  }
  const data = await response.json();
  return data.messages || [];
};

// Send a chat message to a Google Chat space
export const sendChatMessage = async (
  token: string,
  spaceName: string,
  text: string
): Promise<GoogleChatMessage> => {
  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to send chat message: ${errText}`);
  }

  return await response.json();
};
