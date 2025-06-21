import React from 'react';
import { View } from 'react-native';
import Canvas from 'react-native-canvas';

const OccupancyGridCanvas = ({ grid }) => {
  const handleCanvas = async (canvas) => {
    if (!canvas) return;

    const ctx = await canvas.getContext('2d');

    const { width, height, data } = grid;
    const scale = 2; // To enlarge each cell

    canvas.width = width * scale;
    canvas.height = height * scale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const value = data[idx];

        let color = 'gray'; // unknown by default
        if (value === 0) color = 'white';      // free
        else if (value === 100) color = 'black'; // occupied

        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  };

  return (
    <View>
      <Canvas ref={handleCanvas} />
    </View>
  );
};

export default OccupancyGridCanvas;
