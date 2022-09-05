interface BackDropProps {
  action: () => void;
}
export const BackDrop = ({ action }: BackDropProps) => {
  return <div className="fixed inset-0 bg-[#0e161b] opacity-70 z-10 !m-0" onClick={() => action()} />;
};
export default BackDrop;
