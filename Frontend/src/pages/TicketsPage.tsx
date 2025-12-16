import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ticketsService } from '../services/tickets.service';
import { TicketTable } from '../components/TicketTable';
import { TicketFilters } from '../components/TicketFilters';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { CreateTicketInput } from '../types/ticket';
import { useAuth } from '../hooks/useAuth';

export function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets', status, search],
    queryFn: () => ticketsService.getAll(status || undefined, search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: (ticket: CreateTicketInput) => ticketsService.create(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setIsModalOpen(false);
    },
  });

  const handleCreateTicket = async (ticket: CreateTicketInput) => {
    createMutation.mutate(ticket);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
            <p className="text-gray-600 mt-1">Manage customer support tickets</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            New Ticket
          </button>
        </div>
        <TicketFilters status={status} search={search} onStatusChange={setStatus} onSearchChange={setSearch} />
        <div className="bg-white rounded-lg">
          <TicketTable tickets={tickets} isLoading={isLoading} />
        </div>
        {isAuthenticated && <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"><p className="text-sm text-blue-800">✓ Admin logged in - you can view and update tickets</p></div>}
      </div>
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateTicket} isLoading={createMutation.isPending} />
    </div>
  );
}
