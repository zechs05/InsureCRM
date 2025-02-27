export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  source: 'facebook' | 'referral' | 'website' | 'other';
  policyType: string;
  coverageAmount: number;
  notes: string;
  createdAt: string;
  lastContactedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'agent' | 'admin' | 'manager';
  email: string;
  phone?: string;
  avatar: string;
  bio?: string;
  department?: string;
  accessLevel?: 'view' | 'edit' | 'admin';
  joinedAt?: string;
  lastActive?: string;
  created_at?: string;
  performance: {
    leadsAssigned: number;
    leadsClosed: number;
    revenue: number;
  };
}

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  type: 'initial' | 'follow_up' | 'policy_review';
  date: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Goal {
  id: string;
  type: 'revenue' | 'leads' | 'policies';
  target: number;
  current: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call';
  lead_id: string;
  lead: {
    name: string;
    email: string;
    phone: string;
  };
  content: string;
  subject?: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'failed' | 'scheduled';
  template_id?: string;
  scheduled_at?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface CallOutcome {
  id: string;
  call_id: string;
  status: 'completed' | 'no_answer' | 'rescheduled' | 'cancelled';
  duration_actual: number;
  notes: string;
  follow_up_needed: boolean;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  occupation?: string;
  income?: number;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  dependents?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedAgentId?: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  clientId: string;
  type: 'term_life' | 'whole_life' | 'universal_life' | 'auto' | 'home' | 'health' | 'disability' | 'other';
  status: 'active' | 'pending' | 'cancelled' | 'expired' | 'lapsed';
  startDate: string;
  endDate: string;
  renewalDate: string;
  premium: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  coverageAmount: number;
  deductible?: number;
  beneficiaries?: string[];
  documents?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedAgentId?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  clientId: string;
  claimNumber: string;
  type: string;
  status: 'submitted' | 'under_review' | 'approved' | 'denied' | 'paid';
  filedDate: string;
  incidentDate: string;
  description: string;
  amount: number;
  approvedAmount?: number;
  documents?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedAgentId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'task';
  with?: string;
  date: Date;
  time: string;
  duration: number;
  location?: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  coverage: string;
  age: number;
  dateOfBirth: string;
  smoker: boolean;
  assignedTeamMemberId?: string;
  assignedTeamMember?: TeamMember;
  source: 'facebook' | 'referral' | 'website' | 'manual' | 'other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}