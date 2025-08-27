import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(form.email, form.password);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 animate-fade-in-down max-w-md mx-auto mt-20"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-lime-400">Iniciar Sesión</h2>
      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="usuario@correo.com"
      />
      <Input
        label="Contraseña"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="********"
      />
      {error && <div className="text-red-500 text-sm mb-4 animate-shake">{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
};

export default LoginForm;