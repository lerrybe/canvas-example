import React, { useRef, useEffect, useState } from "react";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rect, setRect] = useState<Rect>({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: "#40c463",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { left, top } = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    if (
      mouseX >= rect.x &&
      mouseX <= rect.x + rect.width &&
      mouseY >= rect.y &&
      mouseY <= rect.y + rect.height
    ) {
      setIsDragging(true);
      setDragStartPos({ x: mouseX - rect.x, y: mouseY - rect.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { left, top } = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    if (isDragging) {
      setRect((prevRect) => ({
        ...prevRect,
        x: mouseX - dragStartPos.x,
        y: mouseY - dragStartPos.y,
      }));
    } else {
      if (
        mouseX >= rect.x &&
        mouseX <= rect.x + rect.width &&
        mouseY >= rect.y &&
        mouseY <= rect.y + rect.height
      ) {
        setIsMouseEnter(true);
      } else {
        setIsMouseEnter(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseOut = () => {
    setIsDragging(false);
    setIsMouseEnter(false);
  };

  const drawRect = ({
    ctx,
    canvas,
  }: {
    canvas?: HTMLCanvasElement | null;
    ctx?: CanvasRenderingContext2D | null;
  }) => {
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.fillStyle = rect.color;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    drawRect({ ctx, canvas });
  }, [rect]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          margin: "auto",
          borderRadius: 10,
          border: "1px solid #e1e1e1",
          cursor: isDragging ? "grabbing" : isMouseEnter ? "grab" : "default",
        }}
      />
    </>
  );
}
