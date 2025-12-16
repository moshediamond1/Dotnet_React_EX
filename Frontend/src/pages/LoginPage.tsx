import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FormField } from '../components/FormField';

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      await login(data.username, data.password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Try admin/password123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Ticket System</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Username" id="username" type="text" placeholder="admin" Icon={Mail} register={register('username', { required: true })} />
            <FormField label="Password" id="password" type="password" placeholder="password123" Icon={Lock} register={register('password', { required: true })} />
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-800 text-sm">{error}</p></div>}
            <button type="submit" disabled={isLoading} className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition">{isLoading ? 'Logging in...' : 'Login'}</button>
          </form>
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">Demo credentials:<br />Username: <strong>admin</strong><br />Password: <strong>password123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
