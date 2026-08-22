import { o as __toESM } from "../_runtime.mjs";
import { a as REGIONS, r as DIFFICULTIES, t as CATEGORIES } from "./utils-CMxh5M2v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { i as Route$3 } from "./router-zU6nJH54.mjs";
import { t as ListingCard } from "./listing-card-DyHNkoP1.mjs";
import { t as Select } from "./select-Bfb7qVXw.mjs";
import { t as Input } from "./input-CZTdQTQ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-D6-ULgst.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExplorePage() {
	const listings = Route$3.useLoaderData();
	const search = Route$3.useSearch();
	const navigate = Route$3.useNavigate();
	const qTimer = (0, import_react.useRef)(0);
	function patch(next) {
		navigate({
			to: "/explore",
			search: {
				...search,
				...next
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.16em] text-subtle uppercase",
				children: "Katalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-medium tracking-tight",
				children: "Sve ponude"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Planinarenje, MTB, kvadovi, rafting, jahanje i kamp. Filtriraj i javi se vodiču."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-medium tracking-wide text-muted uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5" }), "Filteri"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							defaultValue: search.q ?? "",
							placeholder: "Pretraga",
							"aria-label": "Pretraga",
							onChange: (e) => {
								const value = e.target.value;
								window.clearTimeout(qTimer.current);
								qTimer.current = window.setTimeout(() => {
									patch({ q: value.trim() || void 0 });
								}, 250);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: search.category ?? "",
							onChange: (e) => patch({ category: e.target.value || void 0 }),
							"aria-label": "Kategorija",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sve kategorije"
							}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.label
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: search.region ?? "",
							onChange: (e) => patch({ region: e.target.value || void 0 }),
							"aria-label": "Region",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Svi regioni"
							}), REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r,
								children: r
							}, r))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: search.difficulty ?? "",
							onChange: (e) => patch({ difficulty: e.target.value || void 0 }),
							"aria-label": "Težina",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Sve težine"
							}), DIFFICULTIES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.label
							}, d.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: search.sort ?? "featured",
							onChange: (e) => patch({ sort: e.target.value }),
							"aria-label": "Sortiranje",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "featured",
									children: "Preporučeno"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "rating",
									children: "Ocena"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "price_asc",
									children: "Cena: niža"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "price_desc",
									children: "Cena: viša"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted tabular-nums",
				children: [
					listings.length,
					" ",
					listings.length === 1 ? "ponuda" : "ponuda"
				]
			}),
			listings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-border bg-surface px-6 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Nema rezultata"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Promeni filtere ili obriši pretragu."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						className: "mt-4 inline-block text-sm font-medium text-primary",
						children: "Prikaži sve"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: listings.map((listing) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing }, listing.slug))
			})
		]
	});
}
//#endregion
export { ExplorePage as component };
