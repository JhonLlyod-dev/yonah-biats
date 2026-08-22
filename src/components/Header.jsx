import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const nav = [
  { label: "Razor", href: "#hero" },
  { label: "The Idea", href: "#idea" },
  { label: "Features", href: "#features" },
  { label: "The Bait", href: "#bait" },
];

export default function Header({
  logoSrc = "/white-logo.webp",
  logoAlt = "YONAH Bait Company",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

return (
  <>
    {/* DESKTOP HEADER — blended */}
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-[99]
        px-4
        pt-4
        sm:px-6
        sm:pt-5
        lg:px-8
        mix-blend-difference
      "
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between pb-4">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <img
            src={logoSrc}
            alt={logoAlt}
            width={120}
            height={30}
            className="h-10 w-24 object-cover sm:w-28"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="
                    group
                    relative
                    font-supporting
                    text-xs
                    uppercase
                    tracking-[0.12em]
                    text-white
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute
                      -bottom-1
                      left-0
                      h-px
                      w-0
                      bg-chartreuse
                      transition-all
                      duration-300
                      group-hover:w-full
                    "
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <a
          href="#testing"
          className="btn-anim group hidden sm:inline-flex"
        >
          <span>Test Razor</span>

          <ArrowUpRight
            size={15}
            className="ml-3"
          />
        </a>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            border
            border-warm-white/20
            text-warm-white
            md:hidden
          "
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>

    {/* MOBILE MENU — NOT INSIDE THE BLENDED HEADER */}
    <div
      ref={menuRef}
      className={`
        fixed
        inset-x-4
        top-[4.5rem]
        z-[100]
        border
        border-near-black/10
        bg-warm-white
        p-5
        shadow-xl
        md:hidden
        ${menuOpen ? "block" : "hidden"}
      `}
    >
      <nav>
        <ul className="flex flex-col">
          {nav.map((item) => (
            <li
              key={item.href}
              className="border-b border-near-black/10 last:border-0"
            >
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  py-4
                  font-supporting
                  text-sm
                  uppercase
                  tracking-[0.12em]
                  text-near-black
                "
              >
                {item.label}
                <ArrowUpRight size={16} />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#testing"
          className="btn-anim mt-5 w-full"
        >
          <span>Test Razor</span>
          <ArrowUpRight size={15} className="ml-auto" />
        </a>
      </nav>
    </div>
  </>
);
}