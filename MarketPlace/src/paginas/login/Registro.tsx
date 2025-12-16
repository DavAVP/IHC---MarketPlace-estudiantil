import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { authService } from '../../services/auth.services';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useIdioma } from '../../context/IdiomasContext';
import '../../assets/estilosAuth/auth.css';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUsuario } = useUsuario();
  const { translate } = useIdioma();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre || !correo || !password) {
      setError(translate('register.errors.missing'));
      return;
    }

    if (password.length < 6) {
      setError(translate('register.errors.passwordLength'));
      return;
    }

    try {
      const usuario = await authService.registerWithEmail(correo, password, nombre);
      if (!usuario) throw new Error('REGISTER_ERROR');

      setUsuario(usuario);
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      const fallback = translate('register.errors.missing');
      if (err.message === 'REGISTER_ERROR') {
        setError(fallback);
      } else {
        setError(err.message || fallback);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--single">
        <h2 className="auth-form__title">{translate('register.title')}</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleRegistro} className="auth-form">
          <label className="auth-label">
            <span>{translate('register.name')}</span>
            <input
              type="text"
              className="auth-input"
              value={nombre}
              placeholder={translate('register.name')}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          <label className="auth-label">
            <span>{translate('register.email')}</span>
            <input
              type="email"
              className="auth-input"
              value={correo}
              placeholder={translate('register.email')}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>

          <label className="auth-label auth-label--password">
            <span>{translate('register.password')}</span>
            <div className="auth-password">
              <input
                type={mostrarPass ? 'text' : 'password'}
                className="auth-input"
                value={password}
                placeholder="********"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="auth-password__toggle"
                onClick={() => setMostrarPass((prev) => !prev)}
                aria-label={mostrarPass ? 'Hide password' : 'Show password'}
              >
                {mostrarPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <button type="submit" className="auth-submit">
            {translate('register.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
