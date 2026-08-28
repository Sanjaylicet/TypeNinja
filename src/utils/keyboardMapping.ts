import { FingerId, FingerInfo, KeyMapEntry } from '../types/course';

export const FINGER_DETAILS: Record<FingerId, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    name: 'Left Pinky',
    hand: 'left',
    colorBg: '#FF6B6B',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'Q, A, Z, 1, Tab, Left Shift',
  },
  'left-ring': {
    id: 'left-ring',
    name: 'Left Ring',
    hand: 'left',
    colorBg: '#FFA06B',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'W, S, X, 2',
  },
  'left-middle': {
    id: 'left-middle',
    name: 'Left Middle',
    hand: 'left',
    colorBg: '#FFD93D',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'E, D, C, 3',
  },
  'left-index': {
    id: 'left-index',
    name: 'Left Index',
    hand: 'left',
    colorBg: '#6BCB77',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'R, T, F, G, V, B, 4, 5',
  },
  'left-thumb': {
    id: 'left-thumb',
    name: 'Left Thumb',
    hand: 'thumb',
    colorBg: '#4D96FF',
    colorBorder: '#000000',
    colorText: '#FFFFFF',
    description: 'Spacebar',
  },
  'right-thumb': {
    id: 'right-thumb',
    name: 'Right Thumb',
    hand: 'thumb',
    colorBg: '#4D96FF',
    colorBorder: '#000000',
    colorText: '#FFFFFF',
    description: 'Spacebar',
  },
  'right-index': {
    id: 'right-index',
    name: 'Right Index',
    hand: 'right',
    colorBg: '#00E5FF',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'Y, U, H, J, N, M, 6, 7',
  },
  'right-middle': {
    id: 'right-middle',
    name: 'Right Middle',
    hand: 'right',
    colorBg: '#C084FC',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'I, K, comma, <, 8',
  },
  'right-ring': {
    id: 'right-ring',
    name: 'Right Ring',
    hand: 'right',
    colorBg: '#F472B6',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'O, L, period, >, 9',
  },
  'right-pinky': {
    id: 'right-pinky',
    name: 'Right Pinky',
    hand: 'right',
    colorBg: '#FB7185',
    colorBorder: '#000000',
    colorText: '#000000',
    description: 'P, ;, :, quotes, ?, /, 0, -, =, Enter, Right Shift',
  },
};

/**
 * Standard QWERTY Keyboard Rows Definition
 */
export const KEYBOARD_LAYOUT_ROWS: KeyMapEntry[][] = [
  // Row 0: Numbers & Symbols
  [
    { code: 'Backquote', baseChar: '`', shiftChar: '~', finger: 'left-pinky', hand: 'left', row: 0, requiredShiftSide: 'right' },
    { code: 'Digit1', baseChar: '1', shiftChar: '!', finger: 'left-pinky', hand: 'left', row: 0, requiredShiftSide: 'right' },
    { code: 'Digit2', baseChar: '2', shiftChar: '@', finger: 'left-ring', hand: 'left', row: 0, requiredShiftSide: 'right' },
    { code: 'Digit3', baseChar: '3', shiftChar: '#', finger: 'left-middle', hand: 'left', row: 0, requiredShiftSide: 'right' },
    { code: 'Digit4', baseChar: '4', shiftChar: '$', finger: 'left-index', hand: 'left', row: 0, requiredShiftSide: 'right' },
    { code: 'Digit5', baseChar: '5', shiftChar: '%', finger: 'left-index', hand: 'left', row: 0, requiredShiftSide: 'right' },
    { code: 'Digit6', baseChar: '6', shiftChar: '^', finger: 'right-index', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Digit7', baseChar: '7', shiftChar: '&', finger: 'right-index', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Digit8', baseChar: '8', shiftChar: '*', finger: 'right-middle', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Digit9', baseChar: '9', shiftChar: '(', finger: 'right-ring', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Digit0', baseChar: '0', shiftChar: ')', finger: 'right-pinky', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Minus', baseChar: '-', shiftChar: '_', finger: 'right-pinky', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Equal', baseChar: '=', shiftChar: '+', finger: 'right-pinky', hand: 'right', row: 0, requiredShiftSide: 'left' },
    { code: 'Backspace', baseChar: 'Backspace', finger: 'right-pinky', hand: 'right', row: 0, widthMultiplier: 1.6 },
  ],
  // Row 1: Top Row (QWERTY)
  [
    { code: 'Tab', baseChar: 'Tab', finger: 'left-pinky', hand: 'left', row: 1, widthMultiplier: 1.4 },
    { code: 'KeyQ', baseChar: 'q', shiftChar: 'Q', finger: 'left-pinky', hand: 'left', row: 1, requiredShiftSide: 'right' },
    { code: 'KeyW', baseChar: 'w', shiftChar: 'W', finger: 'left-ring', hand: 'left', row: 1, requiredShiftSide: 'right' },
    { code: 'KeyE', baseChar: 'e', shiftChar: 'E', finger: 'left-middle', hand: 'left', row: 1, requiredShiftSide: 'right' },
    { code: 'KeyR', baseChar: 'r', shiftChar: 'R', finger: 'left-index', hand: 'left', row: 1, requiredShiftSide: 'right' },
    { code: 'KeyT', baseChar: 't', shiftChar: 'T', finger: 'left-index', hand: 'left', row: 1, requiredShiftSide: 'right' },
    { code: 'KeyY', baseChar: 'y', shiftChar: 'Y', finger: 'right-index', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'KeyU', baseChar: 'u', shiftChar: 'U', finger: 'right-index', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'KeyI', baseChar: 'i', shiftChar: 'I', finger: 'right-middle', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'KeyO', baseChar: 'o', shiftChar: 'O', finger: 'right-ring', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'KeyP', baseChar: 'p', shiftChar: 'P', finger: 'right-pinky', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'BracketLeft', baseChar: '[', shiftChar: '{', finger: 'right-pinky', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'BracketRight', baseChar: ']', shiftChar: '}', finger: 'right-pinky', hand: 'right', row: 1, requiredShiftSide: 'left' },
    { code: 'Backslash', baseChar: '\\', shiftChar: '|', finger: 'right-pinky', hand: 'right', row: 1, requiredShiftSide: 'left' },
  ],
  // Row 2: Home Row (ASDF JKL;)
  [
    { code: 'CapsLock', baseChar: 'Caps', finger: 'left-pinky', hand: 'left', row: 2, widthMultiplier: 1.6 },
    { code: 'KeyA', baseChar: 'a', shiftChar: 'A', finger: 'left-pinky', hand: 'left', row: 2, requiredShiftSide: 'right' },
    { code: 'KeyS', baseChar: 's', shiftChar: 'S', finger: 'left-ring', hand: 'left', row: 2, requiredShiftSide: 'right' },
    { code: 'KeyD', baseChar: 'd', shiftChar: 'D', finger: 'left-middle', hand: 'left', row: 2, requiredShiftSide: 'right' },
    { code: 'KeyF', baseChar: 'f', shiftChar: 'F', finger: 'left-index', hand: 'left', row: 2, requiredShiftSide: 'right' },
    { code: 'KeyG', baseChar: 'g', shiftChar: 'G', finger: 'left-index', hand: 'left', row: 2, requiredShiftSide: 'right' },
    { code: 'KeyH', baseChar: 'h', shiftChar: 'H', finger: 'right-index', hand: 'right', row: 2, requiredShiftSide: 'left' },
    { code: 'KeyJ', baseChar: 'j', shiftChar: 'J', finger: 'right-index', hand: 'right', row: 2, requiredShiftSide: 'left' },
    { code: 'KeyK', baseChar: 'k', shiftChar: 'K', finger: 'right-middle', hand: 'right', row: 2, requiredShiftSide: 'left' },
    { code: 'KeyL', baseChar: 'l', shiftChar: 'L', finger: 'right-ring', hand: 'right', row: 2, requiredShiftSide: 'left' },
    { code: 'Semicolon', baseChar: ';', shiftChar: ':', finger: 'right-pinky', hand: 'right', row: 2, requiredShiftSide: 'left' },
    { code: 'Quote', baseChar: "'", shiftChar: '"', finger: 'right-pinky', hand: 'right', row: 2, requiredShiftSide: 'left' },
    { code: 'Enter', baseChar: 'Enter', finger: 'right-pinky', hand: 'right', row: 2, widthMultiplier: 1.9 },
  ],
  // Row 3: Bottom Row (ZXCVBNM)
  [
    { code: 'ShiftLeft', baseChar: 'Shift', finger: 'left-pinky', hand: 'left', row: 3, widthMultiplier: 2.1 },
    { code: 'KeyZ', baseChar: 'z', shiftChar: 'Z', finger: 'left-pinky', hand: 'left', row: 3, requiredShiftSide: 'right' },
    { code: 'KeyX', baseChar: 'x', shiftChar: 'X', finger: 'left-ring', hand: 'left', row: 3, requiredShiftSide: 'right' },
    { code: 'KeyC', baseChar: 'c', shiftChar: 'C', finger: 'left-middle', hand: 'left', row: 3, requiredShiftSide: 'right' },
    { code: 'KeyV', baseChar: 'v', shiftChar: 'V', finger: 'left-index', hand: 'left', row: 3, requiredShiftSide: 'right' },
    { code: 'KeyB', baseChar: 'b', shiftChar: 'B', finger: 'left-index', hand: 'left', row: 3, requiredShiftSide: 'right' },
    { code: 'KeyN', baseChar: 'n', shiftChar: 'N', finger: 'right-index', hand: 'right', row: 3, requiredShiftSide: 'left' },
    { code: 'KeyM', baseChar: 'm', shiftChar: 'M', finger: 'right-index', hand: 'right', row: 3, requiredShiftSide: 'left' },
    { code: 'Comma', baseChar: ',', shiftChar: '<', finger: 'right-middle', hand: 'right', row: 3, requiredShiftSide: 'left' },
    { code: 'Period', baseChar: '.', shiftChar: '>', finger: 'right-ring', hand: 'right', row: 3, requiredShiftSide: 'left' },
    { code: 'Slash', baseChar: '/', shiftChar: '?', finger: 'right-pinky', hand: 'right', row: 3, requiredShiftSide: 'left' },
    { code: 'ShiftRight', baseChar: 'Shift', finger: 'right-pinky', hand: 'right', row: 3, widthMultiplier: 2.4 },
  ],
  // Row 4: Space Row
  [
    { code: 'Space', baseChar: 'Space', finger: 'right-thumb', hand: 'thumb', row: 4, widthMultiplier: 6.5 },
  ],
];

/**
 * Character to Key Lookup Map
 */
const CHAR_TO_KEY_MAP: Map<string, KeyMapEntry> = new Map();

// Populate lookup map
KEYBOARD_LAYOUT_ROWS.forEach((row) => {
  row.forEach((entry) => {
    if (entry.baseChar) {
      CHAR_TO_KEY_MAP.set(entry.baseChar, entry);
    }
    if (entry.shiftChar) {
      CHAR_TO_KEY_MAP.set(entry.shiftChar, entry);
    }
  });
});
// Explicit space mapping
CHAR_TO_KEY_MAP.set(' ', {
  code: 'Space',
  baseChar: ' ',
  finger: 'right-thumb',
  hand: 'thumb',
  row: 4,
});

/**
 * Helper to find key details by target character
 */
export function getKeyEntryForChar(char: string): KeyMapEntry | undefined {
  if (!char) return undefined;
  return CHAR_TO_KEY_MAP.get(char);
}

/**
 * Validates whether the correct Shift key was pressed for a capital/shifted character.
 * Rule: Left-hand keys require Right Shift (ShiftRight); Right-hand keys require Left Shift (ShiftLeft).
 */
export function validateShiftDiscipline(
  targetChar: string,
  activeShiftSide: 'ShiftLeft' | 'ShiftRight' | null
): { isShiftRequired: boolean; isCorrectShift: boolean; expectedShift: 'ShiftLeft' | 'ShiftRight' | null } {
  const entry = getKeyEntryForChar(targetChar);

  if (!entry || !entry.shiftChar || targetChar !== entry.shiftChar) {
    return { isShiftRequired: false, isCorrectShift: true, expectedShift: null };
  }

  const expectedShift = entry.requiredShiftSide === 'right' ? 'ShiftRight' : 'ShiftLeft';
  const isCorrectShift = activeShiftSide === expectedShift;

  return {
    isShiftRequired: true,
    isCorrectShift,
    expectedShift,
  };
}
