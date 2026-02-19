import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";

// Auth Component
function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5v50M5 30h50' stroke='%23d4a574' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
      }} />

      {/* Cross symbol */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 opacity-10">
        <svg width="120" height="160" viewBox="0 0 120 160" className="text-amber-200">
          <rect x="50" y="0" width="20" height="160" fill="currentColor" />
          <rect x="20" y="40" width="80" height="20" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-amber-400 text-sm tracking-[0.3em] uppercase font-medium">In Christ Alone</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-amber-50 mb-3">
            The Narrow Way
          </h1>
          <p className="text-stone-400 font-light text-lg">
            "Enter ye in at the strait gate"
          </p>
          <p className="text-amber-600/80 text-sm mt-1">— Matthew 7:13</p>
        </div>

        {/* Auth Card */}
        <div className="bg-stone-900/80 backdrop-blur-sm border border-amber-900/30 rounded-sm p-6 md:p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl text-amber-100">
              {flow === "signIn" ? "Welcome Back" : "Join the Fellowship"}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {flow === "signIn" ? "Continue your spiritual journey" : "Begin your walk with us"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-stone-400 text-sm mb-2 tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-800/50 border border-stone-700 rounded-sm px-4 py-3 text-amber-50 placeholder-stone-600 focus:outline-none focus:border-amber-700 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-2 tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-800/50 border border-stone-700 rounded-sm px-4 py-3 text-amber-50 placeholder-stone-600 focus:outline-none focus:border-amber-700 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-50 font-medium py-3 rounded-sm transition-all duration-300 disabled:opacity-50 tracking-wide"
            >
              {isLoading ? "..." : flow === "signIn" ? "Enter" : "Join"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-amber-600 hover:text-amber-500 text-sm transition-colors"
            >
              {flow === "signIn" ? "Create an account" : "Already have an account?"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-stone-900 px-3 text-stone-500">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full border border-stone-700 hover:border-amber-800 text-stone-400 hover:text-amber-200 py-3 rounded-sm transition-all duration-300 text-sm"
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          "For where two or three are gathered together in my name, there am I in the midst of them."
        </p>
      </div>
    </div>
  );
}

// Main App Component
function MainApp() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<"home" | "teachings" | "prayer" | "saved">("home");

  // Seed data on first load
  const seedDevotionals = useMutation(api.devotionals.seed);
  const seedTeachings = useMutation(api.teachings.seed);

  useEffect(() => {
    seedDevotionals();
    seedTeachings();
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-sm border-b border-amber-900/20">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
              <svg viewBox="0 0 40 50" className="w-full h-full text-amber-500">
                <rect x="17" y="0" width="6" height="50" fill="currentColor" />
                <rect x="5" y="12" width="30" height="6" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-lg md:text-xl text-amber-100">The Narrow Way</h1>
              <p className="text-[10px] md:text-xs text-stone-500 tracking-wider">BIBLICAL TRUTH</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-stone-500 hover:text-amber-400 text-sm transition-colors px-3 py-2"
          >
            Sign Out
          </button>
        </div>

        {/* Navigation */}
        <nav className="max-w-6xl mx-auto px-2 md:px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: "home", label: "Home", icon: "🏠" },
              { id: "teachings", label: "Teachings", icon: "📖" },
              { id: "prayer", label: "Prayer", icon: "🙏" },
              { id: "saved", label: "Saved", icon: "💾" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-shrink-0 px-4 md:px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-stone-500 hover:text-amber-300"
                }`}
              >
                <span className="md:hidden">{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 pb-24">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "teachings" && <TeachingsTab />}
        {activeTab === "prayer" && <PrayerTab />}
        {activeTab === "saved" && <SavedTab />}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-stone-950/95 backdrop-blur-sm border-t border-amber-900/20 py-3">
        <p className="text-center text-stone-600 text-xs">
          Requested by <span className="text-stone-500">@stringer_kade</span> · Built by <span className="text-stone-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

// Home Tab
function HomeTab() {
  const devotional = useQuery(api.devotionals.getLatest);
  const saveScripture = useMutation(api.savedScriptures.save);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (devotional) {
      await saveScripture({
        scripture: devotional.scripture,
        reference: devotional.scriptureReference,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-stone-900 to-stone-950" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23d4a574' stroke-width='0.5' fill='none'/%3E%3Cpath d='M50 10v80M10 50h80' stroke='%23d4a574' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative p-6 md:p-12 text-center">
          <span className="text-amber-500 text-xs tracking-[0.3em] uppercase">A Message of Truth</span>
          <h2 className="font-serif text-3xl md:text-5xl text-amber-50 mt-4 mb-6 leading-tight">
            World Peace Cannot Come<br />Through Human Effort
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Scripture reveals that true peace will only come when Christ returns to establish His kingdom.
            Until then, we find our peace in Him alone, not in the fleeting promises of this world.
          </p>
        </div>
      </section>

      {/* Daily Devotional */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-600 rounded-full" />
          <h3 className="font-serif text-2xl text-amber-100">Today's Devotional</h3>
        </div>

        {devotional === undefined ? (
          <div className="bg-stone-900/50 rounded-sm p-8 text-center">
            <div className="animate-pulse text-stone-500">Loading...</div>
          </div>
        ) : devotional ? (
          <div className="bg-stone-900/50 border border-amber-900/20 rounded-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <h4 className="font-serif text-xl md:text-2xl text-amber-200 mb-4">{devotional.title}</h4>
              <blockquote className="border-l-2 border-amber-700 pl-4 md:pl-6 my-6">
                <p className="text-amber-100/90 italic leading-relaxed text-sm md:text-base">
                  "{devotional.scripture}"
                </p>
                <cite className="text-amber-600 text-sm mt-2 block">— {devotional.scriptureReference}</cite>
              </blockquote>
              <p className="text-stone-400 leading-relaxed text-sm md:text-base">{devotional.reflection}</p>
            </div>
            <div className="bg-stone-800/50 px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-stone-500 text-sm">Meditate on this truth today</span>
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-sm text-sm transition-all ${
                  saved
                    ? "bg-green-800 text-green-200"
                    : "bg-amber-900/50 hover:bg-amber-800/50 text-amber-200"
                }`}
              >
                {saved ? "Saved!" : "Save Scripture"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-stone-900/50 rounded-sm p-8 text-center text-stone-500">
            No devotional available
          </div>
        )}
      </section>

      {/* Scripture Cards */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-600 rounded-full" />
          <h3 className="font-serif text-2xl text-amber-100">Key Scriptures</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { ref: "Matthew 24:6", text: "And ye shall hear of wars and rumours of wars: see that ye be not troubled: for all these things must come to pass, but the end is not yet." },
            { ref: "John 14:27", text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you." },
            { ref: "2 Timothy 3:1", text: "This know also, that in the last days perilous times shall come." },
            { ref: "Jeremiah 17:9", text: "The heart is deceitful above all things, and desperately wicked: who can know it?" },
          ].map((scripture, i) => (
            <div
              key={i}
              className="bg-stone-900/30 border border-stone-800 hover:border-amber-900/50 rounded-sm p-5 transition-all duration-300 group"
            >
              <p className="text-stone-300 text-sm leading-relaxed mb-3 group-hover:text-amber-100/90 transition-colors">
                "{scripture.text}"
              </p>
              <p className="text-amber-600 text-sm">— {scripture.ref}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Teachings Tab
function TeachingsTab() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const teachings = useQuery(api.teachings.list, { category: selectedCategory ?? undefined });

  const categories = [
    { id: null, label: "All", color: "amber" },
    { id: "peace", label: "On Peace", color: "blue" },
    { id: "prophecy", label: "Prophecy", color: "purple" },
    { id: "hope", label: "Hope", color: "green" },
    { id: "truth", label: "Truth", color: "red" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-amber-100 mb-2">Biblical Teachings</h2>
        <p className="text-stone-500 text-sm md:text-base">Understanding God's perspective on world events</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id ?? "all"}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-sm text-sm transition-all ${
              selectedCategory === cat.id
                ? "bg-amber-800 text-amber-100"
                : "bg-stone-800/50 text-stone-400 hover:bg-stone-800 hover:text-stone-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Teachings List */}
      <div className="space-y-6">
        {teachings === undefined ? (
          <div className="text-center py-12 text-stone-500">Loading teachings...</div>
        ) : teachings.length === 0 ? (
          <div className="text-center py-12 text-stone-500">No teachings found</div>
        ) : (
          teachings.map((teaching: Doc<"teachings">) => (
            <article
              key={teaching._id}
              className="bg-stone-900/40 border border-stone-800 rounded-sm overflow-hidden hover:border-amber-900/30 transition-all"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 bg-amber-900/30 text-amber-400 rounded-sm uppercase tracking-wider">
                    {teaching.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-amber-100 mb-4">{teaching.title}</h3>
                <div className="text-stone-400 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {teaching.content}
                </div>
                <div className="mt-6 pt-4 border-t border-stone-800">
                  <p className="text-stone-500 text-sm mb-2">Scripture References:</p>
                  <div className="flex flex-wrap gap-2">
                    {teaching.scriptureReferences.map((ref: string, i: number) => (
                      <span key={i} className="text-amber-600 text-sm bg-amber-900/20 px-2 py-1 rounded-sm">
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

// Prayer Tab
function PrayerTab() {
  const prayerRequests = useQuery(api.prayerRequests.list);
  const createRequest = useMutation(api.prayerRequests.create);
  const prayForRequest = useMutation(api.prayerRequests.pray);

  const [newRequest, setNewRequest] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.trim()) return;

    setSubmitting(true);
    await createRequest({ request: newRequest, isAnonymous });
    setNewRequest("");
    setSubmitting(false);
  };

  const handlePray = async (id: Id<"prayerRequests">) => {
    await prayForRequest({ prayerRequestId: id });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-amber-100 mb-2">Prayer Wall</h2>
        <p className="text-stone-500 text-sm md:text-base">Bear one another's burdens — Galatians 6:2</p>
      </div>

      {/* Submit Prayer Request */}
      <form onSubmit={handleSubmit} className="bg-stone-900/50 border border-amber-900/20 rounded-sm p-5 md:p-6">
        <h3 className="font-serif text-lg text-amber-200 mb-4">Submit a Prayer Request</h3>
        <textarea
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          placeholder="Share your prayer request with the community..."
          className="w-full bg-stone-800/50 border border-stone-700 rounded-sm px-4 py-3 text-amber-50 placeholder-stone-600 focus:outline-none focus:border-amber-700 transition-colors resize-none h-24 md:h-32 text-sm"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
          <label className="flex items-center gap-2 text-stone-400 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="accent-amber-600"
            />
            Post anonymously
          </label>
          <button
            type="submit"
            disabled={submitting || !newRequest.trim()}
            className="w-full sm:w-auto bg-amber-800 hover:bg-amber-700 disabled:bg-stone-700 disabled:text-stone-500 text-amber-50 px-6 py-2 rounded-sm transition-colors text-sm"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>

      {/* Prayer Requests List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-amber-200">Community Prayers</h3>

        {prayerRequests === undefined ? (
          <div className="text-center py-8 text-stone-500">Loading prayers...</div>
        ) : prayerRequests.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            No prayer requests yet. Be the first to share.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prayerRequests.map((request: Doc<"prayerRequests"> & { userName: string }) => (
              <div
                key={request._id}
                className="bg-stone-900/30 border border-stone-800 rounded-sm p-5 hover:border-amber-900/30 transition-all"
              >
                <p className="text-stone-300 text-sm leading-relaxed mb-4">{request.request}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-stone-800">
                  <div>
                    <p className="text-stone-500 text-xs">{request.userName}</p>
                    <p className="text-amber-600 text-xs">{request.prayerCount} prayers</p>
                  </div>
                  <button
                    onClick={() => handlePray(request._id)}
                    className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm transition-colors"
                  >
                    <span>🙏</span>
                    <span>I Prayed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Saved Tab
function SavedTab() {
  const savedScriptures = useQuery(api.savedScriptures.list);
  const removeScripture = useMutation(api.savedScriptures.remove);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-amber-100 mb-2">Saved Scriptures</h2>
        <p className="text-stone-500 text-sm md:text-base">Your personal collection of verses</p>
      </div>

      {savedScriptures === undefined ? (
        <div className="text-center py-12 text-stone-500">Loading...</div>
      ) : savedScriptures.length === 0 ? (
        <div className="text-center py-12 bg-stone-900/30 rounded-sm">
          <p className="text-stone-500 mb-2">No saved scriptures yet</p>
          <p className="text-stone-600 text-sm">Save scriptures from devotionals to build your collection</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedScriptures.map((scripture: Doc<"savedScriptures">) => (
            <div
              key={scripture._id}
              className="bg-stone-900/30 border border-stone-800 rounded-sm p-5 group"
            >
              <blockquote className="border-l-2 border-amber-700 pl-4">
                <p className="text-amber-100/90 italic leading-relaxed text-sm md:text-base">
                  "{scripture.scripture}"
                </p>
                <cite className="text-amber-600 text-sm mt-2 block">— {scripture.reference}</cite>
              </blockquote>
              {scripture.note && (
                <p className="text-stone-400 text-sm mt-3 pl-4">{scripture.note}</p>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => removeScripture({ id: scripture._id })}
                  className="text-stone-600 hover:text-red-400 text-sm transition-colors opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Root App
export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <svg viewBox="0 0 40 50" className="w-full h-full text-amber-500 animate-pulse">
              <rect x="17" y="0" width="6" height="50" fill="currentColor" />
              <rect x="5" y="12" width="30" height="6" fill="currentColor" />
            </svg>
          </div>
          <p className="text-stone-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainApp /> : <AuthScreen />;
}
