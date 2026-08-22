import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing Razor");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const minimumTime = 900;

    const stages = [
      { progress: 20, text: "Preparing Razor" },
      { progress: 45, text: "Fish with confidence" },
      { progress: 70, text: "Razor-thin profile" },
      { progress: 90, text: "Almost ready" },
    ];

    const timers = stages.map((stage, index) =>
      setTimeout(() => {
        setProgress(stage.progress);
        setStatus(stage.text);
      }, 180 + index * 180)
    );

    let pageReady = document.readyState === "complete";
    let modelReady = false;

    const finish = async () => {
      if (!pageReady || !modelReady) return;

      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minimumTime - elapsed);

      await new Promise((resolve) => setTimeout(resolve, remaining));

      setProgress(100);
      setStatus("Ready");

      setTimeout(() => {
        setLoaded(true);
      }, 250);
    };

    const handlePageLoad = () => {
      pageReady = true;
      finish();
    };

    const handleModelReady = () => {
      modelReady = true;
      finish();
    };

    if (!pageReady) {
      window.addEventListener("load", handlePageLoad);
    }

    if (typeof window !== "undefined" && window.__yonahModelReady) {
      modelReady = true;
    }

    window.addEventListener("yonah:3d-ready", handleModelReady);

    /*
     * Safety fallback.
     * Prevents the loader from staying forever if
     * the 3D model fails to load.
     */
    const fallback = setTimeout(() => {
      modelReady = true;
      finish();
    }, 8000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fallback);

      window.removeEventListener("load", handlePageLoad);
      window.removeEventListener("yonah:3d-ready", handleModelReady);
    };
  }, []);

  return (
    <div
      aria-label="Loading YONAH"
      role="status"
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-near-black text-warm-white transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        loaded
          ? "pointer-events-none invisible opacity-0"
          : "visible opacity-100"
      }`}
    >
      {/* Ambient glow — echoes the Hero/Features product glow language */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] max-h-[600px] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chartreuse/[0.05] blur-[120px]"
      />

      <div className="relative z-10 flex w-full max-w-xs flex-col items-center px-6">

        {/* Eyebrow */}
        <p className="mb-6 font-supporting text-[9px] uppercase tracking-[0.3em] text-warm-white/35">
          Confidence bait for every angler
        </p>

        {/* Logo */}
        <div className="overflow-hidden">
          <img
            src="/white-brand-logo.webp"
            alt="YONAH"
            className="animate-loader-pulse h-30 w-46 object-cover"
          />
        </div>

        {/* Progress */}
        <div className="mt-10 w-full">

          <div className="h-px w-full overflow-hidden bg-warm-white/10">
            <div
              className="h-full bg-chartreuse transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">

            <span className="font-supporting text-[9px] uppercase tracking-[0.18em] text-warm-white/40">
              {status}
            </span>

            <span className="font-supporting text-[9px] tabular-nums tracking-[0.18em] text-warm-white/40">
              {progress}%
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}