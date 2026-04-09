/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#646669] flex flex-col items-center justify-center p-8 font-mono">
      <h1 className="text-4xl text-[#e2b714] mb-4">TypeNinja</h1>
      <p className="text-xl mb-8">This is a static SPA project.</p>
      <div className="max-w-2xl text-center space-y-4">
        <p>
          The entire application logic is contained within <code>index.html</code> as a vanilla HTML/CSS/JS implementation 
          to ensure zero-cost AWS Amplify hosting.
        </p>
        <p>
          AWS configurations and Solution Architecture deliverables can be found in <code>AWS_CONFIG.md</code>.
        </p>
      </div>
    </div>
  );
}
