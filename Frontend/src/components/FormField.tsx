import { LucideIcon } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  Icon?: LucideIcon;
  register: UseFormRegisterReturn;
  rows?: number;
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const inputWithIconClass = 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export function FormField({ label, id, type = 'text', placeholder, Icon, register, rows }: FormFieldProps) {
  const Component = rows ? 'textarea' : 'input';
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 text-gray-400" size={20} />}
        <Component {...register} type={rows ? undefined : type} id={id} placeholder={placeholder} rows={rows} className={Icon ? inputWithIconClass : inputClass} />
      </div>
    </div>
  );
}
