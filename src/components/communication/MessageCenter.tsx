import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, Filter, ChevronDown, Paperclip, 
  Send, Smile, MoreVertical, Star, Clock, ArrowLeft, 
  Phone, Mail, Download, Reply, User, Plus, X
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import MessageComposer from './MessageComposer';
import MessageTemplates from './MessageTemplates';
import QuickReplies from './QuickReplies';
import type { Lead, Communication } from '../../types';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    type: string;
    url: string;
    size: string;
  }[];
  isRead: boolean;
  isStarred: boolean;
}

interface Conversation {
  id: string;
  lead: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  isStarred: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    lead: {
      id: '101',
      name: 'Sarah Thompson',
      email: 'sarah.t@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    lastMessage: {
      content: 'I\'m interested in learning more about the term life policy options you mentioned.',
      timestamp: '2024-03-25T14:30:00Z',
      isRead: false
    },
    isStarred: true,
    messages: [
      {
        id: '1001',
        sender: {
          id: 'agent1',
          name: 'John Smith',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Hello Sarah, thank you for your interest in our life insurance policies. Would you like to schedule a call to discuss your options?',
        timestamp: '2024-03-24T10:15:00Z',
        isRead: true,
        isStarred: false
      },
      {
        id: '1002',
        sender: {
          id: '101',
          name: 'Sarah Thompson',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Yes, that would be great. Could you send me some information about your policies first?',
        timestamp: '2024-03-24T11:30:00Z',
        isRead: true,
        isStarred: false
      },
      {
        id: '1003',
        sender: {
          id: 'agent1',
          name: 'John Smith',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Of course! I\'ve attached our policy brochure that outlines our term life, whole life, and universal life options. Let me know if you have any questions.',
        timestamp: '2024-03-24T13:45:00Z',
        attachments: [
          {
            name: 'Life_Insurance_Policies.pdf',
            type: 'application/pdf',
            url: '#',
            size: '2.4 MB'
          }
        ],
        isRead: true,
        isStarred: true
      },
      {
        id: '1004',
        sender: {
          id: '101',
          name: 'Sarah Thompson',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'I\'m interested in learning more about the term life policy options you mentioned.',
        timestamp: '2024-03-25T14:30:00Z',
        isRead: false,
        isStarred: false
      }
    ]
  },
  {
    id: '2',
    lead: {
      id: '102',
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    lastMessage: {
      content: 'Thanks for sending the quote. I\'ll review it and get back to you tomorrow.',
      timestamp: '2024-03-24T16:45:00Z',
      isRead: true
    },
    isStarred: false,
    messages: [
      {
        id: '2001',
        sender: {
          id: 'agent1',
          name: 'John Smith',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Hello Michael, based on our conversation yesterday, I\'ve prepared a quote for your auto and home insurance bundle.',
        timestamp: '2024-03-24T09:30:00Z',
        isRead: true,
        isStarred: false
      },
      {
        id: '2002',
        sender: {
          id: 'agent1',
          name: 'John Smith',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Here\'s the detailed quote with coverage options and discounts applied.',
        timestamp: '2024-03-24T09:32:00Z',
        attachments: [
          {
            name: 'Insurance_Quote_Chen.pdf',
            type: 'application/pdf',
            url: '#',
            size: '1.8 MB'
          }
        ],
        isRead: true,
        isStarred: false
      },
      {
        id: '2003',
        sender: {
          id: '102',
          name: 'Michael Chen',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'Thanks for sending the quote. I\'ll review it and get back to you tomorrow.',
        timestamp: '2024-03-24T16:45:00Z',
        isRead: true,
        isStarred: false
      }
    ]
  },
  {
    id: '3',
    lead: {
      id: '103',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    lastMessage: {
      content: 'I\'ve signed the application form and attached it here.',
      timestamp: '2024-03-23T11:20:00Z',
      isRead: true
    },
    isStarred: true,
    messages: [
      {
        id: '3001',
        sender: {
          id: '103',
          name: 'Emily Davis',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: 'I\'ve signed the application form and attached it here.',
        timestamp: '2024-03-23T11:20:00Z',
        attachments: [
          {
            name: 'Signed_Application.pdf',
            type: 'application/pdf',
            url: '#',
            size: '3.2 MB'
          }
        ],
        isRead: true,
        isStarred: false
      }
    ]
  }
];

export default function MessageCenter() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleStarConversation = (conversationId: string) => {
    setConversations(conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isStarred: !conv.isStarred } 
        : conv
    ));
  };

  const handleStarMessage = (messageId: string) => {
    if (!selectedConversation) return;
    
    const updatedMessages = selectedConversation.messages.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    );
    
    setSelectedConversation({
      ...selectedConversation,
      messages: updatedMessages
    });
    
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, messages: updatedMessages } 
        : conv
    ));
  };

  const handleSendMessage = (content: string, attachments?: any[]) => {
    if (!selectedConversation || !content.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: {
        id: 'agent1',
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      attachments
    };
    
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: {
        content,
        timestamp: new Date().toISOString(),
        isRead: true
      }
    };
    
    setSelectedConversation(updatedConversation);
    
    setConversations(conversations.map(conv => 
      conv.id === selectedConversation.id ? updatedConversation : conv
    ));
    
    setNewMessage('');
  };

  const handleSelectTemplate = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  const handleSelectQuickReply = (reply: string) => {
    handleSendMessage(reply);
    setShowQuickReplies(false);
  };

  const handleStartNewConversation = (lead: Lead) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => conv.lead.id === lead.id);
    
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        lastMessage: {
          content: 'New conversation started',
          timestamp: new Date().toISOString(),
          isRead: true
        },
        isStarred: false,
        messages: []
      };
      
      setConversations([newConversation, ...conversations]);
      setSelectedConversation(newConversation);
    }
    
    setShowNewMessage(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         conv.lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return matchesSearch && conv.lastMessage.isRead === false;
    if (filter === 'starred') return matchesSearch && conv.isStarred;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)] min-h-[600px]">
          {/* Conversation List */}
          <div className={`w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <button 
                  onClick={() => setShowNewMessage(true)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex mt-4 space-x-2">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread</option>
                    <option value="starred">Starred</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-500" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-1 text-gray-500 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
                </button>
              </div>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Range
                    </label>
                    <div className="flex space-x-2">
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input 
                        type="date" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Has Attachments
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="has_attachments"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="has_attachments" className="ml-2 block text-sm text-gray-900">
                        Only show messages with attachments
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={conversation.lead.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.lead.name)}&background=random`}
                            alt={conversation.lead.name}
                            className="h-10 w-10 rounded-full"
                          />
                          {!conversation.lastMessage.isRead && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white"></span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{conversation.lead.name}</p>
                          <p className="text-xs text-gray-500">{conversation.lead.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarConversation(conversation.id);
                          }}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          <Star className={`h-4 w-4 ${conversation.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </button>
                        <span className="text-xs text-gray-500 mt-1">
                          {format(new Date(conversation.lastMessage.timestamp), 'MMM d')}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Conversation Detail */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <img
                    src={selectedConversation.lead.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.lead.name)}&background=random`}
                    alt={selectedConversation.lead.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedConversation.lead.name}</p>
                    <p className="text-xs text-gray-500">{selectedConversation.lead.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender.id === 'agent1' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.sender.id === 'agent1' ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-start">
                        {message.sender.id !== 'agent1' && (
                          <img
                            src={message.sender.avatar}
                            alt={message.sender.name}
                            className="h-8 w-8 rounded-full mr-2 mt-1"
                          />
                        )}
                        <div>
                          <div className={`p-3 rounded-lg ${
                            message.sender.id === 'agent1' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center p-2 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                  <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                    <p className="text-xs text-gray-500">{attachment.size}</p>
                                  </div>
                                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <Download className="h-4 w-4 text-gray-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-gray-500">
                              {format(new Date(message.timestamp), 'h:mm a')}
                            </span>
                            <button 
                              onClick={() => handleStarMessage(message.id)}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              <Star className={`h-3 w-3 ${message.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                            </button>
                            <button className="text-gray-400 hover:text-blue-500">
                              <Reply className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-start space-x-2">
                  <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full p-3 focus:outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between p-2 bg-gray-50 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Paperclip className="h-5 w-5 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Smile className="h-5 w-5 text-gray-500" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <MessageSquare className="h-5 w-5 text-gray-500" />
                          </button>
                          {showTemplates && (
                            <MessageTemplates 
                              onSelect={handleSelectTemplate}
                              onClose={() => setShowTemplates(false)}
                            />
                          )}
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setShowQuickReplies(!showQuickReplies)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Clock className="h-5 w-5 text-gray-500" />
                          </button>
                          {showQuickReplies && (
                            <QuickReplies 
                              onSelect={handleSelectQuickReply}
                              onClose={() => setShowQuickReplies(false)}
                            />
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendMessage(newMessage)}
                        disabled={!newMessage.trim()}
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                          newMessage.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                        }`}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="text-sm text-gray-500 mt-1">Choose a conversation from the list or start a new one</p>
                <button 
                  onClick={() => setShowNewMessage(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">New Message</h3>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Lead
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a lead</option>
                      {leads.map(lead => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name} - {lead.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or search by name/email
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {leads.slice(0, 5).map(lead => (
                    <div 
                      key={lead.id}
                      onClick={() => handleStartNewConversation(lead)}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}