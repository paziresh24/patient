import Loading from "../loading";

interface ButtonProps {
  /**
        The content of the button.
    */
  children: React.ReactNode;
  /**
        The variant of the button.
        values: primary, secondary
        @default primary
    */
  variant?: "primary" | "secondary";
  /**
   * The size of the button.
   * values: sm, md, lg
   * @default medium
   */
  size?: "sm" | "md" | "lg";
  /**
   * The theme of the button.
   * values: simple, error
   * @default simple
   */
  theme?: "simple" | "error";
  /**
   * the icon before the text
   */
  icon?: React.ReactNode;
  /**
   * The Function to be called when the button is clicked
   */
  onClick?: () => void;
  /**
   * The when button full width
   * @default false
   */
  block?: boolean;
  className?: string;
  /**
   * The loading state of the button
   * @default false
   */
  loading?: boolean;
}

const buttonStyles = {
  variant: {
    primary: "bg-primary border border-primary text-white",
    secondary: "border border-primary text-primary",
  },
  size: {
    sm: "px-3 h-10 text-sm",
    md: "px-4 h-12 text-sm",
    lg: "px-5 h-14 text-md",
  },
  theme: {
    error: {
      primary: "bg-red-500 border-red-50 text-white",
      secondary: "border-red-500 text-red-500",
    },
    simple: {
      primary: "",
      secondary: "",
    },
  },
  block: "w-full",
};

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    variant = "primary",
    size = "md",
    theme = "simple",
    block = false,
    onClick,
    icon,
    className,
    loading = false,
    ...rest
  } = props;

  return (
    <button
      className={`
            flex items-center justify-center rounded-md font-bold ${
              buttonStyles.variant[variant]
            } ${buttonStyles.size[size]} ${buttonStyles.theme[theme]?.[variant]} ${
        block ? buttonStyles["block"] : ""
      } ${className ? className : ""}`}
      onClick={onClick}
      {...rest}
    >
      {!loading && (
        <>
          {icon && <span className="flex items-center justify-center ml-2">{icon}</span>}
          {children}
        </>
      )}
      {loading && <Loading color="#fff" />}
    </button>
  );
};

export default Button;
