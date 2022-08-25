import clsx from "clsx";

interface SkeletonProps {
  w?: string;
  h?: string;
  rounded?: "none" | "lg" | "md" | "sm" | "xs" | "full";
  className?: string;
}

const skeletonStyles = {
  rounded: {
    none: "rounded-none",
    lg: "rounded-lg",
    md: "rounded-md",
    sm: "rounded-sm",
    xs: "rounded-xs",
    full: "rounded-full",
  },
};

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { w = "5rem", h = "5rem", rounded = "none", className } = props;

  return (
    <div
      style={{ width: w, height: h }}
      className={clsx(
        "animate-pulse duration-75 bg-slate-200",
        skeletonStyles.rounded[rounded],
        className
      )}
    />
  );
};

export default Skeleton;
