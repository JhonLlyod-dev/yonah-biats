import { useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";

export default function FieldTestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    social: "",
    favoriteFlatside: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch("/api/field-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Success:", JSON.stringify(result));

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setFormData({ name: "", email: "", social: "", favoriteFlatside: "" });

      setShowSuccess(true);

    }catch(error){
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
    setFormData({ name: "", email: "", social: "", favoriteFlatside: "" });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-7">

        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-supporting text-[11px] font-medium uppercase tracking-[0.12em] text-warm-white/60"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="YOUR NAME"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-0 border-b border-warm-white/20 bg-transparent py-2 font-heading text-xl font-extrabold text-warm-white outline-none placeholder:text-warm-white/25 focus:border-chartreuse"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-supporting text-[11px] font-medium uppercase tracking-[0.12em] text-warm-white/60"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="YOUR EMAIL"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-0 border-b border-warm-white/20 bg-transparent py-2 font-heading text-xl font-extrabold text-warm-white outline-none placeholder:text-warm-white/25 focus:border-chartreuse"
          />
        </div>

        <div>
          <label
            htmlFor="social"
            className="mb-2 block font-supporting text-[11px] font-medium uppercase tracking-[0.12em] text-warm-white/60"
          >
            Social / Channel Link
          </label>
          <input
            id="social"
            name="social"
            type="url"
            placeholder="YOUR LINK"
            value={formData.social}
            onChange={handleChange}
            className="w-full border-0 border-b border-warm-white/20 bg-transparent py-2 font-heading text-xl font-extrabold text-warm-white outline-none placeholder:text-warm-white/25 focus:border-chartreuse"
          />
        </div>

        <div>
          <label
            htmlFor="flatside"
            className="mb-2 block font-supporting text-[11px] font-medium uppercase tracking-[0.12em] text-warm-white/60"
          >
            Favorite Flatside
          </label>
          <input
            id="flatside"
            name="favoriteFlatside"
            type="text"
            required
            placeholder="BRAND / BAIT"
            value={formData.favoriteFlatside}
            onChange={handleChange}
            className="w-full border-0 border-b border-warm-white/20 bg-transparent py-2 font-heading text-xl font-extrabold text-warm-white outline-none placeholder:text-warm-white/25 focus:border-chartreuse"
          />
        </div>

        <button
          type="submit"
          className="group relative mt-4 flex w-full items-center justify-between overflow-hidden bg-warm-white px-5 py-4 font-supporting text-xs uppercase tracking-[0.12em] text-near-black transition-colors duration-300 hover:text-near-black"
        >
          <span className="absolute inset-x-0 bottom-0 h-0 bg-chartreuse transition-[height] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:h-full" />
          <span className="relative z-10">Apply to test the Razor</span>
          <ArrowUpRight
            size={17}
            strokeWidth={1.7}
            className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </button>

      </form>

      {showSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-heading"
          className="fixed inset-0 z-50 flex items-center justify-center bg-near-black/80 px-5"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-warm-white p-8 sm:p-10"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-5 top-5 text-near-black/40 transition-colors hover:text-near-black"
            >
              <X size={18} strokeWidth={1.7} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center bg-chartreuse">
              <Check size={22} strokeWidth={2} className="text-near-black" />
            </div>

            <h2
              id="success-heading"
              className="mt-7 font-heading text-3xl font-bold uppercase leading-none tracking-[-0.04em] text-near-black"
            >
              Application received.
            </h2>

            <p className="mt-4 max-w-md font-body text-sm leading-6 text-near-black/60">
              Thanks for putting your name in. We'll review your application
              and reach out if you're selected for the Razor field testing
              program.
            </p>

            <button
              type="button"
              onClick={closeModal}
              className="btn-anim mt-8 w-full bg-near-black py-4 font-supporting text-xs uppercase tracking-[0.12em] text-warm-white hover:text-near-black "
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}