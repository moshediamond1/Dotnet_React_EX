import {apiClient} from './api';
import { Ticket, CreateTicketInput, UpdateTicketInput } from '../types/ticket';

export const ticketsService = {
  async getAll(status?: string, search?: string): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await apiClient.get(`/tickets?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Ticket> {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },

  async create(ticket: CreateTicketInput): Promise<Ticket> {
    const response = await apiClient.post('/tickets', ticket);
    return response.data;
  },

  async update(id: string, updates: UpdateTicketInput): Promise<Ticket> {
    const response = await apiClient.put(`/tickets/${id}`, updates);
    return response.data;
  },
};
