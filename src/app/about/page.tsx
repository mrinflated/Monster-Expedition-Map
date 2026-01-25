import Header from "@/components/Layout/Header";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto max-w-2xl py-12 px-6">
        <h1 className="text-4xl  font-bold mb-8 text-primary-green">About</h1>
        
        <div className="prose prose-lg text-gray-800">
          <p className="mb-6">
            This is an interactive map and tracker for the game <strong>A Monster&apos;s Expedition</strong>.
          </p>
          
          <p className="mb-6">
            Use this map to track your progress, find hidden friends, and locate exhibits.
            Your progress is saved locally in your browser.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary-green">Credits</h2>
          <p className="mb-4">
            Original map created by <a href="https://monsterexpedition.tgratzer.com" className="text-map-water hover:underline">Taylor Gratzer</a>.
          </p>
          <p className="mb-4">
            Solutions by <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2239781361" className="text-map-water hover:underline">Innocentive</a>.
          </p>
          <p className="mb-4">
            Game by <a href="https://www.drakhollow.com/" className="text-map-water hover:underline">Draknek &amp; Friends</a>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-primary-green">Contribute</h2>
          <p className="mb-4">
            View the source code on <a href="https://github.com/mrinflated/Monster-Expedition-Map" className="text-map-water hover:underline">GitHub</a>.
          </p>
          <p className="mb-4">
            Found a bug or have a suggestion? <a href="https://github.com/mrinflated/Monster-Expedition-Map/issues" className="text-map-water hover:underline">Open an issue</a>.
          </p>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link href="/" className="text-primary-green hover:underline font-semibold">
              &larr; Back to Map
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
