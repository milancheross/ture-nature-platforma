import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-CMxh5M2v.js
var CATEGORIES = [
	{
		id: "hike",
		label: "Planinarenje",
		blurb: "Vođene ture i usponi"
	},
	{
		id: "mtb",
		label: "Mountain bike",
		blurb: "Iznajmljivanje i staze"
	},
	{
		id: "atv",
		label: "Kvadovi",
		blurb: "Off-road po visoravni"
	},
	{
		id: "rafting",
		label: "Rafting",
		blurb: "Reke i kanjoni"
	},
	{
		id: "horse",
		label: "Jahanje",
		blurb: "Konji na visoravni"
	},
	{
		id: "camp",
		label: "Kamp",
		blurb: "Noćenje uz reku"
	}
];
var REGIONS = [
	"Tara",
	"Zlatibor",
	"Golija",
	"Uvac",
	"Ovčar-Kablar",
	"Kopaonik",
	"Stara planina",
	"Fruška gora",
	"Rtanj",
	"Đerdap"
];
var DIFFICULTIES = [
	{
		id: "lako",
		label: "Lako"
	},
	{
		id: "umereno",
		label: "Umereno"
	},
	{
		id: "zahtevno",
		label: "Zahtevno"
	}
];
var PRICE_UNITS = [
	{
		id: "osoba",
		label: "po osobi"
	},
	{
		id: "dan",
		label: "po danu"
	},
	{
		id: "sat",
		label: "po satu"
	},
	{
		id: "tura",
		label: "po turi"
	}
];
var CATEGORY_IMAGE = {
	hike: "tara-hike",
	mtb: "zlatibor-mtb",
	atv: "zlatibor-atv",
	rafting: "rafting-drina",
	horse: "horse-zlatibor",
	camp: "camp-perucac"
};
function categoryLabel(id) {
	return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
function difficultyLabel(id) {
	return DIFFICULTIES.find((d) => d.id === id)?.label ?? id;
}
function priceUnitLabel(id) {
	return PRICE_UNITS.find((u) => u.id === id)?.label ?? id;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatRsd(amount) {
	return new Intl.NumberFormat("sr-RS").format(amount) + " RSD";
}
function listingImage(key) {
	return `/images/${key}.jpg`;
}
function slugify(title) {
	const base = title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "dj").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
	const suffix = Math.random().toString(36).slice(2, 6);
	return `${base || "tura"}-${suffix}`;
}
//#endregion
export { REGIONS as a, difficultyLabel as c, priceUnitLabel as d, slugify as f, PRICE_UNITS as i, formatRsd as l, CATEGORY_IMAGE as n, categoryLabel as o, DIFFICULTIES as r, cn as s, CATEGORIES as t, listingImage as u };
