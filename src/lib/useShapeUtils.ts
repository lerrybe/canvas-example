import { useCallback } from "react";

import { ResizeDirection, Shape } from "./type";

export const usePointInsideShape = () => {
  return useCallback(
    (mouseX: number, mouseY: number, shape: Shape): boolean => {
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const angle = -shape.angle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const rotatedMouseX =
        (mouseX - centerX) * cos - (mouseY - centerY) * sin + centerX;
      const rotatedMouseY =
        (mouseX - centerX) * sin + (mouseY - centerY) * cos + centerY;

      return (
        rotatedMouseX >= shape.x &&
        rotatedMouseX <= shape.x + shape.width &&
        rotatedMouseY >= shape.y &&
        rotatedMouseY <= shape.y + shape.height
      );
    },
    []
  );
};

export const usePointInsideResizeHandle = () => {
  return useCallback(
    (
      mouseX: number,
      mouseY: number,
      shape: Shape,
      handleType: string
    ): boolean => {
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const angle = -shape.angle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const rotatedMouseX =
        (mouseX - centerX) * cos - (mouseY - centerY) * sin + centerX;
      const rotatedMouseY =
        (mouseX - centerX) * sin + (mouseY - centerY) * cos + centerY;

      const handleSize = 10;

      if (handleType === ResizeDirection.TOP_LEFT) {
        return (
          rotatedMouseX >= shape.x - handleSize &&
          rotatedMouseX <= shape.x + handleSize &&
          rotatedMouseY >= shape.y - handleSize &&
          rotatedMouseY <= shape.y + handleSize
        );
      } else if (handleType === ResizeDirection.TOP_RIGHT) {
        return (
          rotatedMouseX >= shape.x + shape.width - handleSize &&
          rotatedMouseX <= shape.x + shape.width + handleSize &&
          rotatedMouseY >= shape.y - handleSize &&
          rotatedMouseY <= shape.y + handleSize
        );
      } else if (handleType === ResizeDirection.BOTTOM_LEFT) {
        return (
          rotatedMouseX >= shape.x - handleSize &&
          rotatedMouseX <= shape.x + handleSize &&
          rotatedMouseY >= shape.y + shape.height - handleSize &&
          rotatedMouseY <= shape.y + shape.height + handleSize
        );
      } else if (handleType === ResizeDirection.BOTTOM_RIGHT) {
        return (
          rotatedMouseX >= shape.x + shape.width - handleSize &&
          rotatedMouseX <= shape.x + shape.width + handleSize &&
          rotatedMouseY >= shape.y + shape.height - handleSize &&
          rotatedMouseY <= shape.y + shape.height + handleSize
        );
      }

      return false;
    },
    []
  );
};

export const usePointInsideRotateHandle = () => {
  return useCallback(
    (mouseX: number, mouseY: number, shape: Shape): boolean => {
      const centerX = shape.x + shape.width / 2;
      const centerY = shape.y + shape.height / 2;
      const angle = -shape.angle;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const rotatedMouseX =
        (mouseX - centerX) * cos - (mouseY - centerY) * sin + centerX;
      const rotatedMouseY =
        (mouseX - centerX) * sin + (mouseY - centerY) * cos + centerY;

      const handleSize = 10;

      return (
        rotatedMouseX >= shape.x + shape.width / 2 - handleSize &&
        rotatedMouseX <= shape.x + shape.width / 2 + handleSize &&
        rotatedMouseY >= shape.y - 30 - handleSize &&
        rotatedMouseY <= shape.y - 30 + handleSize
      );
    },
    []
  );
};
