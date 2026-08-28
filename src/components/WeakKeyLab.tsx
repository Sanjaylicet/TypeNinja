import React, { useMemo, useState } from 'react';
import { CourseModule, Lesson, UserCourseProgress, WeakKeySummary } from '../types/course';
import { analyzeWeakKeys, generateWeakKeyDrillText } from '../utils/weakKeyAlgorithm';
import { FINGER_DETAILS, KEYBOARD_LAYOUT_ROWS } from '../utils/keyboardMapping';
import { AlertCircle, Flame, Play, RefreshCw, Sparkles, Target, Zap } from 'lucide-react';

interface WeakKeyLabProps {
  progress: UserCourseProgress;
  onLaunchDynamicDrill: (lesson: Lesson, dummyModule: CourseModule) => void;
}

export const WeakKeyLab: React.FC<WeakKeyLabProps> = ({
  progress,
  onLaunchDynamicDrill,
}) => {
  const [drillLength, setDrillLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [drillSeed, setDrillSeed] = useState<number>(0);

  // Analyze weak keys using algorithm
  const weakKeys: WeakKeySummary[] = useMemo(() => {
    return analyzeWeakKeys(progress.keyStats || {}, 3);
  }, [progress.keyStats]);

  // Generate dynamic practice text
  const dynamicPracticeText = useMemo(() => {
    const targetKeyChars = weakKeys.map((w) => w.key);
    return generateWeakKeyDrillText(targetKeyChars, drillLength);
  }, [weakKeys, drillLength, drillSeed]);

  const handleRegenerate = () => {
    setDrillSeed((prev) => prev + 1);
  };

  const handleStartPractice = () => {
    const targetKeyChars = weakKeys.map((w) => w.key);
    const dynamicLesson: Lesson = {
      id: `weak-key-custom-${Date.now()}`,
      moduleId: 'module-5',
      lessonNumber: 99,
      title: `Adaptive Weak-Key Drill: [${targetKeyChars.map((k) => k.toUpperCase()).join(', ')}]`,
      description: `Targeted retraining drill focusing heavily on your top 3 problematic keys: ${targetKeyChars.join(', ')}.`,
      focusKeys: targetKeyChars,
      targetWpm: 40,
      targetAccuracy: 97,
      drillText: dynamicPracticeText,
      type: 'drill',
      tip: 'Focus on clean finger positioning and smooth transitions around these problem keys.',
    };

    const dummyModule: CourseModule = {
      id: 'module-weak-lab',
      moduleNumber: 0,
      title: 'Weak-Key Retraining Lab',
      subtitle: 'Dynamic Algorithm Generation',
      description: 'Algorithmic practice strings generated from your real mistake telemetry.',
      iconName: 'Sparkles',
      targetWpm: 40,
      targetAccuracy: 97,
      color: '#FF6B6B',
      badge: 'ADAPTIVE RETRAINING',
      lessons: [dynamicLesson],
    };

    onLaunchDynamicDrill(dynamicLesson, dummyModule);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-[#FF6B6B] brutal-border-thick brutal-shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white text-xs font-black uppercase px-2.5 py-1 brutal-border mb-2">
            Targeted Problem-Area Retraining
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Weak-Key Retraining Lab
          </h1>
          <p className="text-sm font-bold text-black/80 max-w-2xl mt-1">
            Our algorithm analyzes your historical mistake telemetry, computes error frequencies and keystroke latencies, and generates targeted n-gram drill patterns to rebuild finger muscle memory.
          </p>
        </div>

        <div className="bg-white p-4 brutal-border brutal-shadow-sm text-center shrink-0 w-full md:w-auto">
          <div className="text-[11px] font-black uppercase text-gray-600">Tracked Keys</div>
          <div className="text-3xl font-black text-black">
            {Object.keys(progress.keyStats || {}).length} Keys
          </div>
          <div className="text-[11px] font-bold text-gray-500">Live Telemetry Active</div>
        </div>
      </div>

      {/* Top 3 Worst Keys Diagnostics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#FF6B6B]" />
            <span>Top 3 Bottleneck Keys</span>
          </h2>
          <span className="text-xs font-bold text-gray-600">
            Weighted by 70% error rate + 30% strike latency
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakKeys.map((item, index) => {
            const fingerInfo = FINGER_DETAILS[item.finger];
            return (
              <div
                key={item.key}
                className="bg-white brutal-border-thick brutal-shadow p-5 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Ranking tag */}
                <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-3 py-1 brutal-border">
                  #{index + 1} WEAKEST
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-[#FFDE03] brutal-border flex items-center justify-center font-mono-code font-black text-3xl text-black">
                      {item.key.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase text-gray-500">Target Key</div>
                      <div className="text-sm font-black text-black">{fingerInfo.name}</div>
                      <span
                        className="inline-block text-[10px] font-black px-1.5 py-0.2 brutal-border mt-1"
                        style={{ backgroundColor: fingerInfo.colorBg }}
                      >
                        {fingerInfo.hand.toUpperCase()} HAND
                      </span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 bg-[#FFFDF7] p-2.5 brutal-border my-2 text-center text-xs">
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase">Error Rate</div>
                      <div className="text-base font-black text-[#FF6B6B]">{item.errorRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase">Avg Latency</div>
                      <div className="text-base font-black text-black">{item.avgLatencyMs}ms</div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[11px] font-bold text-gray-600">
                  <span className="font-black text-black">Sample Words: </span>
                  {item.recommendedDrills.slice(0, 3).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Drill Generator Section */}
      <div className="bg-white brutal-border-thick brutal-shadow-lg p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFDE03] fill-[#FFDE03]" />
              <span>Algorithmic Drill Synthesizer</span>
            </h2>
            <p className="text-xs font-bold text-gray-600">
              Generates custom trigrams, repetition transitions, and contextual words around your weak keys.
            </p>
          </div>

          {/* Drill Length Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase text-gray-600 mr-1">Length:</span>
            {(['short', 'medium', 'long'] as const).map((len) => (
              <button
                key={len}
                onClick={() => setDrillLength(len)}
                className={`px-2.5 py-1 text-xs font-black uppercase brutal-border transition-all ${
                  drillLength === len
                    ? 'bg-black text-white brutal-shadow-sm'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {len === 'short' ? 'Sprint (18w)' : len === 'medium' ? 'Standard (32w)' : 'Deep (55w)'}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Drill Preview Box */}
        <div className="bg-[#FFFDF7] brutal-border p-4 font-mono-code text-base sm:text-lg leading-relaxed text-black/90 max-h-36 overflow-y-auto">
          {dynamicPracticeText}
        </div>

        {/* Generator Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleRegenerate}
            className="px-4 py-2.5 bg-white text-black font-black uppercase text-xs sm:text-sm brutal-border brutal-shadow-sm hover:bg-gray-100 flex items-center gap-2 brutal-btn-press"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Shuffle Variation</span>
          </button>

          <button
            onClick={handleStartPractice}
            className="px-6 py-3 bg-[#FFDE03] text-black font-black uppercase text-xs sm:text-sm tracking-wider brutal-border brutal-shadow hover:bg-[#ffe338] flex items-center gap-2 brutal-btn-press"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch Weak-Key Retraining Drill</span>
          </button>
        </div>
      </div>

      {/* Keyboard Error Heatmap */}
      <div className="bg-white brutal-border-thick brutal-shadow p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black uppercase tracking-tight">
            Full Keyboard Mistake Frequency Heatmap
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#6BCB77] border border-black inline-block"></span> High Accuracy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#FFDE03] border border-black inline-block"></span> Moderate Errors
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#FF6B6B] border border-black inline-block"></span> High Errors
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 font-mono-code">
          {KEYBOARD_LAYOUT_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-center">
              {row.map((key) => {
                const char = key.baseChar.toLowerCase();
                const stat = progress.keyStats?.[char];
                const attempts = stat?.attempts || 0;
                const errors = stat?.errors || 0;
                const errorRate = attempts > 0 ? (errors / attempts) * 100 : 0;

                let heatColor = '#F3F4F6';
                if (attempts > 0) {
                  if (errorRate > 15) {
                    heatColor = '#FF6B6B';
                  } else if (errorRate > 5) {
                    heatColor = '#FFDE03';
                  } else {
                    heatColor = '#6BCB77';
                  }
                }

                const widthMultiplier = key.widthMultiplier || 1;

                return (
                  <div
                    key={key.code}
                    className="p-1 sm:p-2 text-center text-xs font-black border border-black"
                    style={{
                      backgroundColor: heatColor,
                      flex: `${widthMultiplier} 1 0%`,
                      minWidth: '26px',
                    }}
                    title={`${key.baseChar}: ${attempts} tries, ${errors} mistakes (${Math.round(errorRate)}%)`}
                  >
                    <div>{key.baseChar === 'Space' ? 'SPACE' : key.baseChar}</div>
                    {attempts > 0 && (
                      <div className="text-[8px] font-bold text-black/75">
                        {Math.round(errorRate)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
