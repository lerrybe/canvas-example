import { useRef, useState, useEffect } from "react";

export interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  angle: number;
}

export const defaultShapes = [
  {
    type: "rect",
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: "#3498db",
    angle: 0,
  },
];

export default function SingleLayerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>(defaultShapes);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(-1);

  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape, index) => {
      ctx.save();
      ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
      ctx.rotate(shape.angle);
      ctx.translate(-shape.width / 2, -shape.height / 2);
      ctx.fillStyle = shape.color;
      ctx.fillRect(0, 0, shape.width, shape.height);
      ctx.restore();

      if (index === selectedShapeIndex) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
    });

    setRenderCount((prevCount) => prevCount + 1);
  }, [shapes, selectedShapeIndex]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const foundIndex = shapes.findIndex(
      (shape) =>
        mouseX >= shape.x &&
        mouseX <= shape.x + shape.width &&
        mouseY >= shape.y &&
        mouseY <= shape.y + shape.height
    );

    if (foundIndex !== -1) {
      setSelectedShapeIndex(foundIndex);
      setIsDragging(true);
      setStartPos({
        x: mouseX - shapes[foundIndex].x,
        y: mouseY - shapes[foundIndex].y,
      });
    } else {
      setSelectedShapeIndex(-1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    if (!isDragging || selectedShapeIndex === -1) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newShapes = [...shapes];
    newShapes[selectedShapeIndex] = {
      ...newShapes[selectedShapeIndex],
      x: mouseX - startPos.x,
      y: mouseY - startPos.y,
    };
    setShapes(newShapes);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ height: 480, padding: "10px" }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Not Optimized (X)</div>
      <span style={{ fontSize: 18, fontWeight: 500, background: "#f443364a" }}>
        Canvas Render Count: {renderCount}
      </span>
      <div style={{ height: 480, padding: "10px 0" }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ borderRadius: 5, border: "1px solid #d2d2d2" }}
        />
      </div>
    </div>
  );
}
