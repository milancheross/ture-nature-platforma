import { o as __toESM } from "../_runtime.mjs";
import { c as difficultyLabel, d as priceUnitLabel, l as formatRsd, o as categoryLabel, s as cn, u as listingImage } from "./utils-CMxh5M2v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Bookmark, i as Star, m as Check, n as Users, p as Clock, s as Phone, t as X, u as MapPin } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as Button, n as Route, o as useFavorites } from "./router-zU6nJH54.mjs";
import { t as Badge } from "./badge-CSi7oHvC.mjs";
import { t as Input } from "./input-CZTdQTQ0.mjs";
import { n as Textarea, t as Label } from "./textarea-DyvdpCdT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing._slug-DHtxT4Qv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-scrim/50 data-[state=open]:animate-in data-[state=closed]:animate-out" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-5 shadow-[var(--shadow-border-hover)] focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-sm p-2 text-muted hover:bg-fg/6 hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Zatvori"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
function BookingDialog({ listing }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [date, setDate] = (0, import_react.useState)("");
	const [people, setPeople] = (0, import_react.useState)("2");
	const [note, setNote] = (0, import_react.useState)("");
	const tel = listing.hostPhone.replace(/\s+/g, "");
	function messageBody() {
		return [
			`Zdravo ${listing.hostName},`,
			`Zanima me „${listing.title}“.`,
			date ? `Datum: ${date}` : null,
			people ? `Broj osoba: ${people}` : null,
			note.trim() ? note.trim() : null
		].filter(Boolean).join("\n");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				children: "Zatraži termin"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Termin kod vodiča" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				"Poruka ostaje kod vas — Staza ne čuva podatke. Pozovite ",
				listing.hostName,
				" ",
				"ili pošaljite SMS."
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "date",
							children: "Datum"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "date",
							type: "date",
							value: date,
							min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							onChange: (e) => setDate(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "people",
							children: "Broj osoba"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "people",
							type: "number",
							min: 1,
							max: 20,
							value: people,
							onChange: (e) => setPeople(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "Poruka vodiču"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "note",
							rows: 3,
							value: note,
							placeholder: "Iskustvo, oprema, pitanja…",
							onChange: (e) => setNote(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							formatRsd(listing.priceRsd),
							" / ",
							priceUnitLabel(listing.priceUnit)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${tel}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), "Pozovi"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `sms:${tel}?body=${encodeURIComponent(messageBody())}`,
								children: "Pošalji SMS"
							})
						})]
					})
				]
			})
		] })]
	});
}
function SaveButton({ slug, title, className, variant = "secondary", iconOnly = false }) {
	const saved = useFavorites((s) => s.slugs.includes(slug));
	const toggle = useFavorites((s) => s.toggle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant,
		size: iconOnly ? "icon" : "default",
		className: cn(className),
		"aria-pressed": saved,
		"aria-label": saved ? "Ukloni iz sačuvanih" : "Sačuvaj",
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			toggle(slug);
			toast(saved ? "Uklonjeno iz sačuvanih" : "Sačuvano", { description: title });
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", saved && "fill-primary text-primary") }), iconOnly ? null : saved ? "Sačuvano" : "Sačuvaj"]
	});
}
function Separator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-px w-full bg-border", className),
		...props
	});
}
function ListingPage() {
	const listing = Route.useLoaderData();
	const tel = listing.hostPhone.replace(/\s+/g, "");
	const initials = listing.hostName.split(" ").map((p) => p[0]).slice(0, 2).join("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-28 sm:px-6 sm:py-10 lg:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/explore",
						className: "hover:text-fg",
						children: "Ture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-subtle",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: categoryLabel(listing.category) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid items-start gap-8 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: listingImage(listing.imageKey),
								alt: listing.title,
								className: "aspect-[3/2] w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: categoryLabel(listing.category) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: difficultyLabel(listing.difficulty)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-sm text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), listing.location]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl leading-tight font-medium tracking-tight sm:text-4xl",
							children: listing.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-center gap-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-primary text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-fg",
									children: listing.rating.toFixed(1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"· ",
									listing.reviewCount,
									" ocena"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", listing.region] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-2xl text-base leading-relaxed text-fg/90",
							children: listing.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid gap-3 sm:grid-cols-3",
							children: [
								{
									icon: Clock,
									label: "Trajanje",
									value: listing.duration
								},
								{
									icon: Users,
									label: "Grupa",
									value: listing.groupSize
								},
								{
									icon: MapPin,
									label: "Sastanak",
									value: listing.meetingPoint
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border bg-surface p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-subtle",
										children: item.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm font-medium",
										children: item.value
									})
								]
							}, item.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-10 font-display text-2xl font-medium tracking-tight",
							children: "U ceni"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-2 sm:grid-cols-2",
							children: listing.included.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-primary" }), item]
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-10 font-display text-2xl font-medium tracking-tight",
							children: "Tok ture"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-4",
							children: listing.itinerary.map((stop, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium tabular-nums text-primary",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: stop.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-sm text-muted",
									children: stop.detail
								})] })]
							}, stop.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-fg",
								children: initials
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: listing.hostName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										listing.hostRole,
										" · ",
										listing.hostYears,
										" god. na terenu"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${tel}`,
									className: "mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }), listing.hostPhone]
								})
							] })]
						}),
						listing.reviews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-10 font-display text-2xl font-medium tracking-tight",
							children: "Utisci"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-4",
							children: listing.reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-border bg-surface p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: review.author
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-xs tabular-nums text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-primary text-primary" }), review.rating]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: review.body
								})]
							}, review.id))
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden lg:sticky lg:top-24 lg:block lg:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Od"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-medium tracking-tight tabular-nums",
								children: formatRsd(listing.priceRsd)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["/ ", priceUnitLabel(listing.priceUnit)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingDialog, { listing }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, {
									slug: listing.slug,
									title: listing.title,
									className: "w-full"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs leading-relaxed text-subtle",
								children: "Termin se dogovara direktno sa vodičem. Staza ne naplaćuje proviziju i ne čuva tvoje podatke."
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium tabular-nums",
								children: formatRsd(listing.priceRsd)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted",
								children: ["/ ", priceUnitLabel(listing.priceUnit)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, {
							slug: listing.slug,
							title: listing.title,
							variant: "outline",
							iconOnly: true,
							className: "shrink-0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-40 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingDialog, { listing })
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ListingPage as component };
