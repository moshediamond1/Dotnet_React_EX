import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader } from 'lucide-react';
import { ticketsService } from '../services/tickets.service';
import { StatusSelect } from '../components/StatusSelect';
import { useAuth } from '../hooks/useAuth';
import { UpdateTicketInput } from '../types/ticket';
import { statusColors } from '../constants/statusColors';

export function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [resolutionText, setResolutionText] = useState('');

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketsService.getById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: UpdateTicketInput) => ticketsService.update(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setResolutionText('');
    },
  });

  const handleStatusChange = (newStatus: string) => {
    updateMutation.mutate({ status: newStatus });
  };

  const handleResolve = () => {
    if (resolutionText.trim()) {
      updateMutation.mutate({
        status: 'Resolved',
        resolution: resolutionText,
      });
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader className="animate-spin text-gray-500" size={32} /></div>;
  if (!ticket) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Ticket not found</p>
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800">Back to Tickets</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft size={20} />
          Back to Tickets
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
              <p className="text-gray-600">ID: {ticket.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status].bg} ${statusColors[ticket.status].text}`}>
              {ticket.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Customer Email</p>
              <div className="text-gray-900 font-medium">{ticket.customerEmail}</div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <div className="text-gray-900 font-medium">{new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
            {ticket.updatedAt && (
              <div>
                <p className="text-sm text-gray-600">Updated</p>
                <div className="text-gray-900 font-medium">{new Date(ticket.updatedAt).toLocaleString()}</div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.summary && (
            <div className="mb-8 p-4 border rounded-lg bg-blue-50 border-blue-200 text-blue-900">
              <h3 className="text-sm font-semibold mb-2">AI Summary</h3>
              <p className="text-blue-800">{ticket.summary}</p>
            </div>
          )}

          {ticket.resolution && (
            <div className="mb-8 p-4 border rounded-lg bg-green-50 border-green-200 text-green-900">
              <h3 className="text-sm font-semibold mb-2">Resolution</h3>
              <p className="text-green-800">{ticket.resolution}</p>
            </div>
          )}

          {isAuthenticated && ticket.status !== 'Closed' && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                  <StatusSelect value={ticket.status} onChange={handleStatusChange} disabled={updateMutation.isPending} />
                </div>
                {ticket.status !== 'Resolved' && !ticket.resolution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                    <textarea value={resolutionText} onChange={(e) => setResolutionText(e.target.value)} disabled={updateMutation.isPending} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" placeholder="Describe the resolution..." />
                    <button onClick={handleResolve} disabled={updateMutation.isPending || !resolutionText.trim()} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">{updateMutation.isPending ? 'Updating...' : 'Mark as Resolved'}</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
