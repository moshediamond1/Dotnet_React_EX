import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { CreateTicketInput } from '../types/ticket';
import { FormField } from './FormField';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: CreateTicketInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateTicketModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateTicketModalProps) {
  const { register, handleSubmit, reset } = useForm<CreateTicketInput>({
    defaultValues: {
      title: '',
      description: '',
      customerEmail: '',
    },
  });

  const handleFormSubmit = async (data: CreateTicketInput) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <Dialog.Title className="text-lg font-semibold">Create New Ticket</Dialog.Title>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
                <FormField label="Title" id="title" placeholder="Brief title..." register={register('title', { required: true })} />
                <FormField label="Description" id="description" rows={4} placeholder="Describe the issue..." register={register('description', { required: true })} />
                <FormField label="Email" id="customerEmail" type="email" placeholder="customer@example.com" register={register('customerEmail', { required: true })} />
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Creating...' : 'Create'}</button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
