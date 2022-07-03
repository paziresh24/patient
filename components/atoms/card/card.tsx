interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = props => {
    const { children, className, ...rest } = props;
    return (
        <div
            className={`flex flex-col p-4 bg-white rounded-lg shadow-card ${
                className ? className : ''
            }`}
            {...rest}
        >
            {children}
        </div>
    );
};

export default Card;
