import { o as __toESM } from "../_runtime.mjs";
import { a as REGIONS, t as CATEGORIES, u as listingImage } from "./utils-CMxh5M2v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Handshake, f as Compass, g as ArrowRight, l as MapPinned, o as Search } from "../_libs/lucide-react.mjs";
import { a as Route$4, l as Button } from "./router-zU6nJH54.mjs";
import { t as ListingCard } from "./listing-card-DyHNkoP1.mjs";
import { t as Input } from "./input-CZTdQTQ0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cbt74Ifu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const featured = Route$4.useLoaderData();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mx-auto max-w-6xl px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-4 overflow-hidden rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/hero.jpg",
							alt: "Planinska staza na grebenu u zlatnom satu",
							className: "h-[min(78vh,640px)] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-scrim/80 via-scrim/35 to-scrim/15" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-[0.18em] text-primary-fg/70 uppercase",
									children: "Srbija · teren"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 max-w-xl font-display text-4xl leading-[1.1] font-medium tracking-tight text-primary-fg sm:text-5xl md:text-6xl",
									children: "Ture, bicikli i kvadovi. Direktno sa terena."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-md text-sm leading-relaxed text-primary-fg/80 sm:text-base",
									children: "Vodiči, izdavači mountain bike-ova i kvadova, rafting i kamp — bez posrednika."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mt-6 flex max-w-lg gap-2 rounded-lg bg-surface p-1.5 shadow-[var(--shadow-border)]",
									onSubmit: (e) => {
										e.preventDefault();
										navigate({
											to: "/explore",
											search: { q: q.trim() || void 0 }
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: q,
											onChange: (e) => setQ(e.target.value),
											placeholder: "Tara, Zlatibor, kvad, rafting…",
											className: "h-11 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0",
											"aria-label": "Pretraga tura"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "shrink-0",
										children: "Traži"
									})]
								})
							]
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Šta tražiš"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-medium tracking-tight",
					children: "Kategorije"
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
				children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/explore",
					search: { category: cat.id },
					className: "group overflow-hidden rounded-xl bg-surface p-1 shadow-[var(--shadow-border)] transition-[box-shadow] duration-200 hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: listingImage(cat.id === "hike" ? "tara-hike" : cat.id === "mtb" ? "zlatibor-mtb" : cat.id === "atv" ? "zlatibor-atv" : cat.id === "rafting" ? "rafting-drina" : cat.id === "horse" ? "horse-zlatibor" : "camp-perucac"),
						alt: "",
						className: "aspect-[4/3] w-full rounded-lg object-cover outline outline-1 -outline-offset-1 outline-fg/10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2.5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-fg",
							children: cat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: cat.blurb
						})]
					})]
				}, cat.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 pb-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Izbor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-medium tracking-tight",
					children: "Istaknute ture"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/explore",
						children: ["Sve ponude", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: featured.map((listing) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing }, listing.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "kako",
			className: "border-y border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-subtle uppercase",
						children: "Kako radi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 max-w-lg font-display text-3xl font-medium tracking-tight",
						children: "Nema posrednika. Dogovor je sa čovekom na terenu."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-8 md:grid-cols-3",
						children: [
							{
								icon: Compass,
								title: "Pronađi",
								body: "Filtriraj ture, bicikle, kvadove i kamp po regionu i težini."
							},
							{
								icon: Handshake,
								title: "Javi se",
								body: "Pozovi ili pošalji SMS vodiču. Termin i cena idu direktno."
							},
							{
								icon: MapPinned,
								title: "Izađi",
								body: "Sastanak na dogovorenoj tački. Oprema i staza su njihov posao."
							}
						].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(step.icon, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium",
								children: step.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: step.body
							})] })]
						}, step.title))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "Regioni"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-lg text-sm text-muted",
					children: "Od Tare i Zlatibora do Đerdapa. Lokalni vodiči, ne buses sa zastavicama."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: REGIONS.map((region) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						search: { region },
						className: "rounded-full border border-border bg-surface px-4 py-2 text-sm text-fg transition-colors duration-150 hover:border-fg/25 hover:bg-fg/4",
						children: region
					}, region))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl px-4 pb-20 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl bg-primary p-8 text-primary-fg sm:p-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-primary-fg/60 uppercase",
						children: "Za vodiče"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl",
						children: "Imaš ture, kvadove ili bicikle?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-sm leading-relaxed text-primary-fg/75",
						children: "Objavi ponudu. Ljudi te nađu po regionu i kategoriji, pa ti se jave direktno."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/host",
							children: ["Objavi ponudu", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					})
				]
			})
		})
	] });
}
//#endregion
export { Home as component };
