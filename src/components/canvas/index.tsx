import { useRef, useMemo, useState, useEffect, useCallback } from "react";

import {
  usePointInsideShape,
  usePointInsideResizeHandle,
  usePointInsideRotateHandle,
} from "../../lib/useShapeUtils";
import { defaultShapes } from "../../lib/data";
import { ResizeDirection, Shape, ShapeType } from "../../lib/type";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>(defaultShapes);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(-1);

  const [dragState, setDragState] = useState({
    isDragging: false,
    startPos: { x: 0, y: 0 },
  });
  const [resizeState, setResizeState] = useState({
    direction: "",
    isResizing: false,
    startPos: { x: 0, y: 0 },
    startShape: {} as Shape,
  });
  const [rotateState, setRotateState] = useState({
    startAngle: 0,
    isRotating: false,
  });

  const isPointInsideShape = usePointInsideShape();
  const isPointInsideResizeHandle = usePointInsideResizeHandle();
  const isPointInsideRotateHandle = usePointInsideRotateHandle();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { left, top } = canvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      let selectedShape: Shape | null = null;

      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];

        if (isPointInsideShape(mouseX, mouseY, shape)) {
          selectedShape = shape;
          setSelectedShapeIndex(i);
          setDragState({
            isDragging: true,
            startPos: {
              x: mouseX - shape.x,
              y: mouseY - shape.y,
            },
          });
          break;
        }

        const resizeDirection = [
          ResizeDirection.TOP_LEFT,
          ResizeDirection.TOP_RIGHT,
          ResizeDirection.BOTTOM_LEFT,
          ResizeDirection.BOTTOM_RIGHT,
        ].find((direction) =>
          isPointInsideResizeHandle(mouseX, mouseY, shape, direction)
        );

        if (resizeDirection) {
          selectedShape = shape;
          setSelectedShapeIndex(i);
          setResizeState({
            isResizing: true,
            startPos: { x: mouseX, y: mouseY },
            startShape: shape,
            direction: resizeDirection,
          });
          break;
        }

        if (isPointInsideRotateHandle(mouseX, mouseY, shape)) {
          selectedShape = shape;
          setSelectedShapeIndex(i);
          setRotateState({
            isRotating: true,
            startAngle: Math.atan2(
              mouseY - (shape.y + shape.height / 2),
              mouseX - (shape.x + shape.width / 2)
            ),
          });
          break;
        }
      }

      if (!selectedShape) {
        setSelectedShapeIndex(-1);
      }
    },
    [
      shapes,
      isPointInsideShape,
      isPointInsideResizeHandle,
      isPointInsideRotateHandle,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (selectedShapeIndex === -1) return;

      const { left, top } = canvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;
      const shape = shapes[selectedShapeIndex];

      if (dragState.isDragging) {
        const newShapes = shapes.map((prevShape, index) =>
          index === selectedShapeIndex
            ? {
                ...prevShape,
                x: mouseX - dragState.startPos.x,
                y: mouseY - dragState.startPos.y,
              }
            : prevShape
        );
        setShapes(newShapes);
      } else if (resizeState.isResizing) {
        const { startPos, startShape, direction } = resizeState;
        const deltaX = mouseX - startPos.x;
        const deltaY = mouseY - startPos.y;
        const angle = startShape.angle;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const dx = deltaX * cos + deltaY * sin;
        const dy = deltaY * cos - deltaX * sin;

        const newShape = {
          ...shape,
          x:
            direction === ResizeDirection.TOP_LEFT ||
            direction === ResizeDirection.BOTTOM_LEFT
              ? startShape.x + dx
              : shape.x,
          y:
            direction === ResizeDirection.TOP_LEFT ||
            direction === ResizeDirection.TOP_RIGHT
              ? startShape.y + dy
              : shape.y,
          width:
            direction === ResizeDirection.TOP_LEFT ||
            direction === ResizeDirection.BOTTOM_LEFT
              ? startShape.width - dx
              : startShape.width + dx,
          height:
            direction === ResizeDirection.TOP_LEFT ||
            direction === ResizeDirection.TOP_RIGHT
              ? startShape.height - dy
              : startShape.height + dy,
        };

        const newShapes = shapes.map((prevShape, index) =>
          index === selectedShapeIndex ? newShape : prevShape
        );
        setShapes(newShapes);
      } else if (rotateState.isRotating) {
        const centerX = shape.x + shape.width / 2;
        const centerY = shape.y + shape.height / 2;
        const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX);
        const deltaAngle = currentAngle - rotateState.startAngle;

        const newShapes = shapes.map((prevShape, index) =>
          index === selectedShapeIndex
            ? {
                ...prevShape,
                angle: prevShape.angle + deltaAngle,
              }
            : prevShape
        );
        setShapes(newShapes);
        setRotateState({ ...rotateState, startAngle: currentAngle });
      }
    },
    [selectedShapeIndex, shapes, dragState, resizeState, rotateState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, startPos: { x: 0, y: 0 } });
    setResizeState({
      isResizing: false,
      startPos: { x: 0, y: 0 },
      startShape: {} as Shape,
      direction: "",
    });
    setRotateState({ isRotating: false, startAngle: 0 });
  }, []);

  const drawShapes = useMemo(() => {
    return ({
      ctx,
      canvas,
    }: {
      canvas?: HTMLCanvasElement | null;
      ctx?: CanvasRenderingContext2D | null;
    }) => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape, index) => {
        ctx.save();
        ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
        ctx.rotate(shape.angle);
        ctx.translate(-shape.width / 2, -shape.height / 2);

        const drawShape = () => {
          switch (shape.type) {
            case ShapeType.RECT:
              ctx.fillStyle = shape.color;
              ctx.fillRect(0, 0, shape.width, shape.height);
              break;
            case ShapeType.CIRCLE:
              ctx.beginPath();
              const radius = Math.abs(Math.min(shape.width, shape.height) / 2);

              ctx.arc(
                shape.width / 2,
                shape.height / 2,
                radius,
                0,
                2 * Math.PI
              );
              ctx.fillStyle = shape.color;
              ctx.fill();
              break;
            case ShapeType.TRIANGLE:
              ctx.beginPath();
              ctx.moveTo(shape.width / 2, 0);
              ctx.lineTo(shape.width, shape.height);
              ctx.lineTo(0, shape.height);
              ctx.closePath();
              ctx.fillStyle = shape.color;
              ctx.fill();
              break;
            case ShapeType.STAR:
              const NUM_POINTS = 5;
              const outerRadius = Math.min(shape.width, shape.height) / 2;
              const innerRadius = outerRadius / 2;
              ctx.beginPath();
              ctx.moveTo(
                shape.width / 2 + outerRadius * Math.cos((-90 * Math.PI) / 180),
                shape.height / 2 + outerRadius * Math.sin((-90 * Math.PI) / 180)
              );
              for (let i = 0; i < NUM_POINTS; i++) {
                const angle = (i * 4 * Math.PI) / NUM_POINTS - Math.PI / 2;
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                ctx.lineTo(
                  shape.width / 2 + radius * Math.cos(angle),
                  shape.height / 2 + radius * Math.sin(angle)
                );
              }
              ctx.closePath();
              ctx.fillStyle = shape.color;
              ctx.fill();
              break;
            case ShapeType.TEXT:
              ctx.font = "24px Arial";
              ctx.fillStyle = shape.color;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(shape.text || "", shape.width / 2, shape.height / 2);
              break;
          }
        };

        drawShape();

        if (index === selectedShapeIndex) {
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(0, 0, shape.width, shape.height);

          ctx.fillStyle = "#000";
          ctx.fillRect(-5, -5, 10, 10);
          ctx.fillRect(shape.width - 5, -5, 10, 10);
          ctx.fillRect(-5, shape.height - 5, 10, 10);
          ctx.fillRect(shape.width - 5, shape.height - 5, 10, 10);

          ctx.beginPath();
          ctx.moveTo(shape.width / 2 - 10, -30);
          ctx.lineTo(shape.width / 2 + 10, -30);
          ctx.stroke();
        }

        ctx.restore();
      });
    };
  }, [shapes, selectedShapeIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    drawShapes({ ctx, canvas });
  }, [shapes, selectedShapeIndex, drawShapes]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{
        margin: "auto",
        borderRadius: 10,
        border: "1px solid #e1e1e1",
        cursor:
          dragState.isDragging ||
          resizeState.isResizing ||
          rotateState.isRotating
            ? "grabbing"
            : selectedShapeIndex !== -1
            ? "grab"
            : "default",
      }}
    />
  );
}
