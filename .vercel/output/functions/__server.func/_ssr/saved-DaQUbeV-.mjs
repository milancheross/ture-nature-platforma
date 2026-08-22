import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Button, o as useFavorites, r as Route$1 } from "./router-zU6nJH54.mjs";
import { t as ListingCard } from "./listing-card-DyHNkoP1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-DaQUbeV-.js
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const all = Route$1.useLoaderData();
	const slugs = useFavorites((s) => s.slugs);
	const items = all.filter((listing) => slugs.includes(listing.slug));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.16em] text-subtle uppercase",
				children: "Tvoje"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-medium tracking-tight",
				children: "Sačuvane ture"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Ostaju u ovom pregledaču. Ništa se ne šalje na nalog — nema naloga."
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl border border-border bg-surface px-6 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Još ništa nije sačuvano"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Otvori turu i tapni Sačuvaj. Ovde će se pojaviti."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/explore",
							children: "Pogledaj ponude"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: items.map((listing) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing }, listing.slug))
			})
		]
	});
}
//#endregion
export { SavedPage as component };
