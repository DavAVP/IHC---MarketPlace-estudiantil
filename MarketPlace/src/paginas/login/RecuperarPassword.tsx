import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../data/supabase.config';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert('Contraseña actualizada correctamente');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la contraseña');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e8f0fe',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          padding: '40px',
          width: '400px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#0077cc',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}
        >
          Restablecer Contraseña
        </h2>

        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#0077cc',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
