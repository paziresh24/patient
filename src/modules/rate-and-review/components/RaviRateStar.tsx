interface RaviRateStarProps {
  selected?: boolean;
}

export const RaviRateStar = ({ selected = false }: RaviRateStarProps) => (
  <svg
    width={21}
    height={21}
    viewBox="0 0 24 24"
    fill={selected ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={selected ? 0 : 1.5}
    className={`transition-colors duration-150 ${selected ? 'text-[#ec9c07]' : 'text-[#cacaca]'}`}
    aria-hidden
  >
    <path d="M12 2l2.9 5.88 6.5.95-4.7 4.58 1.1 6.47L12 17.77l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95L12 2z" />
  </svg>
);
