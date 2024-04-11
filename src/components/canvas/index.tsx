import React, { useRef, useEffect, useState } from "react";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  angle: number;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rect, setRect] = useState<Rect>({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: "#40c463",
    angle: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartRect, setResizeStartRect] = useState<Rect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: "",
    angle: 0,
  });
  const [resizeDirection, setResizeDirection] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStartAngle, setRotateStartAngle] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { left, top } = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const angle = -rect.angle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rotatedMouseX =
      (mouseX - centerX) * cos - (mouseY - centerY) * sin + centerX;
    const rotatedMouseY =
      (mouseX - centerX) * sin + (mouseY - centerY) * cos + centerY;

    if (
      rotatedMouseX >= rect.x &&
      rotatedMouseX <= rect.x + rect.width &&
      rotatedMouseY >= rect.y &&
      rotatedMouseY <= rect.y + rect.height
    ) {
      setIsSelected(true);
      setIsDragging(true);
      setDragStartPos({ x: mouseX - rect.x, y: mouseY - rect.y });
    } else if (
      rotatedMouseX >= rect.x - 5 &&
      rotatedMouseX <= rect.x + 5 &&
      rotatedMouseY >= rect.y - 5 &&
      rotatedMouseY <= rect.y + 5
    ) {
      setIsResizing(true);
      setResizeStartPos({ x: mouseX, y: mouseY });
      setResizeStartRect(rect);
      setResizeDirection("topLeft");
    } else if (
      rotatedMouseX >= rect.x + rect.width - 5 &&
      rotatedMouseX <= rect.x + rect.width + 5 &&
      rotatedMouseY >= rect.y - 5 &&
      rotatedMouseY <= rect.y + 5
    ) {
      setIsResizing(true);
      setResizeStartPos({ x: mouseX, y: mouseY });
      setResizeStartRect(rect);
      setResizeDirection("topRight");
    } else if (
      rotatedMouseX >= rect.x - 5 &&
      rotatedMouseX <= rect.x + 5 &&
      rotatedMouseY >= rect.y + rect.height - 5 &&
      rotatedMouseY <= rect.y + rect.height + 5
    ) {
      setIsResizing(true);
      setResizeStartPos({ x: mouseX, y: mouseY });
      setResizeStartRect(rect);
      setResizeDirection("bottomLeft");
    } else if (
      rotatedMouseX >= rect.x + rect.width - 5 &&
      rotatedMouseX <= rect.x + rect.width + 5 &&
      rotatedMouseY >= rect.y + rect.height - 5 &&
      rotatedMouseY <= rect.y + rect.height + 5
    ) {
      setIsResizing(true);
      setResizeStartPos({ x: mouseX, y: mouseY });
      setResizeStartRect(rect);
      setResizeDirection("bottomRight");
    } else if (
      rotatedMouseX >= rect.x + rect.width / 2 - 10 &&
      rotatedMouseX <= rect.x + rect.width / 2 + 10 &&
      rotatedMouseY >= rect.y - 20 &&
      rotatedMouseY <= rect.y
    ) {
      setIsRotating(true);
      setRotateStartAngle(Math.atan2(mouseY - centerY, mouseX - centerX));
    } else {
      setIsSelected(false);
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
    } else if (isResizing) {
      const deltaX = mouseX - resizeStartPos.x;
      const deltaY = mouseY - resizeStartPos.y;
      const angle = resizeStartRect.angle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = deltaX * cos + deltaY * sin;
      const dy = deltaY * cos - deltaX * sin;

      if (resizeDirection === "topLeft") {
        setRect((prevRect) => ({
          ...prevRect,
          x: resizeStartRect.x + dx,
          y: resizeStartRect.y + dy,
          width: resizeStartRect.width - dx,
          height: resizeStartRect.height - dy,
        }));
      } else if (resizeDirection === "topRight") {
        setRect((prevRect) => ({
          ...prevRect,
          y: resizeStartRect.y + dy,
          width: resizeStartRect.width + dx,
          height: resizeStartRect.height - dy,
        }));
      } else if (resizeDirection === "bottomLeft") {
        setRect((prevRect) => ({
          ...prevRect,
          x: resizeStartRect.x + dx,
          width: resizeStartRect.width - dx,
          height: resizeStartRect.height + dy,
        }));
      } else if (resizeDirection === "bottomRight") {
        setRect((prevRect) => ({
          ...prevRect,
          width: resizeStartRect.width + dx,
          height: resizeStartRect.height + dy,
        }));
      }
    } else if (isRotating) {
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
      const deltaAngle = currentAngle - rotateStartAngle;
      setRect((prevRect) => ({
        ...prevRect,
        angle: prevRect.angle + deltaAngle,
      }));
      setRotateStartAngle(currentAngle);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };

  const handleMouseOut = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
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

      ctx.save();
      ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
      ctx.rotate(rect.angle);
      ctx.translate(-rect.width / 2, -rect.height / 2);

      ctx.fillStyle = rect.color;
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (isSelected) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, rect.width, rect.height);

        ctx.fillStyle = "#000";
        ctx.fillRect(-5, -5, 10, 10);
        ctx.fillRect(rect.width - 5, -5, 10, 10);
        ctx.fillRect(-5, rect.height - 5, 10, 10);
        ctx.fillRect(rect.width - 5, rect.height - 5, 10, 10);

        ctx.beginPath();
        ctx.moveTo(rect.width / 2 - 10, -20);
        ctx.lineTo(rect.width / 2 + 10, -20);
        ctx.stroke();
      }

      ctx.restore();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    drawRect({ ctx, canvas });
  }, [rect, isSelected]);

  return (
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
        cursor: isDragging ? "grabbing" : isSelected ? "grab" : "default",
      }}
    />
  );
}
