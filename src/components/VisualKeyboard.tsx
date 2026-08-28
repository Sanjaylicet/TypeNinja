import React from 'react';
import { FingerId, KeyMapEntry } from '../types/course';
import { FINGER_DETAILS, KEYBOARD_LAYOUT_ROWS } from '../utils/keyboardMapping';

interface VisualKeyboardProps {
  currentTargetChar?: string;
  activeShiftKey?: 'ShiftLeft' | 'ShiftRight' | null;
  targetKeyEntry?: KeyMapEntry;
}

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({
  currentTargetChar = '',
  activeShiftKey = null,
  targetKeyEntry,
}) => {
  // Check if target character requires shift
  const isTargetShifted = Boolean(
    targetKeyEntry?.shiftChar && currentTargetChar === targetKeyEntry.shiftChar
  );

  const requiredShiftSide = isTargetShifted ? targetKeyEntry?.requiredShiftSide : null;

  return (
    <div className="w-full bg-[#E5E7EB] brutal-border brutal-shadow p-3 select-none">
      {/* Keyboard Header / Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-black text-xs">
        <div className="flex items-center gap-1.5 font-black uppercase text-[11px]">
          <span className="w-2.5 h-2.5 bg-black inline-block"></span>
          <span>Tactile Visual Keyboard</span>
        </div>

        {/* Legend color chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              ['left-pinky', 'L-Pinky'],
              ['left-ring', 'L-Ring'],
              ['left-middle', 'L-Mid'],
              ['left-index', 'L-Index'],
              ['left-thumb', 'Thumb'],
              ['right-index', 'R-Index'],
              ['right-middle', 'R-Mid'],
              ['right-ring', 'R-Ring'],
              ['right-pinky', 'R-Pinky'],
            ] as [FingerId, string][]
          ).map(([fId, label]) => {
            const info = FINGER_DETAILS[fId];
            return (
              <div
                key={fId}
                className="flex items-center gap-1 px-1.5 py-0.5 border border-black text-[10px] font-bold bg-white"
              >
                <span
                  className="w-2 h-2 rounded-full border border-black inline-block"
                  style={{ backgroundColor: info.colorBg }}
                ></span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Keys Layout */}
      <div className="flex flex-col gap-1.5 font-mono-code">
        {KEYBOARD_LAYOUT_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center w-full">
            {row.map((key) => {
              const fingerInfo = FINGER_DETAILS[key.finger];

              // Is this key the target key?
              const isTargetKey =
                targetKeyEntry &&
                (targetKeyEntry.code === key.code ||
                  (key.baseChar === 'Space' && currentTargetChar === ' '));

              // Is this key a Shift key that should be pressed?
              const isRequiredShiftKey =
                (key.code === 'ShiftLeft' && requiredShiftSide === 'left') ||
                (key.code === 'ShiftRight' && requiredShiftSide === 'right');

              // Is this key actively pressed by the user?
              const isShiftPressed =
                (key.code === 'ShiftLeft' && activeShiftKey === 'ShiftLeft') ||
                (key.code === 'ShiftRight' && activeShiftKey === 'ShiftRight');

              // Base flex sizing based on key width
              const flexGrow = key.widthMultiplier || 1;

              return (
                <div
                  key={key.code}
                  className={`relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-none transition-all duration-75 text-center min-w-[28px] sm:min-w-[42px] h-10 sm:h-12 border-2 border-black ${
                    isTargetKey
                      ? 'bg-[#FFDE03] text-black font-black scale-105 z-20 shadow-[3px_3px_0px_#000] ring-2 ring-black'
                      : isRequiredShiftKey
                      ? 'bg-[#FF6B6B] text-black font-black animate-pulse z-10 shadow-[2px_2px_0px_#000]'
                      : isShiftPressed
                      ? 'bg-[#00E5FF] text-black font-black translate-y-[2px]'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                  style={{
                    flex: `${flexGrow} 1 0%`,
                    borderBottomWidth: isShiftPressed ? '2px' : '4px',
                  }}
                >
                  {/* Finger color top-stripe */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: fingerInfo.colorBg }}
                  />

                  {/* Shift Label / Secondary Symbol */}
                  {key.shiftChar && (
                    <span
                      className={`text-[9px] sm:text-[10px] leading-tight ${
                        isTargetShifted && isTargetKey ? 'font-black text-black' : 'text-gray-500'
                      }`}
                    >
                      {key.shiftChar}
                    </span>
                  )}

                  {/* Primary Key Label */}
                  <span
                    className={`text-xs sm:text-sm font-bold uppercase leading-none ${
                      isTargetKey ? 'font-black text-black scale-110' : ''
                    }`}
                  >
                    {key.baseChar === ' '
                      ? 'SPACEBAR'
                      : key.baseChar === 'Backspace'
                      ? '⌫ BACK'
                      : key.baseChar === 'Shift'
                      ? key.code === 'ShiftLeft'
                        ? '⇧ L-SHIFT'
                        : '⇧ R-SHIFT'
                      : key.baseChar}
                  </span>

                  {/* Target Pointer Badge */}
                  {isTargetKey && (
                    <span className="absolute -top-3 bg-black text-[#FFDE03] text-[9px] font-black px-1 border border-black shadow-[1px_1px_0px_#FFDE03]">
                      PRESS
                    </span>
                  )}

                  {isRequiredShiftKey && (
                    <span className="absolute -bottom-3 bg-[#FF6B6B] text-black text-[9px] font-black px-1 border border-black">
                      HOLD SHIFT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
