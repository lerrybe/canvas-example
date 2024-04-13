import { useRef, useState, useEffect, useCallback } from "react";

import { Shape, ShapeType } from "../../lib/type";
import { usePointInsideShape } from "../../lib/useShapeUtils";

export const defaultShapes = [
  {
    type: "rect",
    x: 100,
    y: 100,
    angle: 0,
    width: 100,
    height: 100,
    color: "#3498db",
  },
];

export default function MultiLayerCanvas() {
  const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
  const upperCanvasRef = useRef<HTMLCanvasElement>(null);

  const [shapes, setShapes] = useState<Shape[]>(defaultShapes);
  const shapesRef = useRef<Shape[]>(shapes);

  const [selectedShapeIndex, setSelectedShapeIndex] = useState(-1);
  const [lowerCanvasRenderCount, setLowerCanvasRenderCount] = useState(0);

  const [dragState, setDragState] = useState({
    isDragging: false,
    startPos: { x: 0, y: 0 },
  });

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  const isPointInsideShape = usePointInsideShape();

  const drawStaticLowerCanvas = useCallback(() => {
    const canvas = lowerCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapesRef.current.forEach((shape) => {
      ctx.save();
      ctx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
      ctx.rotate(shape.angle);
      ctx.translate(-shape.width / 2, -shape.height / 2);

      switch (shape.type) {
        case ShapeType.RECT:
          ctx.fillStyle = shape.color;
          ctx.fillRect(0, 0, shape.width, shape.height);
          break;
      }

      ctx.restore();
    });

    setLowerCanvasRenderCount((prevCount) => prevCount + 1);
  }, [shapes]);

  useEffect(() => {
    drawStaticLowerCanvas();
  }, []);

  const getCursorStyle = () => {
    if (dragState.isDragging) {
      return "grabbing";
    } else if (selectedShapeIndex !== -1) {
      return "grab";
    } else {
      return "default";
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { left, top } = upperCanvasRef.current!.getBoundingClientRect();
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
      }

      if (selectedShape) {
        updateDynamicUpperCanvas(selectedShape);
        eraseShapeFromLowerCanvas(selectedShape);
      } else {
        setSelectedShapeIndex(-1);
      }
    },
    [shapes, isPointInsideShape]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (selectedShapeIndex === -1) return;

      const { left, top } = upperCanvasRef.current!.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;
      const shape = shapesRef.current[selectedShapeIndex];

      if (dragState.isDragging) {
        shapesRef.current[selectedShapeIndex] = {
          ...shape,
          x: mouseX - dragState.startPos.x,
          y: mouseY - dragState.startPos.y,
        };
        updateDynamicUpperCanvas(shapesRef.current[selectedShapeIndex]);
      }
    },
    [selectedShapeIndex, dragState]
  );

  const handleMouseUp = useCallback(() => {
    if (selectedShapeIndex !== -1) {
      commitInteractionToLowerCanvas();
      setShapes(shapesRef.current);
    }
    setDragState({ isDragging: false, startPos: { x: 0, y: 0 } });
    setSelectedShapeIndex(-1);
  }, [selectedShapeIndex]);

  const updateDynamicUpperCanvas = useCallback((selectedShape: Shape) => {
    const canvas = upperCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(
      selectedShape.x + selectedShape.width / 2,
      selectedShape.y + selectedShape.height / 2
    );
    ctx.rotate(selectedShape.angle);
    ctx.translate(-selectedShape.width / 2, -selectedShape.height / 2);

    switch (selectedShape.type) {
      case ShapeType.RECT:
        ctx.fillStyle = selectedShape.color;
        ctx.fillRect(0, 0, selectedShape.width, selectedShape.height);
        break;
    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, selectedShape.width, selectedShape.height);

    ctx.restore();
  }, []);

  const eraseShapeFromLowerCanvas = useCallback((selectedShape: Shape) => {
    const canvas = lowerCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();

    switch (selectedShape.type) {
      case ShapeType.RECT:
        ctx.rect(
          selectedShape.x,
          selectedShape.y,
          selectedShape.width,
          selectedShape.height
        );
        break;
    }

    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }, []);

  const commitInteractionToLowerCanvas = useCallback(() => {
    const lowerCanvas = lowerCanvasRef.current;
    const upperCanvas = upperCanvasRef.current;
    const lowerCtx = lowerCanvas?.getContext("2d");
    const upperCtx = upperCanvas?.getContext("2d");
    if (!lowerCtx || !upperCtx || !lowerCanvas || !upperCanvas) return;

    lowerCtx.clearRect(0, 0, lowerCanvas.width, lowerCanvas.height);

    shapes.forEach((shape) => {
      lowerCtx.save();
      lowerCtx.translate(shape.x + shape.width / 2, shape.y + shape.height / 2);
      lowerCtx.rotate(shape.angle);
      lowerCtx.translate(-shape.width / 2, -shape.height / 2);

      switch (shape.type) {
        case ShapeType.RECT:
          lowerCtx.fillStyle = shape.color;
          lowerCtx.fillRect(0, 0, shape.width, shape.height);
          break;
      }

      lowerCtx.restore();
    });

    upperCtx.clearRect(0, 0, upperCanvas.width, upperCanvas.height);
    setLowerCanvasRenderCount((prevCount) => prevCount + 1);
  }, [shapes]);

  return (
    <div style={{ height: 500, padding: "10px" }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Optimized (O)</div>
      <span style={{ fontSize: 18, fontWeight: 500, background: "#2196f347" }}>
        Lower-Canvas Render Count: {lowerCanvasRenderCount}
      </span>
      <div style={{ position: "relative" }}>
        <canvas
          id="lower-canvas"
          ref={lowerCanvasRef}
          width={600}
          height={400}
          style={{
            top: 10,
            left: 0,
            zIndex: 1,
            position: "absolute",
          }}
        />
        <canvas
          id="upper-canvas"
          ref={upperCanvasRef}
          width={600}
          height={400}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{
            top: 10,
            left: 0,
            zIndex: 2,
            borderRadius: 5,
            position: "absolute",
            cursor: getCursorStyle(),
            border: "1px solid #d2d2d2",
          }}
        />
      </div>
    </div>
  );
}
