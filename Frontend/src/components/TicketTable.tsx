import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Ticket } from '../types/ticket';
import { statusColors } from '../constants/statusColors';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export function TicketTable({ tickets, isLoading }: TicketTableProps) {
  if (isLoading) return <div className="flex justify-center items-center py-12"><div className="text-gray-500">Loading tickets...</div></div>;
  if (tickets.length === 0) return <div className="flex justify-center items-center py-12"><div className="text-gray-500">No tickets found.</div></div>;

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Summary</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{ticket.title}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status].bg} ${statusColors[ticket.status].text}`}>{ticket.status}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{ticket.customerEmail}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={ticket.summary || 'No summary available'}>
                {ticket.summary || <span className="text-gray-400 italic">No summary</span>}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(ticket.createdAt).toLocaleDateString()}</td>
              <td><Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-800"><ChevronRight size={20} /></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
