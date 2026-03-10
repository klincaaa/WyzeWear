export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-sm text-zinc-700 sm:grid-cols-5">
          <div className="sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-900">
              WYZE WEAR
            </p>
            <p className="mt-3 max-w-xs text-xs text-zinc-600">
              Elevated streetwear for everyday movement. Designed in the studio,
              tested in the city.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-900">
              Shop
            </p>
            <ul className="mt-3 space-y-1 text-xs text-zinc-600">
              <li>Hoodies</li>
              <li>Tracksuits</li>
              <li>Bottoms</li>
              <li>Accessories</li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-900">
              Company
            </p>
            <ul className="mt-3 space-y-1 text-xs text-zinc-600">
              <li>About</li>
              <li>Journal</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-900">
              Support
            </p>
            <ul className="mt-3 space-y-1 text-xs text-zinc-600">
              <li>Contact</li>
              <li>Shipping</li>
              <li>Returns</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} WyzeWear. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Instagram</span>
            <span>TikTok</span>
            <span>Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

