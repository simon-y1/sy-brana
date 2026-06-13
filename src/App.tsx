/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  FileCode, 
  Play, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  Code,
  Terminal,
  Cpu,
  BookOpen,
  Info,
  Calendar as LucideCalendar,
  CalendarPlus,
  Clock,
  LogIn,
  LogOut,
  RefreshCw,
  CalendarX,
  CheckSquare,
  Mail,
  Send,
  Inbox,
  MessageSquare,
  Download
} from 'lucide-react';

import {
  initAuth,
  googleSignIn,
  logoutUser,
  fetchUserCalendars,
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  fetchGmailMessages,
  fetchGmailMessageDetails,
  sendGmailEmail,
  fetchChatSpaces,
  fetchChatMessages,
  sendChatMessage,
  GoogleCalendarItem,
  GoogleCalendarEvent,
  GmailMessageDetails,
  GoogleChatSpace,
  GoogleChatMessage
} from './lib/calendar';
import { User as AuthUser } from 'firebase/auth';
import { GoogleChatHub } from './components/GoogleChatHub';

interface SimulatedFile {
  id: string;
  name: string;
  type: 'kotlin' | 'xml' | 'react' | 'html' | 'custom' | string;
  category: 'java' | 'res' | 'web' | 'scratch';
  content: string;
  placeholderText?: string;
}

const INITIAL_FILES: SimulatedFile[] = [
  {
    id: '1',
    name: 'MainActivity.kt',
    type: 'kotlin',
    category: 'java',
    content: `package com.example.app

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private var counter = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val textViewHeader = findViewById<TextView>(R.id.textHeader)
        val textViewCounter = findViewById<TextView>(R.id.textCounter)
        val buttonClick = findViewById<Button>(R.id.btnClick)

        textViewHeader.text = "Welcome to Android Classic View!"
        textViewCounter.text = "Count value: $counter"

        buttonClick.setOnClickListener {
            counter++
            textViewCounter.text = "Count value: $counter"
            Toast.makeText(this, "Incremented!", Toast.LENGTH_SHORT).show()
        }
    }
}`
  },
  {
    id: '2',
    name: 'activity_main.xml',
    type: 'xml',
    category: 'res',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:gravity="center">

    <TextView
        android:id="@+id/textHeader"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome!"
        android:textSize="24sp"
        android:textColor="#333333"
        android:textStyle="bold"
        android:layout_marginBottom="16dp" />

    <TextView
        android:id="@+id/textCounter"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Count: 0"
        android:textSize="18sp"
        android:layout_marginBottom="24dp" />

    <Button
        android:id="@+id/btnClick"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Increment Counter"
        android:backgroundTint="#2196F3"
        android:textColor="#FFFFFF" />

</LinearLayout>`
  },
  {
    id: '3',
    name: 'WelcomeScreen.tsx',
    type: 'react',
    category: 'web',
    content: `import React, { useState } from 'react';

export default function WelcomeScreen() {
  const [enabled, setEnabled] = useState(false);
  const [username, setUsername] = useState('Developer');

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-lg shadow-md max-w-sm mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Hello, {username}!</h1>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Welcome to your layout. Toggle the settings below to configure notifications.
      </p>
      
      <div className="flex items-center gap-3 w-full justify-between mb-4 border-t pt-4">
        <span className="text-sm font-medium text-gray-700">Push Notifications</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={\`w-11 h-6 rounded-full transition-colors flex items-center p-1 \${enabled ? 'bg-blue-600' : 'bg-gray-300'}\`}
        >
          <div className={\`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform \${enabled ? 'translate-x-5' : 'translate-x-0'}\`} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Change name..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
`
  },
  {
    id: '4',
    name: 'CheckoutForm.html',
    type: 'html',
    category: 'web',
    content: `<div class="container p-4 border rounded shadow-sm bg-white">
  <h3 class="mb-3 text-primary text-center">Checkout Order</h3>
  <form id="checkoutForm">
    <div class="mb-3">
      <label for="fullName" class="form-label">Full Name</label>
      <input type="text" class="form-control" id="fullName" placeholder="John Doe" required>
    </div>
    <div class="mb-3">
      <label for="paymentMethod" class="form-label">Payment Method</label>
      <select class="form-select" id="paymentMethod">
        <option>Credit Card</option>
        <option>PayPal</option>
        <option>Google Pay</option>
      </select>
    </div>
    <div class="form-check mb-3">
      <input type="checkbox" class="form-check-input" id="agreeTerms">
      <label class="form-check-label" for="agreeTerms">I agree to terms</label>
    </div>
    <button type="submit" class="btn btn-primary w-100">Submit Order</button>
  </form>
</div>`
  }
];

export default function App() {
  const [files, setFiles] = useState<SimulatedFile[]>(() => {
    const saved = localStorage.getItem('sim_explorer_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [folderStates, setFolderStates] = useState<Record<string, boolean>>({
    manifests: false,
    java: true,
    res: true,
    web: true,
    scratch: true
  });

  const activeFile = files.find(f => f.id === activeFileId) || files[0] || {
    id: 'empty',
    name: 'Scratchpad',
    type: 'custom',
    category: 'scratch',
    content: ''
  };

  const [customInstructions, setCustomInstructions] = useState('');
  const [deviceOption, setDeviceOption] = useState('Pixel 8 Pro (API 34)');
  const [activeTab, setActiveTab] = useState<'editor' | 'reference' | 'integration' | 'calendar' | 'gmail' | 'chat'>('editor');
  const [viewMode, setViewMode] = useState<'split' | 'source' | 'output'>('split');

  // Google Calendar Integration State Block
  const [calendarUser, setCalendarUser] = useState<AuthUser | null>(null);
  const [calendarToken, setCalendarToken] = useState<string | null>(null);
  const [calendarsList, setCalendarsList] = useState<GoogleCalendarItem[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('primary');
  const [calendarEventsList, setCalendarEventsList] = useState<GoogleCalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Google Gmail State Block
  const [gmailMessages, setGmailMessages] = useState<GmailMessageDetails[]>([]);
  const [gmailLoading, setGmailLoading] = useState<boolean>(false);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [selectedGmailMessage, setSelectedGmailMessage] = useState<GmailMessageDetails | null>(null);
  const [gmailSearchQuery, setGmailSearchQuery] = useState<string>('');
  
  // Gmail Compose Email State
  const [showGmailComposer, setShowGmailComposer] = useState<boolean>(false);
  const [gmailTo, setGmailTo] = useState<string>('');
  const [gmailSubject, setGmailSubject] = useState<string>('');
  const [gmailBody, setGmailBody] = useState<string>('');

  // Google Chat State Block
  const [chatSpaces, setChatSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<GoogleChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [newChatMessageText, setNewChatMessageText] = useState<string>('');

  // New Event form state prefilled creatively based on layout context
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventDesc, setNewEventDesc] = useState<string>('');
  const [newEventDate, setNewEventDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newEventStartTime, setNewEventStartTime] = useState<string>('14:00');
  const [newEventEndTime, setNewEventEndTime] = useState<string>('15:00');
  const [newEventLocation, setNewEventLocation] = useState<string>('Remote (Converter IDE)');

  // Conversion output state
  const [convertedCode, setConvertedCode] = useState<string>('');
  const [gradleDependencies, setGradleDependencies] = useState<string[]>([
    'implementation "androidx.compose.ui:ui:1.6.0"',
    'implementation "androidx.compose.material3:material3:1.2.0"',
    'implementation "androidx.activity:activity-compose:1.8.2"'
  ]);
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: 'c1', text: 'Enable Jetpack Compose buildFeatures inside build.gradle', completed: true },
    { id: 'c2', text: 'Configure kotlinCompilerExtensionVersion to compatible version', completed: true },
    { id: 'c3', text: 'Replace AppCompatActivity with ComponentActivity', completed: false },
    { id: 'c4', text: 'Call setContent { MaterialTheme { ... } } inside onCreate', completed: false }
  ]);
  const [designExplanation, setDesignExplanation] = useState<string>(
    'Select a source file on the left and click **"Run Conversion"** on the header or editor. Gemini will translate the element stack (like Div, LinearLayout, Button, Hooks) into elegant, standard Jetpack Compose architecture!'
  );
  
  const [loading, setLoading] = useState(false);
  const [conversionStats, setConversionStats] = useState<{ duration: number; time: string } | null>(null);
  const [statusBarMsg, setStatusBarMsg] = useState('Workspace Indexed');
  const [buildStatus, setBuildStatus] = useState<'successful' | 'building' | 'idle'>('idle');
  
  // Caret / Cursor metrics tracking inside custom text area
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedCompose, setCopiedCompose] = useState(false);

  // New file creation modals
  const [newUserFileName, setNewUserFileName] = useState('');
  const [newUserFileType, setNewUserFileType] = useState('react');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('sim_explorer_files', JSON.stringify(files));
  }, [files]);

  // Google Calendar Auth initialization
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCalendarUser(user);
        setCalendarToken(token);
        setCalendarError(null);
        loadCalendarData(token, selectedCalendarId);
        loadGmailData(token);
        loadChatData(token);
      },
      () => {
        setCalendarUser(null);
        setCalendarToken(null);
        setGmailMessages([]);
        setSelectedGmailMessage(null);
        setChatSpaces([]);
        setChatMessages([]);
        setSelectedSpaceName(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadCalendarData = async (token: string, targetCalId?: string) => {
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      const list = await fetchUserCalendars(token);
      setCalendarsList(list);
      
      const calId = targetCalId || selectedCalendarId || 'primary';
      const events = await fetchCalendarEvents(token, calId);
      setCalendarEventsList(events);
    } catch (err: any) {
      console.error(err);
      setCalendarError(err.message || 'Error occurred while synchronization with Google Calendar.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const loadGmailData = async (token: string, searchQ?: string) => {
    setGmailLoading(true);
    setGmailError(null);
    try {
      const messagesList = await fetchGmailMessages(token, searchQ !== undefined ? searchQ : gmailSearchQuery);
      // Fetch details of each message in parallel
      const detailedMessagesList = await Promise.all(
        messagesList.map(async (msg) => {
          try {
            return await fetchGmailMessageDetails(token, msg.id);
          } catch (e) {
            console.error('Error fetching gmail message detail inline:', e);
            return null;
          }
        })
      );
      // Filter out nulls
      setGmailMessages(detailedMessagesList.filter((m): m is GmailMessageDetails => m !== null));
    } catch (err: any) {
      console.error(err);
      setGmailError(err.message || 'Error occurred while fetching Gmail list.');
    } finally {
      setGmailLoading(false);
    }
  };

  const loadChatData = async (token: string) => {
    setChatLoading(true);
    setChatError(null);
    try {
      const spaces = await fetchChatSpaces(token);
      setChatSpaces(spaces);
      if (spaces.length > 0) {
        // If there's already a selected space, preserve it; otherwise grab the first one
        const activeName = selectedSpaceName || spaces[0].name;
        setSelectedSpaceName(activeName);
        loadSpaceMessages(token, activeName);
      }
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Error occurred while retrieving Google Chat spaces list.');
    } finally {
      setChatLoading(false);
    }
  };

  const loadSpaceMessages = async (token: string, spaceName: string) => {
    setChatLoading(true);
    setChatError(null);
    try {
      const messages = await fetchChatMessages(token, spaceName);
      setChatMessages(messages);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Error occurred while retrieving space messages.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleCalendarLogin = async () => {
    setCalendarLoading(true);
    setCalendarError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCalendarUser(result.user);
        setCalendarToken(result.accessToken);
        setStatusBarMsg('Signed in with Google Workspace successfully!');
        loadCalendarData(result.accessToken, selectedCalendarId);
        loadGmailData(result.accessToken);
        loadChatData(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setCalendarError('Login popup was cancelled or failed. Please check your browser workspace popups configuration.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleCalendarLogout = async () => {
    try {
      await logoutUser();
      setCalendarUser(null);
      setCalendarToken(null);
      setCalendarsList([]);
      setCalendarEventsList([]);
      setGmailMessages([]);
      setSelectedGmailMessage(null);
      setChatSpaces([]);
      setChatMessages([]);
      setSelectedSpaceName(null);
      setStatusBarMsg('Signed out of Google Workspace Services');
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarToken) return;

    if (!newEventTitle.trim()) {
      alert("Please provide a milestone title.");
      return;
    }

    const startISO = `${newEventDate}T${newEventStartTime}:00`;
    const endISO = `${newEventDate}T${newEventEndTime}:00`;

    // Construct pretty body for user confirmation dialog
    const confirmed = window.confirm(
      `Confirm Event Creation:\n\n` +
      `Title: ${newEventTitle}\n` +
      `Date: ${newEventDate}\n` +
      `Time: ${newEventStartTime} - ${newEventEndTime}\n` +
      `Location: ${newEventLocation}\n` +
      `Calendar ID: ${selectedCalendarId}\n\n` +
      `Would you like to write this milestone directly to your Google Calendar?`
    );
    if (!confirmed) return;

    setCalendarLoading(true);
    setCalendarError(null);
    try {
      await createCalendarEvent(calendarToken, selectedCalendarId, {
        summary: newEventTitle,
        description: newEventDesc,
        location: newEventLocation,
        start: new Date(startISO).toISOString(),
        end: new Date(endISO).toISOString()
      });
      setStatusBarMsg('Workspace Event Added successfully!');
      setNewEventTitle('');
      setNewEventDesc('');
      loadCalendarData(calendarToken, selectedCalendarId);
    } catch (err: any) {
      console.error(err);
      setCalendarError(err.message || 'Error occurred while creating Google Calendar milestone.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!calendarToken) return;

    const confirmed = window.confirm(
      `Delete Event Confirmation:\n\n` +
      `Are you sure you want to permanently remove "${eventTitle}" from your Google Calendar?`
    );
    if (!confirmed) return;

    setCalendarLoading(true);
    setCalendarError(null);
    try {
      await deleteCalendarEvent(calendarToken, selectedCalendarId, eventId);
      setStatusBarMsg('Removed event from your Google Calendar');
      loadCalendarData(calendarToken, selectedCalendarId);
    } catch (err: any) {
      console.error(err);
      setCalendarError(err.message || 'Could not delete the requested Google Calendar event.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleQuickScheduleMilestone = () => {
    setActiveTab('calendar');
    setNewEventTitle(`Migrate ${activeFile.name} to Compose`);
    setNewEventDesc(
      `Task: Complete Jetpack Compose implementation for ${activeFile.name}.\n\n` +
      `Design & Architectural overview:\n${designExplanation}`
    );
    setStatusBarMsg('Prefilled Calendar Event details with current file migration metadata.');
  };

  const handleSendGmailEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarToken) return;

    if (!gmailTo.trim()) {
      alert("Please enter a recipient email address.");
      return;
    }
    if (!gmailSubject.trim()) {
      alert("Please enter a subject.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm sending email via Gmail:\n\n` +
      `To: ${gmailTo}\n` +
      `Subject: ${gmailSubject}\n\n` +
      `Do you authorize sending this email from your account?`
    );
    if (!confirmed) return;

    setGmailLoading(true);
    setGmailError(null);
    try {
      await sendGmailEmail(calendarToken, gmailTo, gmailSubject, gmailBody);
      setStatusBarMsg('Email sent successfully!');
      setShowGmailComposer(false);
      setGmailTo('');
      setGmailSubject('');
      setGmailBody('');
    } catch (err: any) {
      console.error(err);
      setGmailError(err.message || 'Error occurred while sending the email.');
    } finally {
      setGmailLoading(false);
    }
  };

  const handleQuickEmailCompose = () => {
    setActiveTab('gmail');
    setGmailSubject(`Jetpack Compose Migrated: ${activeFile.name}`);
    setGmailBody(
      `<h2>Android Jetpack Compose Code Migration Review</h2>\n` +
      `<p>Here is the completed Jetpack Compose conversion for card <strong>${activeFile.name}</strong> generated using Gemini in the workspace IDE.</p>\n` +
      `<hr/>\n` +
      `<h3>Migration & Architectural Plan</h3>\n` +
      `<p>${designExplanation.replace(/\n/g, '<br/>')}</p>\n\n` +
      `<h3>Gradle Dependencies Required</h3>\n` +
      `<ul>${gradleDependencies.map(dep => `<li><code>${dep}</code></li>`).join('')}</ul>\n\n` +
      `<h3>Converted Source Code Preview</h3>\n` +
      `<pre style="background: #f1f5f9; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace; overflow-x: auto;">${convertedCode ? convertedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '// No conversion output yet'}</pre>`
    );
    setShowGmailComposer(true);
    setStatusBarMsg('Prefilled Gmail composer with latest converted Kotlin code and architect logs.');
  };

  const handleSendChatMessageSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!calendarToken) {
      alert("Please connect Google Workspace to enable Chat operations.");
      return;
    }
    if (!selectedSpaceName) {
      alert("Please select or create a valid Google Chat space first.");
      return;
    }
    if (!newChatMessageText.trim()) return;

    setChatLoading(true);
    setChatError(null);
    try {
      await sendChatMessage(calendarToken, selectedSpaceName, newChatMessageText);
      setNewChatMessageText('');
      setStatusBarMsg('Dispatched message to Google Chat Space!');
      loadSpaceMessages(calendarToken, selectedSpaceName);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'Error occurred while sending Google Chat message.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleQuickChatShare = () => {
    setActiveTab('chat');
    const intro = `🤖 *Android Jetpack Compose Code Migration Review*\n` +
      `Here is the completed Jetpack Compose conversion for *${activeFile.name}* generated in our workspace workspace:\n\n` +
      `*Migration & Architectural Plan:*\n${designExplanation || 'Reviewing file structure...'}\n\n` +
      `*Gradle Dependencies Required:*\n${gradleDependencies.map(dep => `- \`${dep}\``).join('\n') || 'None'}\n\n` +
      `*Source Code Preview:*\n\`\`\`\n${convertedCode ? (convertedCode.length > 400 ? convertedCode.substring(0, 400) + '\n... [truncated for chat preview]' : convertedCode) : '// No conversion output yet'}\n\`\`\``;
    setNewChatMessageText(intro);
    setStatusBarMsg('Prefilled Google Chat composer with latest Kotlin Compose migration logs.');
  };

  const downloadKotlinFile = () => {
    if (!convertedCode) return;
    const blob = new Blob([convertedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const rawName = activeFile.name.replace(/\.[^/.]+$/, "");
    link.download = `${rawName}Compose.kt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusBarMsg(`Successfully downloaded ${rawName}Compose.kt to your system!`);
  };

  const handleFileContentChange = (newVal: string) => {
    setFiles(prev => prev.map(f => f.id === activeFile.id ? { ...f, content: newVal } : f));
  };

  const handleCursorMove = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const valueBeforeCaret = target.value.substring(0, target.selectionStart);
    const lines = valueBeforeCaret.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const copyToClipboard = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setStatusBarMsg('Code Copied to Clipboard');
  };

  const deleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("Cannot delete the last remaining workspace file.");
      return;
    }
    const filtered = files.filter(f => f.id !== id);
    setFiles(filtered);
    if (activeFileId === id) {
      setActiveFileId(filtered[0].id);
    }
    setStatusBarMsg('File deleted successfully');
  };

  const createSimulatedFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserFileName.trim()) return;

    let finalName = newUserFileName.trim();
    let detectedCategory: 'java' | 'res' | 'web' | 'scratch' = 'scratch';
    
    if (newUserFileType === 'react' && !finalName.endsWith('.tsx') && !finalName.endsWith('.jsx')) {
      finalName += '.tsx';
      detectedCategory = 'web';
    } else if (newUserFileType === 'kotlin' && !finalName.endsWith('.kt')) {
      finalName += '.kt';
      detectedCategory = 'java';
    } else if (newUserFileType === 'xml' && !finalName.endsWith('.xml')) {
      finalName += '.xml';
      detectedCategory = 'res';
    } else if (newUserFileType === 'html' && !finalName.endsWith('.html')) {
      finalName += '.html';
      detectedCategory = 'web';
    }

    const newF: SimulatedFile = {
      id: Date.now().toString(),
      name: finalName,
      type: newUserFileType,
      category: detectedCategory,
      content: `// Scratchpad for ${finalName}\n\n// Write or paste code here...\n`
    };

    setFiles(prev => [...prev, newF]);
    setActiveFileId(newF.id);
    setNewUserFileName('');
    setShowAddModal(false);
    setStatusBarMsg(`Created ${finalName}`);
  };

  const toggleFolder = (folderName: string) => {
    setFolderStates(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  const runCodeConversion = async () => {
    if (loading) return;
    setLoading(true);
    setBuildStatus('building');
    setStatusBarMsg(`Querying active Gemini instance...`);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceCode: activeFile.content,
          fileType: activeFile.type,
          fileName: activeFile.name,
          customPrompt: customInstructions
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected request');
      }

      const data = await response.json();
      
      if (data.convertedCode) {
        setConvertedCode(data.convertedCode);
      }
      if (data.dependencies) {
        setGradleDependencies(data.dependencies);
      }
      if (data.checklist) {
        setChecklistItems(data.checklist.map((item: string, idx: number) => ({
          id: `gen-${idx}`,
          text: item,
          completed: false
        })));
      }
      if (data.explanation) {
        setDesignExplanation(data.explanation);
      }

      const durationSecs = Number(((Date.now() - startTime) / 1000).toFixed(2));
      setConversionStats({
        duration: durationSecs,
        time: new Date().toLocaleTimeString()
      });

      setStatusBarMsg(`Successful Convert in ${durationSecs}s`);
      setBuildStatus('successful');
    } catch (err: any) {
      console.error(err);
      setDesignExplanation(`Conversion error: ${err.message || err}. Please double check that you have configured your environment variables correctly inside AI Studio settings, and try again.`);
      setStatusBarMsg(`Error: Conversion failed`);
      setBuildStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    setStatusBarMsg('Updated integration checkoff');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden select-none">
      {/* Header / Toolbar Section */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold tracking-wider">A</div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-800">Android Compose Converter</span>
              <span className="text-[10px] text-slate-400 font-medium">Professional Migration Studio</span>
            </div>
          </div>
          <nav className="flex gap-4 ml-8 text-xs font-semibold text-slate-500">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`pb-4 mt-4 border-b-2 hover:text-slate-800 transition-colors ${activeTab === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              Workspace IDE
            </button>
            <button 
              onClick={() => setActiveTab('reference')}
              className={`pb-4 mt-4 border-b-2 hover:text-slate-800 transition-colors ${activeTab === 'reference' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              Compose API Reference
            </button>
            <button 
              onClick={() => setActiveTab('integration')}
              className={`pb-4 mt-4 border-b-2 hover:text-slate-800 transition-colors ${activeTab === 'integration' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              Gradle Guide
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`pb-4 mt-4 border-b-2 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === 'calendar' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              <LucideCalendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Google Calendar Sync</span>
            </button>
            <button 
              onClick={() => setActiveTab('gmail')}
              className={`pb-4 mt-4 border-b-2 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === 'gmail' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>Gmail Workspace</span>
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`pb-4 mt-4 border-b-2 hover:text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer ${activeTab === 'chat' ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Google Chat</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono hidden md:inline">Target Runtime:</span>
            <select 
              value={deviceOption} 
              onChange={(e) => {
                setDeviceOption(e.target.value);
                setStatusBarMsg(`Target updated to ${e.target.value}`);
              }}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-xs text-slate-600 focus:outline-none"
            >
              <option>Pixel 8 Pro (API 34)</option>
              <option>Samsung Galaxy S24 (API 34)</option>
              <option>Tablet Fold Foldable (API 33)</option>
              <option>Generic Emulator (API 31)</option>
            </select>
          </div>

          <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini Connected
          </div>

          <button
            onClick={runCodeConversion}
            disabled={loading}
            className={`px-4 py-1.5 rounded text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed opacity-80' 
                : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {loading ? 'Converting...' : 'Run Conversion'}
          </button>

          {convertedCode && (
            <button
              onClick={downloadKotlinFile}
              className="px-4 py-1.5 rounded text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 hover:shadow-md flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:transform active:scale-95 border border-amber-500/20"
              title="Download converted Jetpack Compose code (.kt)"
            >
              <Download className="w-3.5 h-3.5 text-amber-250 animate-bounce" />
              Download .kt File
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'editor' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar: Project Explorer */}
          <aside className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 select-none">
            <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project Files</span>
              <button 
                onClick={() => setShowAddModal(true)}
                className="p-1 hover:bg-slate-200 text-slate-600 hover:text-blue-600 rounded transition-colors"
                title="Add simulated source file"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated file path directory structure */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              <div className="flex flex-col gap-0.5">
                
                {/* App Main Module Folder */}
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 rounded">
                  <Folder className="w-4 h-4 text-blue-500 fill-blue-50/50" />
                  <span>app</span>
                </div>

                <div className="ml-3 pl-2 border-l border-slate-200 flex flex-col gap-0.5">
                  {/* manifests */}
                  <div>
                    <div 
                      onClick={() => toggleFolder('manifests')}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded hover:bg-slate-100"
                    >
                      {folderStates.manifests ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>manifests</span>
                    </div>
                    {folderStates.manifests && (
                      <div className="ml-4 pl-3 border-l border-slate-200 py-0.5">
                        <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-400 italic">
                          <FileCode className="w-3.5 h-3.5" />
                          <span>AndroidManifest.xml</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* java / Kotlin category */}
                  <div>
                    <div 
                      onClick={() => toggleFolder('java')}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded hover:bg-slate-100"
                    >
                      {folderStates.java ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>java (Android classic)</span>
                    </div>
                    {folderStates.java && (
                      <div className="ml-3 flex flex-col gap-0.5">
                        {files.filter(f => f.category === 'java').map(f => (
                          <div 
                            key={f.id}
                            onClick={() => {
                              setActiveFileId(f.id);
                              setStatusBarMsg(`Opened ${f.name}`);
                            }}
                            className={`flex items-center justify-between group px-3 py-1.5 text-xs rounded cursor-pointer transition-all ${
                              activeFile.id === f.id 
                                ? 'bg-blue-100/90 text-blue-700 font-semibold border-l-2 border-blue-600' 
                                : 'text-slate-600 hover:bg-slate-150/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden truncate">
                              <FileCode className={`w-3.5 h-3.5 shrink-0 ${activeFile.id === f.id ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="truncate">{f.name}</span>
                            </div>
                            <button 
                              onClick={(e) => deleteFile(f.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded transition-opacity"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* layout res category */}
                  <div>
                    <div 
                      onClick={() => toggleFolder('res')}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded hover:bg-slate-100"
                    >
                      {folderStates.res ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>res (classic layout)</span>
                    </div>
                    {folderStates.res && (
                      <div className="ml-3 flex flex-col gap-0.5">
                        {files.filter(f => f.category === 'res').map(f => (
                          <div 
                            key={f.id}
                            onClick={() => {
                              setActiveFileId(f.id);
                              setStatusBarMsg(`Opened ${f.name}`);
                            }}
                            className={`flex items-center justify-between group px-3 py-1.5 text-xs rounded cursor-pointer transition-all ${
                              activeFile.id === f.id 
                                ? 'bg-blue-100/90 text-blue-700 font-semibold border-l-2 border-blue-600' 
                                : 'text-slate-600 hover:bg-slate-150/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden truncate">
                              <FileCode className={`w-3.5 h-3.5 shrink-0 ${activeFile.id === f.id ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="truncate">{f.name}</span>
                            </div>
                            <button 
                              onClick={(e) => deleteFile(f.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded transition-opacity"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Web components category */}
                  <div>
                    <div 
                      onClick={() => toggleFolder('web')}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded hover:bg-slate-100"
                    >
                      {folderStates.web ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>web (React / HTML source)</span>
                    </div>
                    {folderStates.web && (
                      <div className="ml-3 flex flex-col gap-0.5">
                        {files.filter(f => f.category === 'web').map(f => (
                          <div 
                            key={f.id}
                            onClick={() => {
                              setActiveFileId(f.id);
                              setStatusBarMsg(`Opened ${f.name}`);
                            }}
                            className={`flex items-center justify-between group px-3 py-1.5 text-xs rounded cursor-pointer transition-all ${
                              activeFile.id === f.id 
                                ? 'bg-blue-100/90 text-blue-700 font-semibold border-l-2 border-blue-600' 
                                : 'text-slate-600 hover:bg-slate-150/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden truncate">
                              <FileCode className={`w-3.5 h-3.5 shrink-0 ${activeFile.id === f.id ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="truncate">{f.name}</span>
                            </div>
                            <button 
                              onClick={(e) => deleteFile(f.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded transition-opacity"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Scratchpad category */}
                  <div>
                    <div 
                      onClick={() => toggleFolder('scratch')}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer rounded hover:bg-slate-100"
                    >
                      {folderStates.scratch ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>custom scratchpads</span>
                    </div>
                    {folderStates.scratch && (
                      <div className="ml-3 flex flex-col gap-0.5">
                        {files.filter(f => f.category === 'scratch').map(f => (
                          <div 
                            key={f.id}
                            onClick={() => {
                              setActiveFileId(f.id);
                              setStatusBarMsg(`Opened ${f.name}`);
                            }}
                            className={`flex items-center justify-between group px-3 py-1.5 text-xs rounded cursor-pointer transition-all ${
                              activeFile.id === f.id 
                                ? 'bg-blue-100/90 text-blue-700 font-semibold border-l-2 border-blue-600' 
                                : 'text-slate-600 hover:bg-slate-150/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden truncate">
                              <FileCode className={`w-3.5 h-3.5 shrink-0 ${activeFile.id === f.id ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="truncate">{f.name}</span>
                            </div>
                            <button 
                              onClick={(e) => deleteFile(f.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 rounded transition-opacity"
                              title="Delete file"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Gradle script folder tree placeholder */}
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 rounded mt-2">
                  <Folder className="w-4 h-4 text-slate-400" />
                  <span>Gradle Scripts</span>
                </div>
                <div className="ml-3 pl-2 border-l border-slate-200 font-mono text-[11px] text-slate-500 flex flex-col gap-1 py-1">
                  <div className="px-2 py-0.5 hover:text-slate-800 cursor-help">build.gradle (Project)</div>
                  <div className="px-2 py-0.5 hover:text-slate-800 cursor-help font-semibold text-slate-600">build.gradle (:app)</div>
                  <div className="px-2 py-0.5 hover:text-slate-800 cursor-help">gradle-wrapper.properties</div>
                </div>

              </div>
            </div>

            {/* User instructions box */}
            <div className="p-4 border-t border-slate-200 bg-white m-2 rounded-lg">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Workspace Instructions
              </h4>
              <p className="text-[10.5px] text-slate-500 mt-1 lines-relaxed">
                Choose a preloaded template or click <strong className="text-blue-600">+</strong> above to add custom layouts. Hit <strong>Run Conversion</strong> to start the migration.
              </p>
            </div>
          </aside>

          {/* Central Editor / Workspace Section */}
          <main className="flex-1 flex flex-col bg-white border-r border-slate-200 overflow-hidden min-w-0">
            {/* Editor Action Bar */}
            <div className="h-10 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 overflow-hidden truncate">
                <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">app / src / main / {activeFile.category === 'java' ? 'java / com.example.app' : activeFile.category === 'res' ? 'res / layout' : 'web'} / <strong className="text-slate-700">{activeFile.name}</strong></span>
                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-sans uppercase font-bold shrink-0">{activeFile.type}</span>
              </div>

              {/* Split view vs single view controllers */}
              <div className="flex items-center border border-slate-200 rounded overflow-hidden text-xs font-medium">
                <button 
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 transition-colors ${viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  Split View
                </button>
                <button 
                  onClick={() => setViewMode('source')}
                  className={`px-2.5 py-1 border-l border-slate-200 transition-colors ${viewMode === 'source' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  Source Only
                </button>
                <button 
                  onClick={() => setViewMode('output')}
                  className={`px-2.5 py-1 border-l border-slate-200 transition-colors ${viewMode === 'output' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  Compose Only
                </button>
              </div>
            </div>

            {/* Split Screen Workspace Area */}
            <div className="flex-1 flex overflow-hidden min-w-0 relative">
              {/* Columns defined by viewMode state */}
              
              {/* Column 1: Source (Input) Code Area */}
              {(viewMode === 'split' || viewMode === 'source') && (
                <div className="flex-1 flex flex-col min-w-0 h-full relative border-r border-slate-100">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] uppercase font-bold text-slate-300 font-sans tracking-widest flex items-center gap-1">
                      <Code className="w-3 h-3 text-blue-400" />
                      SOURCE CODE ENTRY
                    </span>
                    <button 
                      onClick={() => copyToClipboard(activeFile.content, setCopiedSource)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy Source Code"
                    >
                      {copiedSource ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Customizable text editor with simulated line numbers */}
                  <div className="flex-1 flex font-mono text-sm leading-relaxed overflow-hidden text-slate-300 bg-slate-900 border-none select-text">
                    {/* Line numbers generator */}
                    <div className="py-4 pl-3 pr-2 text-slate-500 text-right font-light select-none text-[12px] bg-slate-950/70 border-r border-slate-800 min-w-[36px]">
                      {activeFile.content.split('\n').map((_, index) => (
                        <div key={index} className="h-6 leading-6">{index + 1}</div>
                      ))}
                    </div>

                    {/* Interactive Text Field */}
                    <textarea
                      value={activeFile.content}
                      onChange={(e) => handleFileContentChange(e.target.value)}
                      onKeyUp={handleCursorMove}
                      onMouseUp={handleCursorMove}
                      spellCheck="false"
                      className="flex-1 h-full p-4 font-mono text-[13px] leading-6 bg-slate-900 border-none outline-none focus:ring-0 text-slate-100 resize-none overflow-y-auto whitespace-pre selection:bg-slate-700/60"
                      placeholder="Paste or write your source layout block, XML tree, React functional component, or custom code block here..."
                    />
                  </div>
                </div>
              )}

              {/* Column 2: Jetpack Compose (Output) Code Area */}
              {(viewMode === 'split' || viewMode === 'output') && (
                <div className="flex-1 flex flex-col min-w-0 h-full relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-blue-950/90 px-2.5 py-1.5 rounded-lg border border-blue-800/55 shadow-md">
                    <span className="text-[10px] uppercase font-bold text-blue-300 font-sans tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      Kotlin Jetpack Compose
                    </span>
                    {convertedCode && (
                      <>
                        <button 
                          onClick={() => copyToClipboard(convertedCode, setCopiedCompose)}
                          className="text-slate-300 hover:text-white transition-colors ml-1"
                          title="Copy Jetpack Compose code"
                        >
                          {copiedCompose ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button 
                          onClick={handleQuickScheduleMilestone}
                          className="text-blue-300 hover:text-white transition-colors ml-2 bg-blue-900/40 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-sans border border-blue-800 cursor-pointer active:scale-95"
                          title="Add Migration Session to Google Calendar"
                        >
                          <LucideCalendar className="w-3.5 h-3.5 text-blue-400" />
                          <span>Sync to Calendar</span>
                        </button>
                        <button 
                          onClick={handleQuickEmailCompose}
                          className="text-emerald-300 hover:text-white transition-colors ml-2 bg-emerald-900/40 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-sans border border-emerald-800 cursor-pointer active:scale-95"
                          title="Share converted code via Google Gmail"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Email Code</span>
                        </button>
                        <button 
                          onClick={handleQuickChatShare}
                          className="text-cyan-300 hover:text-white transition-colors ml-2 bg-cyan-900/40 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-sans border border-cyan-800 cursor-pointer active:scale-95"
                          title="Share converted code via Google Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Chat Code</span>
                        </button>
                        <button 
                          onClick={downloadKotlinFile}
                          className="text-amber-300 hover:text-white transition-colors ml-2 bg-amber-900/40 px-2 py-1 rounded text-[10px] flex items-center gap-1 font-sans border border-amber-850 cursor-pointer active:scale-95 animate-pulse"
                          title="Download Jetpack Compose source file (.kt)"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download Code</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* High Quality Result Editor Output */}
                  <div className="flex-1 flex font-mono text-sm leading-relaxed overflow-hidden text-slate-300 bg-slate-950">
                    <div className="py-4 pl-3 pr-2 text-slate-600 text-right font-light select-none text-[12px] bg-slate-950 border-r border-slate-900 min-w-[36px]">
                      {(convertedCode || '// Click "Run Conversion" on header or overlay to render Compose output...').split('\n').map((_, index) => (
                        <div key={index} className="h-6 leading-6">{index + 1}</div>
                      ))}
                    </div>

                    {convertedCode ? (
                      <pre className="flex-1 p-4 font-mono text-[13px] leading-6 overflow-y-auto select-text text-emerald-300 selection:bg-slate-800 overflow-x-auto whitespace-pre">
                        <code>{convertedCode}</code>
                      </pre>
                    ) : (
                      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center font-sans">
                        <div className="p-3 bg-blue-900/20 text-blue-400 rounded-full mb-3 shrink-0">
                          <Cpu className="w-8 h-8 animate-pulse" />
                        </div>
                        <h4 className="text-slate-200 font-bold text-sm">Compose Output Screen</h4>
                        <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-5 leading-normal">
                          This preview editor displays fully translated Jetpack Compose code with standard declarations, @Composable syntax layout, and mapped hooks.
                        </p>
                        <button
                          onClick={runCodeConversion}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Trigger Jetpack Compose Conversion
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Instruction Prompt Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 font-mono shrink-0">Custom Directives:</span>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g., 'Ensure state increments uses rem(0).', 'Change element backgrounds to use primary container colors', 'Inject click logs'..."
                  className="flex-1 text-xs text-slate-700 bg-transparent outline-none focus:ring-0 placeholder:text-slate-400"
                />
                <button
                  onClick={() => {
                    setCustomInstructions('');
                    setStatusBarMsg('Instructions cleared');
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-850 px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-50 font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </main>

          {/* Right Panel: Guide, Checklist & Dependencies */}
          <aside className="w-80 bg-white flex flex-col shrink-0 select-none border-l border-slate-200">
            {/* Header / Config controls */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                Integration Diagnostics
              </h3>
              <p className="text-xs text-slate-500 mt-1 lines-relaxed">Manage migration setup dependencies and checklists.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
              {/* Build Conversion Stats */}
              {conversionStats && (
                <section className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5">Gemini Processing Metrics</h4>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-emerald-800 font-medium">
                    <div>
                      <span className="text-[10px] text-emerald-600 uppercase block font-sans">Convert Time:</span>
                      <strong>{conversionStats.duration} seconds</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 uppercase block font-sans">Last Updated:</span>
                      <strong>{conversionStats.time}</strong>
                    </div>
                  </div>
                </section>
              )}

              {/* 1. Gradle Config box */}
              <section>
                <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  1. GRADLE DEPENDENCIES
                </h4>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 relative">
                  <button 
                    onClick={() => copyToClipboard(gradleDependencies.join('\n'), setCopiedCompose)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 shrink-0"
                    title="Copy dependencies block"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <p className="text-[11px] font-mono text-slate-800 leading-normal">
                    <span className="text-slate-400 block font-sans text-[9px] uppercase tracking-wider mb-1">dependencies &apos;app&apos; &#123;</span>
                    {gradleDependencies.map((dep, idx) => (
                      <span key={idx} className="block whitespace-pre select-text">  {dep}</span>
                    ))}
                    <span className="text-slate-400 block font-sans text-[9px] uppercase mt-1">&#125;</span>
                  </p>
                </div>
              </section>

              {/* 2. Dynamic Setup Checklist */}
              <section>
                <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                  2. SETUP VALIDATION CHECKLIST
                </h4>
                <ul className="space-y-2">
                  {checklistItems.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5 group">
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => toggleChecklistItem(item.id)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 cursor-pointer focus:ring-blue-500 focus:ring-1" 
                      />
                      <span className={`text-[11.5px] transition-colors leading-normal cursor-pointer select-none ${
                        item.completed ? 'text-slate-400 line-through' : 'text-slate-650 font-medium text-slate-700'
                      }`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 3. Conversion Explanation & Mappings */}
              <section className="border-t border-slate-200 pt-4">
                <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  3. ARCHITECTURAL OVERVIEW
                </h4>
                <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-lg">
                  <div className="text-[11.5px] text-blue-900 leading-normal select-text whitespace-pre-wrap markdown-explanation">
                    {designExplanation}
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      ) : activeTab === 'reference' ? (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 select-text max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Jetpack Compose Layout Reference</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              When migrating from web environments (React/HTML) or Android classic view templates (XML), here is how various standard elements translate directly into Compose components:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-xs text-blue-600 mb-2 uppercase tracking-wide">Layout & Containers</h3>
                <table className="w-full text-xs text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">React/HTML</td><td className="py-1.5 font-mono">&lt;div className=&quot;flex-col&quot;&gt;</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">Android XML</td><td className="py-1.5 font-mono">&lt;LinearLayout android:orientation=&quot;vertical&quot;&gt;</td></tr>
                    <tr className="bg-blue-50/40 text-blue-900 font-medium"><td className="py-2.5 pl-1.5 font-bold">Compose</td><td className="py-2.5 font-mono font-bold">Column &#123; ... &#125;</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-xs text-blue-600 mb-2 uppercase tracking-wide">Horizontal Row Stack</h3>
                <table className="w-full text-xs text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">React/HTML</td><td className="py-1.5 font-mono">&lt;div className=&quot;flex&quot;&gt; or &lt;span&gt;</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">Android XML</td><td className="py-1.5 font-mono">&lt;LinearLayout android:orientation=&quot;horizontal&quot;&gt;</td></tr>
                    <tr className="bg-blue-50/40 text-blue-900 font-medium"><td className="py-2.5 pl-1.5 font-bold">Compose</td><td className="py-2.5 font-mono font-bold">Row &#123; ... &#125;</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-xs text-blue-600 mb-2 uppercase tracking-wide">Inputs & Interactive Elements</h3>
                <table className="w-full text-xs text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">React/HTML</td><td className="py-1.5 font-mono">&lt;input type=&quot;text&quot; onChange=...&gt;</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">Android XML</td><td className="py-1.5 font-mono">&lt;EditText ...&gt;</td></tr>
                    <tr className="bg-blue-50/40 text-blue-900 font-medium"><td className="py-2.5 pl-1.5 font-bold">Compose</td><td className="py-2.5 font-mono font-bold">TextField(value, onValueChange)</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-xs text-blue-600 mb-2 uppercase tracking-wide">State Declarations</h3>
                <table className="w-full text-xs text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">React/HTML</td><td className="py-1.5 font-mono">const [count, setCount] = useState(0)</td></tr>
                    <tr className="border-b border-slate-200"><td className="py-1.5 font-semibold text-slate-500">Android XML</td><td className="py-1.5 font-mono">private var count = 0</td></tr>
                    <tr className="bg-blue-50/40 text-blue-900 font-medium"><td className="py-2.5 pl-1.5 font-bold">Compose</td><td className="py-2.5 font-mono font-bold">var count by remember &#123; mutableStateOf(0) &#125;</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-bold text-xs text-yellow-800 mb-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Note on Lifecycle Declarations
              </h4>
              <p className="text-[11.5px] text-yellow-700 leading-normal">
                Unlike web environments, Android Compose handles layout triggers internally by tracking state triggers. You do not need to manually refresh or redeclare the state trees. Simply updating any state variable tracked with <code>by remember &#123; mutableStateOf() &#125;</code> causes safe layout recalculations immediately!
              </p>
            </div>
          </div>
        </div>
      ) : activeTab === 'integration' ? (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 select-text max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Terminal className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">Gradle Integration Guide</h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              If you are integrating Jetpack Compose into an existing conventional Android Studio project for the first time, you must follow these step-by-step specifications inside your module-level <code>build.gradle</code>:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wide text-slate-500 mb-2">Step 1: Enable Compose Build Features</h3>
                <pre className="bg-slate-900 text-yellow-200 p-3 rounded font-mono text-xs overflow-x-auto">
{`android {
    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}`}
                </pre>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-wide text-slate-500 mb-2">Step 2: Add Compiler and Runtime Dependencies</h3>
                <pre className="bg-slate-900 text-teal-300 p-3 rounded font-mono text-xs overflow-x-auto">
{`dependencies {
    // Jetpack Compose BoM (Bill of Materials)
    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    // Core libraries
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'calendar' ? (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 select-text w-full">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header description */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LucideCalendar className="w-5 h-5" />
                  Google Calendar Lifecycle Sync
                </h2>
                <p className="text-xs text-blue-100 mt-1 max-w-xl">
                  Connect your development calendar to schedule, organize, and sync your Android Jetpack Compose conversion milestones. Put deadlines, testing queues, and architecture sprints straight onto your schedule.
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
                  <span>Connect Google Calendar</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11px] font-mono text-blue-100">Live Connection</p>
                    <p className="text-xs font-bold">{calendarUser.email}</p>
                  </div>
                  <button 
                    onClick={handleCalendarLogout}
                    className="p-2 bg-blue-800/60 hover:bg-red-650 rounded-lg text-white transition-all cursor-pointer border border-blue-500/30 font-medium text-xs flex items-center gap-1"
                    title="Disconnect google login session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Indicators */}
            {calendarError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 select-text">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h5 className="font-bold">Sync Connection Diagnostic:</h5>
                  <p>{calendarError}</p>
                  <button 
                    onClick={() => {
                      if (calendarToken) {
                        loadCalendarData(calendarToken, selectedCalendarId);
                      } else {
                        handleCalendarLogin();
                      }
                    }}
                    className="mt-1.5 px-2.5 py-1 bg-red-100 hover:bg-red-200 rounded text-[10px] font-semibold text-red-800 transition-colors"
                  >
                    Attempt Retry Sync Connection
                  </button>
                </div>
              </div>
            )}

            {!calendarUser ? (
              /* Signed Out Showcase view */
              <div className="border border-slate-200 bg-white rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LucideCalendar className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Authorize Google Workspace Services</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Sign in with Google securely to view your upcoming agenda calendars, read milestone lists, and push dev sprints automatically. The application stores access tokens strictly in memory under safe guidelines.
                </p>
                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={handleCalendarLogin}
                    disabled={calendarLoading}
                    className="gsi-material-button hover:shadow-md border border-slate-200 hover:bg-slate-50 transition-all font-semibold rounded-lg px-6 py-3 shrink-0 text-xs flex items-center gap-3 cursor-pointer"
                  >
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-[18px] h-[18px]">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700 font-sans text-xs">Sign in with Google</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Signed In Dashboard Layout */
              <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* Side 1: Create Milestone calendar item */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <CalendarPlus className="w-4 h-4 text-blue-600" />
                      Add Sandbox Milestone
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Write an upcoming conversion milestone straight to your calendar.</p>
                  </div>

                  <form onSubmit={handleCreateEvent} className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Target Active Calendar</label>
                      <select 
                        value={selectedCalendarId}
                        onChange={(e) => {
                          setSelectedCalendarId(e.target.value);
                          if (calendarToken) loadCalendarData(calendarToken, e.target.value);
                        }}
                        className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {calendarsList.map((cal) => (
                          <option key={cal.id} value={cal.id}>
                            {cal.summary} {cal.primary ? '(Primary)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Milestone Event Title</label>
                      <input 
                        type="text" 
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="e.g. Complete MainActivity.kt Compose Migration"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">Date</label>
                        <input 
                          type="date" 
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">Location</label>
                        <input 
                          type="text" 
                          value={newEventLocation}
                          onChange={(e) => setNewEventLocation(e.target.value)}
                          placeholder="e.g. Android IDE Workstation"
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">Start Time</label>
                        <input 
                          type="time" 
                          value={newEventStartTime}
                          onChange={(e) => setNewEventStartTime(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">End Time</label>
                        <input 
                          type="time" 
                          value={newEventEndTime}
                          onChange={(e) => setNewEventEndTime(e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Description / Design Memo</label>
                      <textarea 
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="Detail layout architecture maps, requirements, checklists, or key sprint logs..."
                        rows={4}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={calendarLoading}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer text-xs active:scale-95 disabled:bg-blue-400"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      {calendarLoading ? 'Syncing...' : 'Add Milestone event to Calendar'}
                    </button>
                  </form>
                </div>

                {/* Side 2: Live Agenda events List */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        Milestone Agenda Schedule
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Upcoming migration, test run, or integration timeline blocks.</p>
                    </div>

                    <button 
                      onClick={() => calendarToken && loadCalendarData(calendarToken, selectedCalendarId)}
                      disabled={calendarLoading}
                      className="p-1 px-2.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="Sync Events with Google Calendar"
                    >
                      <RefreshCw className={`w-3 h-3 text-slate-500 ${calendarLoading ? 'animate-spin' : ''}`} />
                      <span>Sync</span>
                    </button>
                  </div>

                  {calendarLoading && calendarEventsList.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs text-center font-sans space-y-2">
                      <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
                      <p>Calling the Google Calendar API...</p>
                    </div>
                  ) : calendarEventsList.length === 0 ? (
                    <div className="py-12 text-center max-w-sm mx-auto space-y-2 text-slate-400 select-none">
                      <CalendarX className="w-9 h-9 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-slate-700 text-xs">No Scheduled Events</h4>
                      <p className="text-[11px]">There are no upcoming milestones scheduled on this calendar list. Create one using the form on the left, or pre-fill using the file templates!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1.5 scrollbar-thin">
                      {calendarEventsList.map((event) => {
                        const startObj = event.start.dateTime || event.start.date || '';
                        const endObj = event.end.dateTime || event.end.date || '';
                        const dateFormatted = startObj ? new Date(startObj).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A';
                        
                        const startTimeFormatted = event.start.dateTime ? new Date(startObj).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'All-Day Event';

                        const endTimeFormatted = event.end.dateTime ? new Date(endObj).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : null;

                        const isComposeMilestone = event.summary.toLowerCase().includes('compose') || event.summary.toLowerCase().includes('android');

                        return (
                          <div 
                            key={event.id}
                            className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 relative overflow-hidden ${
                              isComposeMilestone 
                                ? 'bg-blue-50/40 border-blue-100 hover:bg-blue-50/80' 
                                : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50/80'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                                  isComposeMilestone 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {isComposeMilestone ? 'Android Sprint' : 'Milestone'}
                                </span>
                                {event.location && (
                                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                                    📍 {event.location}
                                  </span>
                                )}
                              </div>
                              
                              <h4 className="font-bold text-xs text-slate-800 leading-tight">{event.summary}</h4>
                              
                              {event.description && (
                                <p className="text-[10.5px] text-slate-500 font-mono select-text whitespace-pre-wrap max-h-16 overflow-y-auto mt-1 scrollbar-thin">
                                  {event.description}
                                </p>
                              )}

                              <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-medium pt-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{dateFormatted}</span>
                                <span>•</span>
                                <span>{startTimeFormatted}{endTimeFormatted ? ` - ${endTimeFormatted}` : ''}</span>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {event.htmlLink && (
                                <a 
                                  href={event.htmlLink}
                                  target="_blank"
                                  referrerPolicy="no-referrer"
                                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-100/50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors text-center"
                                >
                                  View on Calendar
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteEvent(event.id, event.summary)}
                                className="p-1 px-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                                title="Delete Milestone"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      ) : activeTab === 'gmail' ? (
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 select-text w-full">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header description */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-100" />
                  Google Gmail Workspace Hub
                </h2>
                <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                  Synchronize and review developer email exchanges, search incoming briefs, or send your converted Jetpack Compose code packages and build specs directly using Gmail.
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
                  <span>Connect Google Gmail</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11px] font-mono text-emerald-100 animate-pulse">Live Link Active</p>
                    <p className="text-xs font-bold">{calendarUser.email}</p>
                  </div>
                  <button 
                    onClick={handleCalendarLogout}
                    className="p-2 bg-emerald-800/65 hover:bg-emerald-750 rounded-lg text-white transition-all cursor-pointer border border-emerald-500/20 font-medium text-xs flex items-center gap-1.5"
                    title="Disconnect google login session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Indicators */}
            {gmailError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5 select-text">
                <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h5 className="font-bold">Gmail Connection Diagnostic:</h5>
                  <p>{gmailError}</p>
                  <button 
                    onClick={() => {
                      if (calendarToken) {
                        loadGmailData(calendarToken);
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
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 font-sans">Authorize Google Gmail Integration</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Sign in with Google to retrieve dev inbox briefs, check email reports, or send completed Compose layout sheets directly to your teammates. Safe in-memory token transport.
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
                
                {/* Column A (Left 5 cols): Inbox List */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 border-none shadow-sm p-4 flex flex-col h-[580px]">
                  
                  {/* Search and Compose Header actions */}
                  <div className="border-b border-slate-100 pb-3.5 mb-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <Inbox className="w-4 h-4 text-emerald-600" />
                        Developer Inbox
                      </h3>
                      <button
                        onClick={() => {
                          setShowGmailComposer(true);
                          setSelectedGmailMessage(null);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-750 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>Compose Mail</span>
                      </button>
                    </div>

                    {/* Filter and Search box */}
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={gmailSearchQuery}
                          onChange={(e) => setGmailSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && calendarToken) {
                              loadGmailData(calendarToken, gmailSearchQuery);
                            }
                          }}
                          placeholder="Search inbox (hit Enter)..."
                          className="w-full text-[11.5px] pl-3 pr-14 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-sans bg-slate-50-30"
                        />
                        <button
                          onClick={() => calendarToken && loadGmailData(calendarToken, gmailSearchQuery)}
                          className="absolute right-1 text-[10px] bg-slate-100 hover:bg-slate-250 hover:text-slate-800 px-1.5 py-0.5 h-5.5 top-1/2 -translate-y-1/2 rounded text-slate-500 font-semibold cursor-pointer"
                        >
                          Find
                        </button>
                      </div>
                      
                      <button
                        onClick={() => calendarToken && loadGmailData(calendarToken)}
                        disabled={gmailLoading}
                        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0 transition-colors"
                        title="Reload Inbox"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${gmailLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Message Item List */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-2 last-padding-bottom">
                    {gmailLoading && gmailMessages.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-xs text-center font-sans space-y-2">
                        <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                        <p className="font-mono text-[11px] text-slate-500">Syncing secure connection...</p>
                      </div>
                    ) : gmailMessages.length === 0 ? (
                      <div className="py-16 text-center max-w-xs mx-auto space-y-2.5 text-slate-400 select-none">
                        <Mail className="w-8 h-8 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-slate-650 text-xs text-slate-705">Inbox Clean</h4>
                        <p className="text-[10px] leading-relaxed">No emails resolved in your selection pool. Click Compose to transmit your Kotlin templates!</p>
                      </div>
                    ) : (
                      gmailMessages.map((msg) => {
                        const isSelected = selectedGmailMessage?.id === msg.id && !showGmailComposer;
                        return (
                          <div
                            key={msg.id}
                            onClick={() => {
                              setSelectedGmailMessage(msg);
                              setShowGmailComposer(false);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative overflow-hidden ${
                              isSelected
                                ? 'bg-emerald-50/50 border-emerald-250 shadow-xs'
                                : 'bg-slate-50/40 border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[11px] font-bold text-slate-800 truncate block max-w-[140px]">{msg.from.split(' <')[0]}</span>
                              <span className="text-[9px] font-mono text-slate-400 shrink-0">{msg.date.split(', ')[1]?.substring(0, 11) || msg.date.substring(0, 11)}</span>
                            </div>
                            <h4 className="text-[11px] font-bold text-slate-700 truncate line-clamp-1 leading-tight mb-1">{msg.subject}</h4>
                            <p className="text-[10px] text-slate-500 truncate line-clamp-1 leading-normal">{msg.snippet}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Column B (Right 7 cols): Detailed viewing/Composing area */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 border-none shadow-sm p-5 flex flex-col h-[580px] overflow-hidden">
                  
                  {showGmailComposer ? (
                    /* COMPOSER SCREEN */
                    <form onSubmit={handleSendGmailEmail} className="flex flex-col h-full space-y-3">
                      <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between shrink-0">
                        <div>
                          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-emerald-600" />
                            Compose Review Deliverable
                          </h3>
                          <p className="text-[10px] text-slate-400">Share completed build files, code templates, or meeting reports.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowGmailComposer(false);
                            if (gmailMessages.length > 0 && !selectedGmailMessage) {
                              setSelectedGmailMessage(gmailMessages[0]);
                            }
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Inbox View
                        </button>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto pr-1 py-1 scrollbar-thin">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Recipients (Email)</label>
                          <input
                            type="email"
                            value={gmailTo}
                            onChange={(e) => setGmailTo(e.target.value)}
                            placeholder="colleague@example.com"
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Subject Line</label>
                          <input
                            type="text"
                            value={gmailSubject}
                            onChange={(e) => setGmailSubject(e.target.value)}
                            placeholder="Kotlin Jetpack Compose Converted Layout Package"
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                            required
                          />
                        </div>

                        <div className="flex flex-col h-64">
                          <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Email Content (HTML Supported)</label>
                          <textarea
                            value={gmailBody}
                            onChange={(e) => setGmailBody(e.target.value)}
                            placeholder="Pre-filled code, design parameters, and Gradle scopes will load here automatically..."
                            className="w-full flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans text-slate-700 bg-slate-50/50"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={gmailLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs shrink-0 active:scale-95 font-sans"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {gmailLoading ? 'Sending Email Dispatch...' : 'Dispatch secure cargo email'}
                      </button>
                    </form>
                  ) : selectedGmailMessage ? (
                    /* DEEP DETAILS READING SCREEN */
                    <div className="flex flex-col h-full">
                      <div className="border-b border-slate-100 pb-3 mb-3 shrink-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-[13px] text-slate-850 leading-snug select-text text-slate-800">{selectedGmailMessage.subject}</h3>
                          <button
                            onClick={() => {
                              setGmailTo(selectedGmailMessage.from.match(/<([^>]+)>/)?.[1] || selectedGmailMessage.from);
                              setGmailSubject(`Re: ${selectedGmailMessage.subject}`);
                              setGmailBody(
                                `<br/><p>Hi,</p>` +
                                `<p>Thank you for sending this layout review. Here is my assessment...</p>` +
                                `<hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />` +
                                `<blockquote>` +
                                `<strong>From:</strong> ${selectedGmailMessage.from}<br/>` +
                                `<strong>Date:</strong> ${selectedGmailMessage.date}<br/>` +
                                `<strong>Subject:</strong> ${selectedGmailMessage.subject}<br/><br/>` +
                                `${selectedGmailMessage.body}` +
                                `</blockquote>`
                              );
                              setShowGmailComposer(true);
                            }}
                            className="text-[10.5px] bg-slate-50 hover:bg-emerald-55 hover:text-emerald-700 transition-colors border border-slate-200 hover:border-emerald-250 px-3 py-1 rounded-lg font-bold shrink-0 text-slate-600 cursor-pointer active:scale-95"
                          >
                            Reply
                          </button>
                        </div>
                        <div className="flex flex-col text-[10.5px] text-slate-500 font-medium space-y-0.5 mt-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-405 text-slate-400">From Sender:</span>
                            <span className="text-slate-700 select-text font-mono font-semibold">{selectedGmailMessage.from}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-405 text-slate-400">Date Received:</span>
                            <span className="text-slate-650">{selectedGmailMessage.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Decoded content message sandbox scroll */}
                      <div className="flex-1 overflow-y-auto border border-slate-200 bg-slate-50 rounded-xl leading-relaxed text-xs text-slate-700 select-text scrollbar-thin">
                        {selectedGmailMessage.body.includes('</') || selectedGmailMessage.body.includes('<p>') ? (
                          <div 
                            className="p-5 overflow-x-auto break-all select-text font-sans leading-relaxed text-slate-700 gmail-body-content animate-fade-in"
                            dangerouslySetInnerHTML={{ __html: selectedGmailMessage.body }}
                          />
                        ) : (
                          <div className="p-5 font-sans whitespace-pre-wrap select-text leading-relaxed text-slate-700">
                            {selectedGmailMessage.body}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* DEFAULTS EMPTY SCREEN */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 text-center select-none">
                      <Mail className="w-10 h-10 text-slate-200 mb-2" />
                      <h4 className="font-bold text-slate-700 text-xs">No Message Selected</h4>
                      <p className="text-[10.5px] max-w-xs mt-1 leading-relaxed text-slate-500 font-sans">
                        Select an existing email thread from the inbox list on the left, or click **"Compose Mail"** to craft a secure review deliverable package!
                      </p>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        </div>
      ) : (
        <GoogleChatHub
          calendarUser={calendarUser}
          calendarToken={calendarToken}
          calendarLoading={calendarLoading}
          chatSpaces={chatSpaces}
          selectedSpaceName={selectedSpaceName}
          setSelectedSpaceName={setSelectedSpaceName}
          chatMessages={chatMessages}
          chatLoading={chatLoading}
          chatError={chatError}
          newChatMessageText={newChatMessageText}
          setNewChatMessageText={setNewChatMessageText}
          handleCalendarLogin={handleCalendarLogin}
          handleCalendarLogout={handleCalendarLogout}
          loadChatData={loadChatData}
          loadSpaceMessages={loadSpaceMessages}
          handleSendChatMessageSubmit={handleSendChatMessageSubmit}
        />
      )}

      {/* Footer Status Bar Section */}
      <footer className="h-6 bg-blue-600 text-white flex items-center justify-between px-4 text-[10.5px] font-mono shrink-0 select-none z-10 shadow-inner">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-semibold">
            <span className={`w-1.5 h-1.5 rounded-full bg-white ${loading ? 'animate-ping' : ''}`}></span>
            Build: {buildStatus === 'building' ? 'Analyzing Code...' : buildStatus === 'successful' ? 'Successful' : 'Idle'}
          </span>
          <span className="hidden sm:inline">Gradle Version: 8.5</span>
          <span className="text-[9.5px] bg-blue-700 px-1.5 py-0.5 rounded text-blue-100 font-bold hidden md:inline">SDK API 34</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden hover:text-blue-100 cursor-pointer lg:inline">{statusBarMsg}</span>
          <span className="border-l border-blue-500 pl-4">UTF-8</span>
          <span>Line {cursorPos.line}, Col {cursorPos.col}</span>
        </div>
      </footer>

      {/* Styled Add Modal for adding custom file templates */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden m-4">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-800">Add Simulated Source File</h3>
            </div>
            
            <form onSubmit={createSimulatedFile} className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">File Name</label>
                <input 
                  type="text" 
                  value={newUserFileName}
                  onChange={(e) => setNewUserFileName(e.target.value)}
                  placeholder="e.g. ShoppingCartPanel"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">File Template Type</label>
                <select 
                  value={newUserFileType}
                  onChange={(e) => setNewUserFileType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="react">React Component (.tsx)</option>
                  <option value="kotlin">Kotlin Android View (.kt)</option>
                  <option value="xml">Android Layout XML (.xml)</option>
                  <option value="html">HTML Form (.html)</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
