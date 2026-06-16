// 1. IMPORTAS la imagen desde su ubicación real (ajusta los ".." según dónde esté tu archivo)
import logoSvg from "../assets/decor/logotienda.svg";

// 2. Creas el componente y le permites recibir un tamaño "width" opcional
interface LogoProps {
  width?: string;
}

export function Logo({ width = "140px" }: LogoProps) {
  return (
    <img 
      src={logoSvg} 
      alt="Logo TiendaYA" 
      style={{ width: width, height: "auto", objectFit: "contain" }} 
      className="logo-reutilizable"
    />
  );
}