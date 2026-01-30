import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIdioma } from "../../context/IdiomasContext";
import { useUsuario } from "../../context/UsuarioContext";
import Sidebar from "../../componentes/SideBar";
import Navbar from "../../componentes/NavBar";
import Footer from "../../componentes/footer";
import { supabase } from "../../data/supabase.config";
import "../../assets/estilosProductos/pago.css";
import type { ICarrito } from "../../entidades/ICarrito";

type BankKey = "guayaquil" | "pichincha";

const cardPlaceholder = "•••• •••• •••• ••••";

const Pago: React.FC = () => {
  const { translate } = useIdioma();
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState<ICarrito[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankKey>("guayaquil");
  const [savedCard, setSavedCard] = useState<{ cardholder: string; last4: string; expiry: string } | null>(null);
  const [formData, setFormData] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    idNumber: "",
    remember: false,
  });

  useEffect(() => {
    const cached = localStorage.getItem("savedCard");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setSavedCard(parsed);
        setFormData((prev) => ({
          ...prev,
          cardholder: parsed.cardholder ?? prev.cardholder,
          expiry: parsed.expiry ?? prev.expiry,
          cardNumber: parsed.last4 ? `•••• •••• •••• ${parsed.last4}` : prev.cardNumber,
          remember: true,
        }));
      } catch (e) {
        console.warn("No se pudo parsear savedCard", e);
      }
    }

    const cargarCarrito = async () => {
      if (!usuario?.id) {
        setCarrito([]);
        return;
      }

      const { data, error } = await supabase
        .from("Carrito")
        .select("id_producto, nombre_producto, precio, cantidad")
        .eq("usuario_id", usuario.id);

      if (error) {
        console.error("Error cargando carrito:", error);
        setCarrito([]);
        return;
      }

      setCarrito(data ?? []);
    };

    cargarCarrito();
  }, [usuario?.id]);

  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
      }),
    []
  );

  const productsTotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const iva = productsTotal * 0.15;
  const shipping = carrito.length > 0 ? 3.5 : 0;
  const total = productsTotal + iva + shipping;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      return;
    }

    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const digits = formData.cardNumber.replace(/\D/g, "");
    if (!formData.cardholder.trim())
      newErrors.cardholder = translate("payment.errors.cardholder");
    const maskedOk = savedCard && formData.cardNumber.includes("•") && formData.cardNumber.includes(savedCard.last4);
    if (!/^[0-9]{16}$/.test(digits) && !maskedOk)
      newErrors.cardNumber = translate("payment.errors.cardNumber");
    if (!/^\d{2}\/[0-9]{2}$/.test(formData.expiry))
      newErrors.expiry = translate("payment.errors.expiry");
    if (!/^\d{3}$/.test(formData.cvv))
      newErrors.cvv = translate("payment.errors.cvv");
    if (formData.idNumber.trim().length < 8)
      newErrors.idNumber = translate("payment.errors.idNumber");
    return newErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validate();
    setErrors(validationResult);

    if (Object.keys(validationResult).length > 0) {
      setStatus("error");
      setMessage(translate("payment.error"));
      return;
    }

    setStatus("processing");
    setMessage(translate("payment.processing"));

    await new Promise((resolve) => setTimeout(resolve, 1800));

    if (formData.remember) {
      const digits = formData.cardNumber.replace(/\D/g, "");
      const last4 = digits.slice(-4).padStart(4, "•");
      localStorage.setItem(
        "savedCard",
        JSON.stringify({
          cardholder: formData.cardholder,
          last4,
          expiry: formData.expiry,
        })
      );
    } else {
      localStorage.removeItem("savedCard");
      setSavedCard(null);
    }

    if (usuario?.id) {
      const { error: clearError } = await supabase
        .from("Carrito")
        .delete()
        .eq("usuario_id", usuario.id);
      if (clearError) {
        console.error("No se pudo limpiar carrito tras pago:", clearError);
      }
    }

    localStorage.setItem(
      "lastPurchaseMessage",
      translate("payment.success") || "Compra realizada. Su producto está de camino."
    );
    localStorage.setItem("lastPurchaseStatus", "success");

    setStatus("success");
    setMessage(translate("payment.success"));

    setTimeout(() => navigate("/carrito"), 500);
  };

  const maskedCardNumber = () => {
    if (formData.cardNumber.includes("•") && savedCard?.last4) {
      return `•••• •••• •••• ${savedCard.last4}`;
    }
    const digits = formData.cardNumber.replace(/\D/g, "").padEnd(16, "•");
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const maskedExpiry = formData.expiry || "MM/AA";

  const renderError = (field: string) =>
    errors[field] ? (
      <small className="pago-status pago-status-error">{errors[field]}</small>
    ) : null;

  return (
    <div className="home-page">
      <Sidebar />
      <div className="home-main">
        <Navbar onSearch={() => {}} />

        <div className="pago-page">
          <div className="pago-header">
            <h1>{translate("payment.title")}</h1>
            <p>{translate("payment.subtitle")}</p>
          </div>

          <div className="pago-grid">
            <section className="pago-panel">
              <div>
                <p className="pago-help">{translate("payment.help")}</p>
                <div
                  className="pago-banks"
                  role="radiogroup"
                  aria-label={translate("payment.bankLabel")}
                >
                  {(["guayaquil", "pichincha"] as BankKey[]).map((bank) => (
                    <label
                      key={bank}
                      className={`pago-bank-option ${
                        selectedBank === bank ? "pago-bank-option-active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="bank"
                        value={bank}
                        checked={selectedBank === bank}
                        onChange={() => setSelectedBank(bank)}
                      />
                      {translate(`payment.banks.${bank}`)}
                    </label>
                  ))}
                </div>
              </div>

              <form className="pago-form" onSubmit={handleSubmit} noValidate>
                <div className="pago-form-field pago-form-full">
                  <label htmlFor="cardholder">
                    {translate("payment.form.cardholder")}
                  </label>
                  <input
                    id="cardholder"
                    name="cardholder"
                    type="text"
                    value={formData.cardholder}
                    onChange={handleInputChange}
                    autoComplete="cc-name"
                  />
                  {renderError("cardholder")}
                </div>

                <div className="pago-form-field pago-form-full">
                  <label htmlFor="cardNumber">
                    {translate("payment.form.cardNumber")}
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder={cardPlaceholder}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19}
                  />
                  {renderError("cardNumber")}
                </div>

                <div className="pago-form-field">
                  <label htmlFor="expiry">{translate("payment.form.expiry")}</label>
                  <input
                    id="expiry"
                    name="expiry"
                    type="text"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    autoComplete="cc-exp"
                    maxLength={5}
                  />
                  {renderError("expiry")}
                </div>

                <div className="pago-form-field">
                  <label htmlFor="cvv">{translate("payment.form.cvv")}</label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    autoComplete="cc-csc"
                    maxLength={3}
                  />
                  {renderError("cvv")}
                </div>

                <div className="pago-form-field pago-form-full">
                  <label htmlFor="idNumber">
                    {translate("payment.form.idNumber")}
                  </label>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                  {renderError("idNumber")}
                </div>

                <div className="pago-form-field">
                  <label htmlFor="bankPreview">
                    {translate("payment.cardPreview")}
                  </label>
                  <div className="pago-card-preview" id="bankPreview">
                    <div className="pago-card-number">{maskedCardNumber()}</div>
                    <div className="pago-card-row">
                      <span>
                        {formData.cardholder ||
                          translate("payment.form.cardholder")}
                      </span>
                      <span>{maskedExpiry}</span>
                    </div>
                    <small>{translate(`payment.banks.${selectedBank}`)}</small>
                  </div>
                </div>

                <label className="pago-remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleInputChange}
                  />
                  {translate("payment.form.remember")}
                </label>

                <button
                  className="pago-submit"
                  type="submit"
                  disabled={status === "processing"}
                >
                  {status === "processing"
                    ? translate("payment.processing")
                    : translate("payment.button")}
                </button>

                {message && (
                  <p
                    className={`pago-status ${
                      status === "success"
                        ? "pago-status-success"
                        : status === "error"
                        ? "pago-status-error"
                        : ""
                    }`}
                    aria-live="polite"
                  >
                    {message}
                  </p>
                )}
              </form>

              <div className="pago-disclaimer">
                <strong>{translate("payment.disclaimer_title")}</strong>
                <p>{translate("payment.disclaimer_description")}</p>
              </div>
            </section>

            <aside className="pago-summary">
              <div className="pago-summary-card">
                <h2>{translate("payment.summary.title")}</h2>
                <div className="pago-summary-row">
                  <span>{translate("payment.summary.products")}</span>
                  <span>{currency.format(productsTotal)}</span>
                </div>
                <div className="pago-summary-row">
                  <span>IVA (15%)</span>
                  <span>{currency.format(iva)}</span>
                </div>
                <div className="pago-summary-row">
                  <span>{translate("payment.summary.shipping")}</span>
                  <span>{currency.format(shipping)}</span>
                </div>
                <div className="pago-summary-row pago-summary-total">
                  <span>{translate("payment.summary.total")}</span>
                  <span>{currency.format(total)}</span>
                </div>
              </div>
              <p className="pago-help">{translate("payment.summary.help")}</p>
            </aside>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Pago;
