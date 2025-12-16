import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { authService } from '../../services/auth.services';
import toast from 'react-hot-toast';
import { useIdioma } from '../../context/IdiomasContext';
import '../../assets/estilosAuth/auth.css';

const Login: React.FC = () => {
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();
  const { translate } = useIdioma();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const bloqueoRef = useRef<number | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('recordarEmail');
    if (savedEmail) {
      setCorreo(savedEmail);
      setRecordarme(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (bloqueoRef.current) {
        window.clearTimeout(bloqueoRef.current);
      }
    };
  }, []);

  const manejarIntentosFallidos = () => {
    const nuevosIntentos = intentosFallidos + 1;
    setIntentosFallidos(nuevosIntentos);

    if (nuevosIntentos >= 3) {
      setBloqueado(true);
      toast.error(`⚠️ ${translate('login.blocked')}`);
      bloqueoRef.current = window.setTimeout(() => {
        setIntentosFallidos(0);
        setBloqueado(false);
        toast.success(translate('login.retry'));
      }, 30000);
    } else {
      toast.error(translate('login.failedAttempt').replace('{count}', nuevosIntentos.toString()));
    }
  };

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (bloqueado) {
      toast.error(`⛔ ${translate('login.blocked')}`);
      return;
    }

    try {
      const usuario = await authService.loginWithEmail(correo, password);

      if (!usuario) {
        manejarIntentosFallidos();
        setError(translate('login.invalidCredentials'));
        toast.error(translate('login.invalidCredentials'));
        return;
      }

      setUsuario(usuario);
      sessionStorage.setItem('user', JSON.stringify(usuario));

      if (recordarme) {
        localStorage.setItem('recordarEmail', correo);
      } else {
        localStorage.removeItem('recordarEmail');
      }

      setIntentosFallidos(0);
      toast.success(`🎉 ${translate('login.success')}`);
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      manejarIntentosFallidos();
      setError(err.message || translate('login.invalidCredentials'));
    }
  };

  const handleLoginGoogle = async () => {
    try {
      await authService.loginWithGoogle();
      toast.success(`🎉 ${translate('login.success')}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleLoginGithub = async () => {
    try {
      await authService.loginWithGithub();
      toast.success(`🎉 ${translate('login.success')}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleRecuperarPassword = async () => {
    if (!correo) {
      toast.error(translate('login.recoveryEmailMissing'));
      return;
    }

    try {
      const { error: resetError } = await authService.resetPassword(correo);
      if (resetError) throw resetError;
      toast.success(translate('login.recoverySent'));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || translate('resetPassword.error'));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--split">
        <section className="auth-card__info">
          <h1 className="auth-card__heading">{translate('login.subtitle')}</h1>
          <p>{translate('login.introOne')}</p>
          <p>{translate('login.introTwo')}</p>
          <p>{translate('login.introThree')}</p>
        </section>

        <section className="auth-card__form">
          <h2 className="auth-form__title">{translate('login.title')}</h2>
          {error && <p className="auth-error">{error}</p>}

          <div className="auth-social">
            <button type="button" className="auth-social__btn auth-social__btn--google" onClick={handleLoginGoogle}>
              {translate('login.googleLogin')}
            </button>
            <button type="button" className="auth-social__btn auth-social__btn--github" onClick={handleLoginGithub}>
              {translate('login.githubLogin')}
            </button>
          </div>

          <form onSubmit={handleLoginEmail} className="auth-form">
            <label className="auth-label">
              <span>{translate('login.email')}</span>
              <input
                className="auth-input"
                type="email"
                value={correo}
                placeholder={translate('login.email')}
                onChange={(e) => setCorreo(e.target.value)}
                required
                disabled={bloqueado}
              />
            </label>

            <label className="auth-label">
              <span>{translate('login.password')}</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                placeholder={translate('login.password')}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={bloqueado}
              />
            </label>

            <label className="auth-remember">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={() => setRecordarme((prev) => !prev)}
                disabled={bloqueado}
              />
              <span>{translate('login.rememberUser')}</span>
            </label>

            <button type="submit" className="auth-submit" disabled={bloqueado}>
              {bloqueado ? translate('login.blockedShort') : translate('login.loginButton')}
            </button>
          </form>

          <button type="button" className="auth-link" onClick={handleRecuperarPassword}>
            {translate('login.forgotPassword')}
          </button>

          <p className="auth-register">
            {translate('login.registerPrompt')}{' '}
            <button type="button" className="auth-link auth-link--inline" onClick={() => navigate('/registro')}>
              {translate('login.registerLink')}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
