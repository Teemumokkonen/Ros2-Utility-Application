const ps5Inputs = {
  button: [
    { id: 'cross', label: '✖', slot: 0},
    { id: 'circle', label: '⭕', slot: 1},
    { id: 'square', label: '⬛', slot: 3},
    { id: 'triangle', label: '🔺', slot: 2},
    { id: 'l1', label: 'L1', slot: 4},
    { id: 'r1', label: 'R1', slot: 5},
    { id: 'l2', label: 'L2' },
    { id: 'r2', label: 'R2' },
    { id: 'dpad_up', label: '↑', slot: 7},
    { id: 'dpad_down', label: '↓', slot: 6},
    { id: 'dpad_left', label: '←', slot: 6},
    { id: 'dpad_right', label: '→', slot: 7},
  ],
  joystick: [
    { id: 'left_stick', label: '🕹 Left Stick', slot: [4, 3]},
    { id: 'right_stick', label: '🕹 Right Stick', slot:[1, 0]},
  ],
};

export default ps5Inputs;