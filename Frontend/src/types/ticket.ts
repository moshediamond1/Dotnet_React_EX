export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  customerEmail: string;
  resolution?: string;
  createdAt: string;
  updatedAt?: string;
  summary?: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  customerEmail: string;
}

export interface UpdateTicketInput {
  status?: string;
  resolution?: string;
}
