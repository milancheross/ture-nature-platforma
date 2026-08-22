import { c as difficultyLabel, d as priceUnitLabel, l as formatRsd, o as categoryLabel, u as listingImage } from "./utils-CMxh5M2v.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Star, u as MapPin } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-CSi7oHvC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing-card-DyHNkoP1.js
var import_jsx_runtime = require_jsx_runtime();
function ListingCard({ listing }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/listing/$slug",
		params: { slug: listing.slug },
		className: "group block rounded-xl bg-surface p-1.5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-border-hover)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: listingImage(listing.imageKey),
				alt: listing.title,
				className: "aspect-[3/2] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "absolute top-2.5 left-2.5 bg-surface/90 text-fg backdrop-blur-sm",
				children: categoryLabel(listing.category)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-3 pt-3 pb-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), listing.region]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: difficultyLabel(listing.difficulty) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto inline-flex items-center gap-1 tabular-nums text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-primary text-primary" }), listing.rating.toFixed(1)]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1.5 font-display text-lg leading-snug font-medium tracking-tight text-fg",
					children: listing.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm text-muted",
					children: listing.shortDesc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tabular-nums",
							children: formatRsd(listing.priceRsd)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" / ", priceUnitLabel(listing.priceUnit)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-subtle",
						children: listing.duration
					})]
				})
			]
		})]
	});
}
//#endregion
export { ListingCard as t };
