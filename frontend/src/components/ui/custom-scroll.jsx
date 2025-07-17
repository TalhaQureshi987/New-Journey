const CustomScroll = ({ children, className = "" }) => {
  return (
    <div
      className={`
        overflow-y-auto
        scrollbar-thin
        scrollbar-track-gray-100
        scrollbar-thumb-gray-300
        hover:scrollbar-thumb-gray-400
        scrollbar-thumb-rounded-full
        scrollbar-track-rounded-full
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default CustomScroll; 