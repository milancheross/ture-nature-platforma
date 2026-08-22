import { o as __toESM } from "../_runtime.mjs";
import { a as REGIONS, i as PRICE_UNITS, r as DIFFICULTIES, t as CATEGORIES } from "./utils-CMxh5M2v.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as createListing, l as Button } from "./router-zU6nJH54.mjs";
import { t as Select } from "./select-Bfb7qVXw.mjs";
import { t as Input } from "./input-CZTdQTQ0.mjs";
import { n as Textarea, t as Label } from "./textarea-DyvdpCdT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/host-t31eSoti.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HostPage() {
	const navigate = useNavigate();
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const priceRsd = Number(form.get("priceRsd"));
		if (!Number.isFinite(priceRsd)) {
			toast.error("Unesi cenu kao broj.");
			return;
		}
		setPending(true);
		try {
			const result = await createListing({ data: {
				title: String(form.get("title") ?? ""),
				category: String(form.get("category") ?? "hike"),
				region: String(form.get("region") ?? ""),
				location: String(form.get("location") ?? ""),
				shortDesc: String(form.get("shortDesc") ?? ""),
				description: String(form.get("description") ?? ""),
				priceRsd,
				priceUnit: String(form.get("priceUnit") ?? "osoba"),
				duration: String(form.get("duration") ?? ""),
				groupSize: String(form.get("groupSize") ?? ""),
				difficulty: String(form.get("difficulty") ?? "lako"),
				hostName: String(form.get("hostName") ?? ""),
				hostRole: String(form.get("hostRole") ?? ""),
				hostPhone: String(form.get("hostPhone") ?? ""),
				meetingPoint: String(form.get("meetingPoint") ?? ""),
				included: String(form.get("included") ?? "")
			} });
			toast.success("Ponuda je objavljena.");
			navigate({
				to: "/listing/$slug",
				params: { slug: result.slug }
			});
		} catch {
			toast.error("Proveri polja i pokušaj ponovo.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-[1fr_1.2fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-subtle uppercase",
					children: "Za vodiče"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl font-medium tracking-tight",
					children: "Objavi ponudu"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-sm leading-relaxed text-muted",
					children: "Ako vodiš ture, izdaješ mountain bike, kvadove ili mesto za kamp — stavi to ovde. Ljudi te nađu i jave se na telefon."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Bez provizije."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: " Dogovor i uplata idu vama."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Javni kontakt."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" ", "Telefon stoji na oglasu, kao u imeniku."]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Jedna forma."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: " Posle objave, ponuda je odmah u katalogu."
						})] })
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Naziv ponude",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "title",
								required: true,
								minLength: 4,
								maxLength: 80,
								placeholder: "npr. Kablar u zoru"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kategorija",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								name: "category",
								defaultValue: "hike",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.label
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Region",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								name: "region",
								defaultValue: "Zlatibor",
								children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: r
								}, r))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Lokacija",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "location",
								required: true,
								placeholder: "Mitrovac, NP Tara"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Kratak opis",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "shortDesc",
								required: true,
								minLength: 12,
								maxLength: 160,
								placeholder: "Jedna rečenica koja se vidi na kartici"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Opis",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								name: "description",
								required: true,
								minLength: 40,
								placeholder: "Šta se dešava na turi, kome je namenjena, šta ponese gost."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cena (RSD)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "priceRsd",
								type: "number",
								required: true,
								min: 500,
								max: 2e5,
								placeholder: "4500"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Jedinica",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								name: "priceUnit",
								defaultValue: "osoba",
								children: PRICE_UNITS.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: u.id,
									children: u.label
								}, u.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Trajanje",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "duration",
								required: true,
								placeholder: "7 sati"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Veličina grupe",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "groupSize",
								required: true,
								placeholder: "4–12"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Težina",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								name: "difficulty",
								defaultValue: "umereno",
								children: DIFFICULTIES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: d.id,
									children: d.label
								}, d.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Mesto sastanka",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "meetingPoint",
								required: true,
								placeholder: "Info centar, Mitrovac"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ime (javno na oglasu)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "hostName",
								required: true,
								placeholder: "Ime i prezime"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Uloga",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "hostRole",
								required: true,
								placeholder: "Planinarski vodič"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Telefon",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "hostPhone",
								required: true,
								placeholder: "+381 6x xxx xxxx"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Šta je uračunato (odvoj zarezima)",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								name: "included",
								required: true,
								placeholder: "Vodič, kaciga, užina"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-6 w-full",
					size: "lg",
					disabled: pending,
					children: pending ? "Objavljujem…" : "Objavi ponudu"
				})]
			})]
		})
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `grid gap-1.5 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { HostPage as component };
