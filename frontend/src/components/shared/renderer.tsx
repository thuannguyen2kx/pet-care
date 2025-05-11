import { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: string; // HTML string
  maxHeight?: number; // chiều cao tối đa trước khi rút gọn
}

const Renderer = ({ value, maxHeight = 200 }: RendererProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;
    container.innerHTML = value;

    // Kiểm tra xem nội dung có vượt quá maxHeight hay không
    requestAnimationFrame(() => {
      if (container.scrollHeight > maxHeight) {
        setIsOverflowing(true);
      }
    });

    return () => {
      container.innerHTML = "";
    };
  }, [value, maxHeight]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <div
        ref={rendererRef}
        className=" transition-all overflow-hidden"
        style={{
          maxHeight: isCollapsed ? `${maxHeight}px` : "none",
        }}
      ></div>

      {isOverflowing && (
        <button
          className="text-blue-500 mt-2 hover:underline"
          onClick={toggleCollapse}
        >
          {isCollapsed ? "Xem thêm" : "Thu gọn"}
        </button>
      )}
    </div>
  );
};

export default Renderer;
