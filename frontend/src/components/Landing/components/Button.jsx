import ButtonSvg from "../public/ButtonSvg";

const Button = ({ className, href, onClick, children, px, white }) => {
  const classes = `font-code text-xs font-bold uppercase tracking-wider relative inline-flex items-center justify-center h-11 transition-colors hover:text[#AC6AFF] ${
    px || "px-7"
  } ${white ? "text-[#0E0C15]" : "text-[#FFFFFF]"} ${className || ""}`;
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <button className={classes} onClick={onClick}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;