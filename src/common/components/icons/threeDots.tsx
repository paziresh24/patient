interface ThreeDotsProps extends React.SVGAttributes<SVGElement> {
  color?: string;
}

const ThreeDots = ({ color = '#fff', ...rest }: ThreeDotsProps) => {
  return (
    <svg width="5" height="18" viewBox="0 0 5 18" fill="none" {...rest} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.45711 17.2674C3.06068 17.2674 3.54997 16.7753 3.54997 16.1682C3.54997 15.5612 3.06068 15.0691 2.45711 15.0691C1.85355 15.0691 1.36426 15.5612 1.36426 16.1682C1.36426 16.7753 1.85355 17.2674 2.45711 17.2674Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.45711 10.3792C3.06068 10.3792 3.54997 9.88708 3.54997 9.28005C3.54997 8.67301 3.06068 8.18091 2.45711 8.18091C1.85355 8.18091 1.36426 8.67301 1.36426 9.28005C1.36426 9.88708 1.85355 10.3792 2.45711 10.3792Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.45711 3.49149C3.06068 3.49149 3.54997 2.99939 3.54997 2.39235C3.54997 1.78531 3.06068 1.29321 2.45711 1.29321C1.85355 1.29321 1.36426 1.78531 1.36426 2.39235C1.36426 2.99939 1.85355 3.49149 2.45711 3.49149Z"
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

ThreeDots.defaultProps = {
  color: '#fff',
};

export default ThreeDots;
