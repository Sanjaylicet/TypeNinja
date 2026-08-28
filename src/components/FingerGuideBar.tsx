import React from 'react';
import { FingerId } from '../types/course';
import { FINGER_DETAILS } from '../utils/keyboardMapping';

interface FingerGuideBarProps {
  activeFinger?: FingerId;
  targetChar?: string;
  requiredShiftSide?: 'left' | 'right' | null;
}

export const FingerGuideBar: React.FC<FingerGuideBarProps> = ({
  activeFinger,
  targetChar,
  requiredShiftSide,
}) => {
  const activeFingerInfo = activeFinger ? FINGER_DETAILS[activeFinger] : null;

  const leftHandFingers: FingerId[] = [
    'left-pinky',
    'left-ring',
    'left-middle',
    'left-index',
    'left-thumb',
  ];

  const rightHandFingers: FingerId[] = [
    'right-thumb',
    'right-index',
    'right-middle',
    'right-ring',
    'right-pinky',
  ];

  const getFingerLabel = (id: FingerId) => {
    switch (id) {
      case 'left-pinky':
        return 'Pinky (A/Q/Z/1)';
      case 'left-ring':
        return 'Ring (S/W/X/2)';
      case 'left-middle':
        return 'Middle (D/E/C/3)';
      case 'left-index':
        return 'Index (F/R/T/G/V/B)';
      case 'left-thumb':
      case 'right-thumb':
        return 'Thumb (Space)';
      case 'right-index':
        return 'Index (J/Y/U/H/N/M)';
      case 'right-middle':
        return 'Middle (K/I/,/8)';
      case 'right-ring':
        return 'Ring (L/O/./9)';
      case 'right-pinky':
        return 'Pinky (;/:/P/?)';
    }
  };

  return (
    <div className="w-full bg-[#FFFDF7] brutal-border brutal-shadow p-3.5 my-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 brutal-border">
            FINGER ANCHOR
          </span>
          {activeFingerInfo ? (
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-black px-2.5 py-0.5 brutal-border"
                style={{ backgroundColor: activeFingerInfo.colorBg, color: activeFingerInfo.colorText }}
              >
                {activeFingerInfo.name}
              </span>
              <span className="text-xs font-bold text-gray-700">
                Target: <span className="font-mono-code font-black text-sm text-black">"{targetChar === ' ' ? 'SPACE' : targetChar}"</span>
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold text-gray-500">Press any key to start...</span>
          )}
        </div>

        {requiredShiftSide && (
          <div className="flex items-center gap-1.5 bg-[#FF6B6B] text-black px-2 py-0.5 brutal-border text-xs font-black animate-pulse">
            <span>⚡ HOLD {requiredShiftSide.toUpperCase()} SHIFT</span>
            <span className="text-[10px] font-bold bg-white px-1 brutal-border">OPPOSITE HAND</span>
          </div>
        )}
      </div>

      {/* Hands Diagram / Interactive Finger Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Hand */}
        <div className="bg-white p-2 brutal-border">
          <div className="text-[11px] font-black uppercase tracking-wider text-gray-600 mb-1 flex justify-between items-center">
            <span>Left Hand</span>
            {requiredShiftSide === 'left' && (
              <span className="bg-[#FFDE03] text-black px-1.5 py-0.2 brutal-border text-[10px] font-black">
                LEFT SHIFT ACTIVE
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1 text-center">
            {leftHandFingers.map((fId) => {
              const info = FINGER_DETAILS[fId];
              const isActive = activeFinger === fId;
              return (
                <div
                  key={fId}
                  className={`p-1.5 text-[10px] font-bold transition-all ${
                    isActive
                      ? 'brutal-border brutal-shadow-sm scale-105 font-black z-10'
                      : 'border border-gray-300 opacity-70'
                  }`}
                  style={{
                    backgroundColor: isActive ? info.colorBg : '#f9fafb',
                    color: isActive ? info.colorText : '#374151',
                  }}
                  title={getFingerLabel(fId)}
                >
                  <div className="truncate">{info.name.replace('Left ', '')}</div>
                  {isActive && <div className="text-[9px] uppercase tracking-tighter">HIT</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand */}
        <div className="bg-white p-2 brutal-border">
          <div className="text-[11px] font-black uppercase tracking-wider text-gray-600 mb-1 flex justify-between items-center">
            <span>Right Hand</span>
            {requiredShiftSide === 'right' && (
              <span className="bg-[#FFDE03] text-black px-1.5 py-0.2 brutal-border text-[10px] font-black">
                RIGHT SHIFT ACTIVE
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1 text-center">
            {rightHandFingers.map((fId) => {
              const info = FINGER_DETAILS[fId];
              const isActive = activeFinger === fId;
              return (
                <div
                  key={fId}
                  className={`p-1.5 text-[10px] font-bold transition-all ${
                    isActive
                      ? 'brutal-border brutal-shadow-sm scale-105 font-black z-10'
                      : 'border border-gray-300 opacity-70'
                  }`}
                  style={{
                    backgroundColor: isActive ? info.colorBg : '#f9fafb',
                    color: isActive ? info.colorText : '#374151',
                  }}
                  title={getFingerLabel(fId)}
                >
                  <div className="truncate">{info.name.replace('Right ', '')}</div>
                  {isActive && <div className="text-[9px] uppercase tracking-tighter">HIT</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
