interface SidebarItemProps {
  title: string;
  url: string;
  className?: string;
}
const SidebarItem = ({ title, url, className }: SidebarItemProps) => {
  return (
    <ul className={`font-normal mb-3 overflow-y-scroll ${className}`}>
      <li>
        <a href={url} className="block py-3 px-5" title={title}>
          {title}
        </a>
      </li>
    </ul>
  );
};

export default SidebarItem;
