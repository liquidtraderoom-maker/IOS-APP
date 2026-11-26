import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          ApexHQ
        </h1>
        <p className="text-xl text-gray-400 mb-2">Virtual Office</p>
        <p className="text-gray-500 mb-8">
          6 AI agents working 24/7 to reach $5,000-$10,000/month hands-free
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="bg-apex-card p-4 rounded-lg border border-apex-border">
            <div className="text-2xl mb-2">👔</div>
            <div className="font-medium">Marcus</div>
            <div className="text-gray-500">Strategy</div>
          </div>
          <div className="bg-apex-card p-4 rounded-lg border border-apex-border">
            <div className="text-2xl mb-2">📞</div>
            <div className="font-medium">Alen</div>
            <div className="text-gray-500">Outbound</div>
          </div>
          <div className="bg-apex-card p-4 rounded-lg border border-apex-border">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-medium">Keith</div>
            <div className="text-gray-500">Build</div>
          </div>
          <div className="bg-apex-card p-4 rounded-lg border border-apex-border">
            <div className="text-2xl mb-2">✨</div>
            <div className="font-medium">Mya</div>
            <div className="text-gray-500">Content</div>
          </div>
          <div className="bg-apex-card p-4 rounded-lg border border-apex-border">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Jin</div>
            <div className="text-gray-500">Operations</div>
          </div>
          <div className="bg-apex-card p-4 rounded-lg border border-apex-border">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium">Elena</div>
            <div className="text-gray-500">Support</div>
          </div>
        </div>

        <Link
          href="/office"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Enter Virtual Office
        </Link>
      </div>
    </main>
  );
}
