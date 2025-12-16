import { useIdioma } from "../context/IdiomasContext";

const Footer: React.FC = () => {
  const { translate } = useIdioma();

  return (
    <footer className="footer">
      <p>{translate("footer.copy")}</p>
    </footer>
  );
};

export default Footer;
