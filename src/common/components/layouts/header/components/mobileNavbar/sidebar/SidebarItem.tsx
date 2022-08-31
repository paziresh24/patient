interface SidebarItemProps {
  title: string;
  url: string;
}
const SidebarItem = ({ title, url }: SidebarItemProps) => {
  return (
    <ul className="font-normal mb-3 overflow-y-scroll ">
      <li>
        <a href={url} className="block py-3 px-5" title={title}>
          {title}
        </a>
      </li>
    </ul>
  );
};

export default SidebarItem;
