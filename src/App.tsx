/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-black flex flex-col items-center justify-center p-8 font-sans">
      <h1 className="text-6xl font-black uppercase bg-[#A3E635] px-6 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2 mb-12">
        TypeNinja
      </h1>
      <p className="text-2xl font-bold mb-8 uppercase bg-[#F472B6] px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        Neo-Brutalism Edition
      </p>
      <div className="max-w-2xl bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <p className="text-lg font-medium">
          The entire application logic is contained within <code className="bg-gray-200 px-1">index.html</code> as a vanilla HTML/CSS/JS implementation 
          to ensure zero-cost AWS Amplify hosting.
        </p>
        <p className="text-lg font-medium">
          AWS configurations and Solution Architecture deliverables can be found in <code className="bg-gray-200 px-1">AWS_CONFIG.md</code>.
        </p>
      </div>
      <div className="mt-12">
        <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase">
          Static Project Placeholder
        </div>
      </div>
    </div>
  );
}
