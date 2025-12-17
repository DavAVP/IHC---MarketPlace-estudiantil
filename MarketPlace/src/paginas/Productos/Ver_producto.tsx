// src/pages/Ver_producto.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../componentes/SideBar';
import Navbar from '../../componentes/NavBar';
import Footer from '../../componentes/footer';
import { productoServices } from '../../services/producto.services';
import type { IProducto } from '../../entidades/producto';
import { useIdioma } from '../../context/IdiomasContext';
import { useUsuario } from '../../context/UsuarioContext';
import { CarritoService } from '../../services/carrito.service';
import '../../assets/estilosProductos/verProducto.css';
import { toast } from 'react-hot-toast';
import { ComentarioService, type ComentarioConAutor } from '../../services/comentario.service';

type ComentarioNodo = ComentarioConAutor & { respuestas: ComentarioNodo[] };

const obtenerMarcaTemporal = (comentario: ComentarioConAutor): number => {
  const marca = comentario.created_at ?? (comentario as unknown as Record<string, unknown>).created_at as string | undefined;
  return marca ? new Date(marca).getTime() : 0;
};

const construirArbolComentarios = (comentarios: ComentarioConAutor[]): ComentarioNodo[] => {
  const nodos = new Map<string, ComentarioNodo>();
  const raices: ComentarioNodo[] = [];

  comentarios.forEach((comentario) => {
    nodos.set(comentario.id, { ...comentario, respuestas: [] });
  });

  nodos.forEach((comentario) => {
    if (comentario.parentId) {
      const padre = nodos.get(comentario.parentId);
      if (padre) {
        padre.respuestas.push(comentario);
      } else {
        raices.push(comentario);
      }
    } else {
      raices.push(comentario);
    }
  });

  const ordenarRecursivo = (lista: ComentarioNodo[]) => {
    lista.sort((a, b) => obtenerMarcaTemporal(b) - obtenerMarcaTemporal(a));
    lista.forEach((respuesta) => ordenarRecursivo(respuesta.respuestas));
  };

  ordenarRecursivo(raices);
  return raices;
};

const Ver_producto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<IProducto | null>(null);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [comentarios, setComentarios] = useState<ComentarioConAutor[]>([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(false);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [comentarioEditandoId, setComentarioEditandoId] = useState<string | null>(null);
  const [comentarioEditandoTexto, setComentarioEditandoTexto] = useState('');
  const [comentarioEditandoCalificacion, setComentarioEditandoCalificacion] = useState(5);
  const [actualizandoComentario, setActualizandoComentario] = useState(false);
  const [comentarioEliminandoId, setComentarioEliminandoId] = useState<string | null>(null);
  const [respuestaActivaId, setRespuestaActivaId] = useState<string | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const { translate } = useIdioma();
  const { usuario } = useUsuario();
  const [agregando, setAgregando] = useState(false);

  const comentariosOrdenados = useMemo(
    () => [...comentarios].sort((a, b) => obtenerMarcaTemporal(b) - obtenerMarcaTemporal(a)),
    [comentarios]
  );

  const comentariosEnArbol = useMemo(
    () => construirArbolComentarios(comentariosOrdenados),
    [comentariosOrdenados]
  );

  useEffect(() => {
    const cargarProductoYComentarios = async () => {
      if (!id) return;
      setCargandoComentarios(true);
      try {
        const [productoData, comentariosData] = await Promise.all([
          productoServices.ObtenerProductoId(id),
          ComentarioService.obtenerComentariosPorProducto(id)
        ]);

        setProducto(productoData);
        setComentarios(comentariosData);
      } catch (err) {
        console.error('Error cargando producto o comentarios:', err);
      } finally {
        setCargandoComentarios(false);
      }
    };

    cargarProductoYComentarios();
  }, [id]);

  const handleComentarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim() || !producto?.id_producto || !id) return;

    if (!usuario?.id) {
      toast.error(translate('messages.loginToComment') || 'Inicia sesión para comentar.');
      navigate('/login');
      return;
    }

    try {
      setEnviandoComentario(true);
      const nuevoComentario = await ComentarioService.crearComentario({
        descripcion: comentario.trim(),
        calificacion,
        usuarioId: usuario.id,
        productoId: producto.id_producto
      });

      if (nuevoComentario) {
        const comentarioEnriquecido: ComentarioConAutor = nuevoComentario.usuario
          ? nuevoComentario
          : {
              ...nuevoComentario,
              usuario: {
                id: usuario.id,
                nombre: usuario.nombre ?? usuario.correo,
                correo: usuario.correo,
                esAdmin: usuario.esAdmin,
                fotoPerfil: usuario.fotoPerfil
              }
            };

        setComentarios(prev => [comentarioEnriquecido, ...prev]);
        toast.success(`${translate('messages.commentThanks')} ${comentario.trim()}`);
        setComentario('');
        setCalificacion(5);
      } else {
        toast.error(translate('messages.commentError') || 'No se pudo guardar el comentario.');
      }
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      toast.error(translate('messages.commentError') || 'No se pudo guardar el comentario.');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const iniciarEdicionComentario = (coment: ComentarioConAutor) => {
    setComentarioEditandoId(coment.id);
    setComentarioEditandoTexto(coment.descripcion);
    setComentarioEditandoCalificacion(coment.calificacion);
  };

  const cancelarEdicionComentario = () => {
    setComentarioEditandoId(null);
    setComentarioEditandoTexto('');
    setComentarioEditandoCalificacion(5);
  };

  const handleActualizarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentarioEditandoId) return;
    if (!comentarioEditandoTexto.trim()) {
      toast.error(translate('messages.commentError') || 'El comentario no puede estar vacío.');
      return;
    }

    try {
      setActualizandoComentario(true);
      const comentarioObjetivo = comentarios.find((c) => c.id === comentarioEditandoId);
      const payload: { descripcion: string; calificacion?: number } = {
        descripcion: comentarioEditandoTexto.trim()
      };
      if (!comentarioObjetivo?.parentId) {
        payload.calificacion = comentarioEditandoCalificacion;
      }

      const comentarioActualizado = await ComentarioService.actualizarComentario(comentarioEditandoId, payload);

      if (!comentarioActualizado) {
        toast.error(translate('messages.commentError') || 'No se pudo actualizar el comentario.');
        return;
      }

      setComentarios(prev =>
        prev.map(c => (c.id === comentarioActualizado.id ? comentarioActualizado : c))
      );

      toast.success(translate('messages.commentUpdated') || 'Comentario actualizado.');
      cancelarEdicionComentario();
    } catch (err) {
      console.error('Error al actualizar comentario:', err);
      toast.error(translate('messages.commentError') || 'No se pudo actualizar el comentario.');
    } finally {
      setActualizandoComentario(false);
    }
  };

  const handleEliminarComentario = async (comentId: string) => {
    const confirmar = window.confirm(translate('messages.commentDeleteConfirm') || '¿Eliminar comentario?');
    if (!confirmar) return;

    try {
      setComentarioEliminandoId(comentId);
      const eliminado = await ComentarioService.eliminarComentario(comentId);
      if (!eliminado) {
        toast.error(translate('messages.commentDeleteError') || 'No se pudo eliminar el comentario.');
        return;
      }

      const idsEliminados = new Set<string>();

      setComentarios(prev => {
        const recopilarDescendientes = (objetivoId: string) => {
          idsEliminados.add(objetivoId);
          prev
            .filter((comentario) => comentario.parentId === objetivoId)
            .forEach((hijo) => recopilarDescendientes(hijo.id));
        };

        recopilarDescendientes(comentId);
        return prev.filter((comentario) => !idsEliminados.has(comentario.id));
      });

      setRespuestaActivaId((prevId) => (prevId && idsEliminados.has(prevId) ? null : prevId));

      if (comentarioEditandoId && idsEliminados.has(comentarioEditandoId)) {
        cancelarEdicionComentario();
      }

      toast.success(translate('messages.commentDeleted') || 'Comentario eliminado.');

    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      toast.error(translate('messages.commentDeleteError') || 'No se pudo eliminar el comentario.');
    } finally {
      setComentarioEliminandoId(null);
    }
  };

  const manejarToggleRespuesta = (comentId: string) => {
    if (!usuario?.id) {
      toast.error(translate('messages.loginToComment') || 'Inicia sesión para comentar.');
      navigate('/login');
      return;
    }

    setRespuestaActivaId(prev => (prev === comentId ? null : comentId));
    setRespuestaTexto('');
  };

  const handleResponder = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!respuestaTexto.trim() || !producto?.id_producto) return;

    if (!usuario?.id) {
      toast.error(translate('messages.loginToComment') || 'Inicia sesión para comentar.');
      navigate('/login');
      return;
    }

    const comentarioPadre = comentarios.find((c) => c.id === parentId);
    const calificacionBase = comentarioPadre?.calificacion ?? 0;

    try {
      setEnviandoRespuesta(true);
      const nuevaRespuesta = await ComentarioService.crearComentario({
        descripcion: respuestaTexto.trim(),
        calificacion: calificacionBase,
        usuarioId: usuario.id,
        productoId: producto.id_producto,
        parentId
      });

      if (!nuevaRespuesta) {
        toast.error(translate('messages.commentError') || 'No se pudo guardar la respuesta.');
        return;
      }

      const respuestaEnriquecida: ComentarioConAutor = nuevaRespuesta.usuario
        ? nuevaRespuesta
        : {
            ...nuevaRespuesta,
            usuario: {
              id: usuario.id,
              nombre: usuario.nombre ?? usuario.correo,
              correo: usuario.correo,
              esAdmin: usuario.esAdmin,
              fotoPerfil: usuario.fotoPerfil
            }
          };

      setComentarios(prev => [respuestaEnriquecida, ...prev]);
      toast.success(translate('productDetail.replyThanks') || 'Respuesta enviada.');
      setRespuestaTexto('');
      setRespuestaActivaId(null);
    } catch (err) {
      console.error('Error al responder comentario:', err);
      toast.error(translate('messages.commentError') || 'No se pudo guardar la respuesta.');
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const renderComentario = (coment: ComentarioNodo): JSX.Element => {
    const correoAutor = coment.usuario?.correo || translate('productDetail.anonymousUser');
    const esPropio = coment.usuarioId === usuario?.id;
    const esRespuesta = Boolean(coment.parentId);
    const estaEditando = comentarioEditandoId === coment.id;
    const mostrandoRespuesta = respuestaActivaId === coment.id;

    return (
      <div key={coment.id} className={`comentario-item ${esRespuesta ? 'comentario-item-respuesta' : ''}`}>
        <div className="comentario-top">
          <span className="comentario-usuario">
            {translate('productDetail.commentBy').replace('{user}', correoAutor)}
          </span>
          <span className="comentario-calificacion">⭐ {coment.calificacion}</span>
        </div>

        {estaEditando ? (
          <form onSubmit={handleActualizarComentario} className="comentario-edit-form">
            {!esRespuesta && (
              <label className="comentario-label">
                {translate('productDetail.ratingLabel')}
                <select
                  value={comentarioEditandoCalificacion}
                  onChange={(e) => setComentarioEditandoCalificacion(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <textarea
              value={comentarioEditandoTexto}
              onChange={(e) => setComentarioEditandoTexto(e.target.value)}
              rows={3}
            />
            <div className="comentario-actions">
              <button
                type="submit"
                className="btn-guardar"
                disabled={actualizandoComentario}
              >
                {actualizandoComentario
                  ? translate('common.actions.saving')
                  : translate('common.actions.saveChanges')}
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={cancelarEdicionComentario}
              >
                {translate('common.actions.cancel')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="comentario-descripcion">{coment.descripcion}</p>
            <div className="comentario-actions">
              {esPropio && (
                <>
                  <button
                    type="button"
                    className="btn-accion"
                    onClick={() => iniciarEdicionComentario(coment)}
                  >
                    {translate('common.actions.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn-accion eliminar"
                    onClick={() => handleEliminarComentario(coment.id)}
                    disabled={comentarioEliminandoId === coment.id}
                  >
                    {comentarioEliminandoId === coment.id
                      ? translate('common.actions.saving')
                      : translate('common.actions.delete')}
                  </button>
                </>
              )}
              {usuario?.id && (
                <button
                  type="button"
                  className="btn-accion"
                  onClick={() => manejarToggleRespuesta(coment.id)}
                >
                  {translate('common.actions.reply')}
                </button>
              )}
            </div>

            {mostrandoRespuesta && (
              <form
                onSubmit={(event) => handleResponder(event, coment.id)}
                className="respuesta-form"
              >
                <textarea
                  value={respuestaTexto}
                  onChange={(event) => setRespuestaTexto(event.target.value)}
                  rows={3}
                  placeholder={translate('productDetail.replyPlaceholder')}
                />
                <div className="comentario-actions">
                  <button
                    type="submit"
                    className="btn-guardar"
                    disabled={enviandoRespuesta}
                  >
                    {enviandoRespuesta
                      ? translate('productDetail.replying')
                      : translate('common.actions.send')}
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => {
                      setRespuestaActivaId(null);
                      setRespuestaTexto('');
                    }}
                  >
                    {translate('common.actions.cancel')}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {coment.respuestas.length > 0 && (
          <div className="comentario-respuestas">
            {coment.respuestas.map(renderComentario)}
          </div>
        )}
      </div>
    );
  };

  const handleAgregarCarrito = async () => {
    if (!producto) return;
    if (!usuario?.id) {
      toast.error(translate('messages.loginToBuy'));
      navigate('/login');
      return;
    }

    try {
      setAgregando(true);
      await CarritoService.agregarProducto(producto, usuario.id, 1);
      toast.success(translate('cart.added') || 'Agregado al carrito');
    } catch (err: any) {
      console.error('Error al agregar al carrito:', err);
      const detalle = err?.message ? `\n${err.message}` : '';
      alert(`No se pudo agregar el producto al carrito. Intenta nuevamente.${detalle}`);
    } finally {
      setAgregando(false);
    }
  };

  if (!producto) return <p className="px-8 py-6">{translate('productDetail.loading')}</p>;

  return (
    <div className="flex home-page min-h-screen">
      <Sidebar />
      <div className="home-main flex flex-col min-h-screen">
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-6 flex-1">
          <div className="producto-detalle-card">
            <img
              src={producto.foto_producto || '/placeholder.png'}
              alt={producto.nombre_producto}
              className="producto-img mb-4"
            />
            <h2>{producto.nombre_producto}</h2>
            <p className="descripcion">{producto.descripcion_producto}</p>
            <p className="precio">${producto.precio}</p>

            <div className="btn-group mt-4">
              <button className="btn-comprar" onClick={handleAgregarCarrito} disabled={agregando}>
                {agregando ? translate('payment.processing') : translate('cart.add') || 'Agregar al carrito'}
              </button>
              <button className="btn-volver" onClick={() => navigate('/catalogo')}>
                {translate('productDetail.back')}
              </button>
            </div>

            <div className="comentario-section mt-6">
              <h3>{translate('productDetail.commentTitle')}</h3>
              <form onSubmit={handleComentarioSubmit} className="comentario-form">
                <label className="comentario-label">
                  {translate('productDetail.ratingLabel')}
                  <select
                    value={calificacion}
                    onChange={(e) => setCalificacion(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={4}
                  placeholder={translate('productDetail.commentPlaceholder')}
                />
                <button type="submit" className="btn-comentar mt-2" disabled={enviandoComentario}>
                  {enviandoComentario ? translate('common.actions.saving') : translate('productDetail.commentAction')}
                </button>
              </form>

              <div className="comentarios-lista mt-4">
                <h4>{translate('productDetail.commentsListTitle')}</h4>
                {cargandoComentarios ? (
                  <p>{translate('common.loading')}</p>
                ) : comentarios.length === 0 ? (
                  <p>{translate('productDetail.noComments')}</p>
                ) : (
                  comentariosEnArbol.map(renderComentario)
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Ver_producto;
