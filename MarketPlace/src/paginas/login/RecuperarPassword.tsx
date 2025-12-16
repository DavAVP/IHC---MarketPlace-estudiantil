import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../data/supabase.config';
import { useIdioma } from '../../context/IdiomasContext';
import '../../assets/estilosAuth/auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { translate } = useIdioma();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError(translate('resetPassword.mismatch'));
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      alert(translate('resetPassword.success'));
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError(translate('resetPassword.error'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--single">
        <h2 className="auth-form__title">{translate('resetPassword.title')}</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleResetPassword} className="auth-form">
          <label className="auth-label">
            <span>{translate('resetPassword.password')}</span>
            <input
              type="password"
              className="auth-input"
              value={password}
              placeholder={translate('resetPassword.password')}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            <span>{translate('resetPassword.confirm')}</span>
            <input
              type="password"
              className="auth-input"
              value={confirmar}
              placeholder={translate('resetPassword.confirm')}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="auth-submit">
            {translate('resetPassword.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
