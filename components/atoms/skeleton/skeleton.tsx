interface SkeletonProps {
  w?: string;
  h?: string;
  rounded?: "lg" | "md" | "sm" | "xs" | "full";
}

const skeletonStyles = {
  rounded: {
    lg: "rounded-lg",
    md: "rounded-md",
    sm: "rounded-sm",
    xs: "rounded-xs",
    full: "rounded-full",
  },
};

export const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { w = "5rem", h = "5rem", rounded } = props;

  return (
    <div
      style={{ width: w, height: h }}
      className={`${
        rounded ? skeletonStyles.rounded[rounded] : ""
      } animate-pulse duration-75 bg-slate-200`}
    />
  );
};

export default Skeleton;
