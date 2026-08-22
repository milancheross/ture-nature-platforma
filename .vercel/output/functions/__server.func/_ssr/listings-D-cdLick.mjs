import { f as slugify, n as CATEGORY_IMAGE } from "./utils-CMxh5M2v.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listings-D-cdLick.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_listings_default = "create table if not exists listings (\n  id serial primary key,\n  slug text unique not null,\n  title text not null,\n  category text not null,\n  region text not null,\n  location text not null,\n  short_desc text not null,\n  description text not null,\n  price_rsd integer not null,\n  price_unit text not null,\n  duration text not null,\n  group_size text not null,\n  difficulty text not null,\n  image_key text not null,\n  host_name text not null,\n  host_role text not null,\n  host_years integer not null default 5,\n  host_phone text not null,\n  included text not null,\n  itinerary text not null,\n  meeting_point text not null,\n  rating numeric not null default 4.8,\n  review_count integer not null default 0,\n  featured boolean not null default false,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists reviews (\n  id serial primary key,\n  listing_id integer not null references listings(id) on delete cascade,\n  author text not null,\n  rating integer not null,\n  body text not null,\n  created_at date not null default current_date\n);\n\ncreate index if not exists listings_category_idx on listings (category);\ncreate index if not exists listings_region_idx on listings (region);\ncreate index if not exists listings_slug_idx on listings (slug);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_listings.sql": _0002_listings_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var SEED_LISTINGS = [
	{
		slug: "banjska-stena-tara",
		title: "Banjska stena i kanjon Tare",
		category: "hike",
		region: "Tara",
		location: "Mitrovac, Nacionalni park Tara",
		shortDesc: "Vidikovac iznad kanjona Tare, jedan od najlepših pogleda u Srbiji.",
		description: "Polazimo sa Mitrovca kroz crnogoričnu šumu do Banjske stene. Tura je vođena, sa pauzama za fotografisanje i priču o parku, medvedima i starim šumama. Pogled na Drinu i kanjon ostaje dugo posle silaska. Tempo je umeren — pogodno i za one koji nisu svakodnevni planinari, uz dobru kondiciju.",
		priceRsd: 4500,
		priceUnit: "osoba",
		duration: "7 sati",
		groupSize: "4–12",
		difficulty: "umereno",
		imageKey: "tara-hike",
		hostName: "Milan Radojević",
		hostRole: "Vodič Nacionalnog parka Tara",
		hostYears: 11,
		hostPhone: "+381 63 111 2201",
		included: [
			"Licencirani vodič",
			"Ulaz u nacionalni park",
			"Prevoz od Mitrovca do staze",
			"Čaj i užina"
		],
		itinerary: [
			{
				title: "08:30 Mitrovac",
				detail: "Sastanak ispred Info centra, kratak briefing i oprema."
			},
			{
				title: "Uspon kroz šumu",
				detail: "Oko 2,5 sata hoda, umeren uspon, pauze po potrebi."
			},
			{
				title: "Banjska stena",
				detail: "Sat vremena na vidikovcu — kanjon, Drina, fotografije."
			},
			{
				title: "Povratak",
				detail: "Silazak istom stazom, dolazak oko 15:30."
			}
		],
		meetingPoint: "Info centar NP Tara, Mitrovac",
		rating: 4.9,
		reviewCount: 48,
		featured: true,
		reviews: [{
			author: "Ana",
			rating: 5,
			body: "Pogled sa stene je nerealno dobar. Milan zna park u prstima."
		}, {
			author: "Nemanja",
			rating: 5,
			body: "Umeren tempo, nismo jurili. Idealno za prvi ozbiljniji izlet."
		}]
	},
	{
		slug: "tornik-mtb",
		title: "Tornik enduro — bicikl na dan",
		category: "mtb",
		region: "Zlatibor",
		location: "Tornik, Zlatibor",
		shortDesc: "Enduro bicikli spremni za staze Tornika, sa kratkim brifingom i kartom ruta.",
		description: "Iznajmljujemo servisirane enduro bicikle (full suspension) na Torniku. Dobijate kacigu, osnovni alat, i predlog pet staza — od šumskog flow-a do zahtevnijih bermi. Možete samo iznajmiti ili uzeti vođenu grupu popodne. Prevoz od centra Zlatibora dogovaramo uz nadoplatu.",
		priceRsd: 3800,
		priceUnit: "dan",
		duration: "ceo dan",
		groupSize: "1–8",
		difficulty: "umereno",
		imageKey: "zlatibor-mtb",
		hostName: "Ivana Kovač",
		hostRole: "MTB instruktor i mehaničar",
		hostYears: 8,
		hostPhone: "+381 64 222 3104",
		included: [
			"Enduro bicikl",
			"Kaciga i štitnici",
			"Osnovni servis na stazi",
			"Karta ruta"
		],
		itinerary: [
			{
				title: "Preuzimanje 09:00",
				detail: "Podešavanje bicikla, kacige i pritisaka."
			},
			{
				title: "Brifing staza",
				detail: "Pet predloženih linija, težine i izlazi na asfalt."
			},
			{
				title: "Vožnja",
				detail: "Samostalno ili vođena grupa u 13:00."
			},
			{
				title: "Povratak do 18:00",
				detail: "Pranje bicikla i kratak debrief."
			}
		],
		meetingPoint: "Bike baza, podnožje Tornika",
		rating: 4.8,
		reviewCount: 36,
		featured: true,
		reviews: [{
			author: "Luka",
			rating: 5,
			body: "Bicikli su zaista spremni, nisu iznajmljivački smeće. Ivana zna staze."
		}, {
			author: "Maja",
			rating: 4,
			body: "Vođena grupa popodne je bila super. Samo ponesite rukavice."
		}]
	},
	{
		slug: "uvac-meandri",
		title: "Meandri Uvca i beloglavi sup",
		category: "hike",
		region: "Uvac",
		location: "Specijalni rezervat Uvac",
		shortDesc: "Čamac kroz meandre, pa kratak uspon do vidikovca sa supovima iznad glave.",
		description: "Kombinacija čamca i kratkog hoda. Ulazimo u rezervat rano, dok je voda mirna, i idemo kroz potkovice Uvca do molа ispod vidikovca. Uspon je strm ali kratak. Na vrhu su beloglavi supovi — često nisko, ako je vetar dobar. Vodič je iz rezervata i priča o programu reintrodukcije.",
		priceRsd: 6200,
		priceUnit: "osoba",
		duration: "6 sati",
		groupSize: "6–16",
		difficulty: "lako",
		imageKey: "uvac",
		hostName: "Dragan Simić",
		hostRole: "Čuvar rezervata Uvac",
		hostYears: 14,
		hostPhone: "+381 60 333 4410",
		included: [
			"Čamac kroz meandre",
			"Vodič rezervata",
			"Ulaznica",
			"Uspon do vidikovca"
		],
		itinerary: [
			{
				title: "08:00 Mol",
				detail: "Ukrcavanje, prsluci, pravila rezervata."
			},
			{
				title: "Meandri",
				detail: "Sat i po plovidbe kroz potkovice."
			},
			{
				title: "Vidikovac",
				detail: "Uspon 25–40 min, boravak na vrhu, supovi."
			},
			{
				title: "Povratak čamcem",
				detail: "Dolazak na mol oko 14:00."
			}
		],
		meetingPoint: "Mol na Uvcu, kod ulaza u rezervat",
		rating: 5,
		reviewCount: 62,
		featured: true,
		reviews: [{
			author: "Ivana",
			rating: 5,
			body: "Supovi su preleteli deset metara iznad nas. Vredi rani polazak."
		}, {
			author: "Stefan",
			rating: 5,
			body: "Čamac + vidikovac je prava kombinacija. Nije naporno."
		}]
	},
	{
		slug: "ovcar-kablar",
		title: "Ovčarsko-kablarska klisura",
		category: "hike",
		region: "Ovčar-Kablar",
		location: "Ovčar Banja",
		shortDesc: "Uspon na Kablar, manastiri u klisuri i pogled na Zapadnu Moravu.",
		description: "Klisura je blizu Čačka i Arilja — kratka vožnja, veliki teren. Idemo na Kablar stazom iznad reke, sa pogledom na meandar Morave i manastire ukopane u stranu. Tempo je umeren, staza kamena i korenasta. Posle silaska, kafa u Ovčar Banji. Tura je mala grupa, bez razglasa i zastavica.",
		priceRsd: 3200,
		priceUnit: "osoba",
		duration: "5 sati",
		groupSize: "4–10",
		difficulty: "umereno",
		imageKey: "ovcar",
		hostName: "Jelena Pavlović",
		hostRole: "Planinarski vodič",
		hostYears: 7,
		hostPhone: "+381 65 444 5521",
		included: [
			"Vodič",
			"Karta staze",
			"Užina",
			"Preporuka manastira za posetu"
		],
		itinerary: [
			{
				title: "09:00 Ovčar Banja",
				detail: "Sastanak kod mosta, provera opreme."
			},
			{
				title: "Uspon na Kablar",
				detail: "Oko 90 minuta, kamena staza, pauze na vidikovcima."
			},
			{
				title: "Vrh",
				detail: "Pogled na klisuru i Moravu, 30 min."
			},
			{
				title: "Silazak i kafa",
				detail: "Povratak u Banju oko 14:00."
			}
		],
		meetingPoint: "Parking kod mosta, Ovčar Banja",
		rating: 4.7,
		reviewCount: 29,
		featured: false,
		reviews: [{
			author: "Marko",
			rating: 5,
			body: "Savršeno za vikend iz Arilja. Jelena drži tempo i priča zanimljivo."
		}]
	},
	{
		slug: "golija-unesco",
		title: "Golija — UNESCO biosfera",
		category: "hike",
		region: "Golija",
		location: "Bele Vode / Jankov kamen",
		shortDesc: "Duga šumska tura kroz najveći zaštićeni predeo Srbije, sa starim bukvama.",
		description: "Golija je tiha. Nema žičara ni šopova — ima šuma, visoravan i Jankov kamen. Hodamo kroz bukovu prašumu, sa pauzama na čistinama. Tura je duža, ali bez teškog uspona. Ponesite sloj za vetar; na visoravni uvek duva. Vodič radi sa Parkom prirode Golija i zna gde se zadržavaju jeleni u jesen.",
		priceRsd: 4800,
		priceUnit: "osoba",
		duration: "8 sati",
		groupSize: "4–10",
		difficulty: "umereno",
		imageKey: "golija",
		hostName: "Nikola Janković",
		hostRole: "Vodič Parka prirode Golija",
		hostYears: 9,
		hostPhone: "+381 62 555 6602",
		included: [
			"Vodič parka",
			"Prevoz na polaznu tačku",
			"Ručak u planinarskom domu",
			"Karta"
		],
		itinerary: [
			{
				title: "07:30 Ivanjica",
				detail: "Okupljanje, prevoz do Belih Voda."
			},
			{
				title: "Šumska staza",
				detail: "Četiri sata hoda kroz biosferu, pauze na čistinama."
			},
			{
				title: "Jankov kamen",
				detail: "Vidikovac, ručak, povratak drugom stazom."
			}
		],
		meetingPoint: "Centar Ivanjice, parking kod pijace",
		rating: 4.8,
		reviewCount: 22,
		featured: true,
		reviews: [{
			author: "Sara",
			rating: 5,
			body: "Najtiša tura koju sam ikad išla. Šuma je predobra."
		}]
	},
	{
		slug: "kopaonik-bike-park",
		title: "Kopaonik bike park — letnji dan",
		category: "mtb",
		region: "Kopaonik",
		location: "Kopaonik, Pančićev vrh",
		shortDesc: "Dan u bike parku: žičara, iznajmljen downhill bicikl i vodič za prve spusteve.",
		description: "Leti Kopaonik radi kao bike park. Dobijate downhill bicikl, kacigu, štitnike i dnevnu kartu za žičaru. Ako ste novi, prva dva spusta idemo zajedno — linije, kočenje, izlazi. Posle toga vozite sami. Servis je na stanici. Nije potrebna sopstvena oprema.",
		priceRsd: 7200,
		priceUnit: "dan",
		duration: "ceo dan",
		groupSize: "1–6",
		difficulty: "zahtevno",
		imageKey: "kopaonik-mtb",
		hostName: "Vuk Petrović",
		hostRole: "Bike park vodič",
		hostYears: 6,
		hostPhone: "+381 63 777 8803",
		included: [
			"DH bicikl",
			"Zaštitna oprema",
			"Dnevna karta žičare",
			"Dva vođena spusta"
		],
		itinerary: [
			{
				title: "09:00 Mali Karaman",
				detail: "Preuzimanje bicikla i opreme."
			},
			{
				title: "Vođeni spustovi",
				detail: "Dve linije sa vodičem, korekcija tehnike."
			},
			{
				title: "Slobodna vožnja",
				detail: "Park do 16:30, servis po potrebi."
			}
		],
		meetingPoint: "Bike rental, Mali Karaman",
		rating: 4.6,
		reviewCount: 18,
		featured: false,
		reviews: [{
			author: "Đorđe",
			rating: 5,
			body: "Prvi put downhill — vodič nije jurio. Park je čist."
		}]
	},
	{
		slug: "midzor-stara-planina",
		title: "Midžor — krov Stare planine",
		category: "hike",
		region: "Stara planina",
		location: "Babin zub / Midžor",
		shortDesc: "Uspon na najviši vrh Srbije van Kosova, duga visoravan i otvoren vetar.",
		description: "Midžor je 2.169 m. Staza sa Babinog zuba je duga, bez tehničkog penjanja, ali izložena. Polazimo rano da izbegnemo popodnevne oluje. Na vrhu je granični kamen i pogled u Bugarsku. Tura je za ljude sa većom kilometražom u nogama — nije prva tura u sezoni.",
		priceRsd: 5500,
		priceUnit: "osoba",
		duration: "9 sati",
		groupSize: "4–8",
		difficulty: "zahtevno",
		imageKey: "stara-planina",
		hostName: "Ana Stojanović",
		hostRole: "Planinarski vodič",
		hostYears: 12,
		hostPhone: "+381 61 888 9904",
		included: [
			"Vodič",
			"Prevoz od Babinog zuba",
			"Planinski čaj",
			"Praćenje vremena"
		],
		itinerary: [
			{
				title: "06:00 Babin zub",
				detail: "Provera opreme, sloj za vetar obavezan."
			},
			{
				title: "Visoravan",
				detail: "Dugačak hod, bez šume, otvoren teren."
			},
			{
				title: "Midžor",
				detail: "Vrh, pauza, silazak istom linijom."
			}
		],
		meetingPoint: "Parking Babin zub",
		rating: 4.9,
		reviewCount: 31,
		featured: false,
		reviews: [{
			author: "Petar",
			rating: 5,
			body: "Ana ne rizikuje sa vremenom. Vrh je bio čist, vetar jak."
		}]
	},
	{
		slug: "rafting-drina",
		title: "Rafting na Drini, kanjon Tare",
		category: "rafting",
		region: "Tara",
		location: "Perućac — kanjon Drine",
		shortDesc: "Poludnevni rafting kroz kanjon, brzakom umerene težine, sa skiperom u čamcu.",
		description: "Drina ovde nije ekstrem, ali kanjon jeste. Sedam kilometara vode, skiper u svakom čamcu, prsluk i kaciga obavezni. Posle izlaska — ručak na obali. Sezona je od maja do oktobra, voda je uvek hladna. Plivanje nije obavezno; ko hoće, skače sa stene na dogovorenom mestu.",
		priceRsd: 5800,
		priceUnit: "osoba",
		duration: "4 sata",
		groupSize: "6–18",
		difficulty: "lako",
		imageKey: "rafting-drina",
		hostName: "Marko Ilić",
		hostRole: "Rafting skiper",
		hostYears: 10,
		hostPhone: "+381 64 101 2205",
		included: [
			"Čamac i skiper",
			"Prsluk i kaciga",
			"Prevoz do ulaza",
			"Ručak na obali"
		],
		itinerary: [
			{
				title: "10:00 Kamp",
				detail: "Oprema, briefing, podela u čamce."
			},
			{
				title: "Kanjon",
				detail: "Oko 2 sata na vodi, brzaci i mirne dionice."
			},
			{
				title: "Obala",
				detail: "Ručak, prevoz nazad u kamp."
			}
		],
		meetingPoint: "Rafting kamp, Perućac",
		rating: 4.8,
		reviewCount: 54,
		featured: true,
		reviews: [{
			author: "Milica",
			rating: 5,
			body: "Nije strašno, a kanjon je filmski. Skiper drži čamac mirno."
		}, {
			author: "Ognjen",
			rating: 4,
			body: "Hladna voda — ponesite neopren majicu. Ručak solidan."
		}]
	},
	{
		slug: "zlatibor-kvad",
		title: "Kvad tura Zlatiborom",
		category: "atv",
		region: "Zlatibor",
		location: "Zlatibor, Kriva šlja",
		shortDesc: "Dva sata off-road kvadovima po visoravni, šumskim putevima i vidikovcima.",
		description: "Kratka obuka, pa tura. Kvadovi su 450–700cc, za dvoje po mašini ako hoćete. Staza ide van asfalta: šumski putevi, livade, jedan vidikovac prema Torniku. Nije trka — vodič drži tempo. Potrebna vozačka dozvola B kategorije za vozača. Kaciga obavezna, rukavice dajemo.",
		priceRsd: 8500,
		priceUnit: "tura",
		duration: "2 sata",
		groupSize: "2–8",
		difficulty: "lako",
		imageKey: "zlatibor-atv",
		hostName: "Stefan Đorđević",
		hostRole: "Off-road vodič",
		hostYears: 5,
		hostPhone: "+381 65 202 3306",
		included: [
			"Kvad",
			"Kaciga i rukavice",
			"Obuka 15 min",
			"Vodič na turi"
		],
		itinerary: [
			{
				title: "Obuka",
				detail: "Kontrole, kočenje, nagib. 15 minuta na poligonu."
			},
			{
				title: "Tura",
				detail: "Šumski putevi i visoravan, jedna pauza na vidikovcu."
			},
			{
				title: "Povratak",
				detail: "Punjenje, predaja kvada."
			}
		],
		meetingPoint: "Off-road baza, iza hotela Palisad",
		rating: 4.7,
		reviewCount: 41,
		featured: true,
		reviews: [{
			author: "Nikolina",
			rating: 5,
			body: "Nisam nikad vozila kvad. Obuka je bila dovoljna, tura zabavna."
		}]
	},
	{
		slug: "fruska-gora-manastiri",
		title: "Fruška gora — manastiri i staze",
		category: "hike",
		region: "Fruška gora",
		location: "Iriški venac",
		shortDesc: "Lagani hod kroz lindenove šume, sa zastajanjem kod dva manastira i vidikovca.",
		description: "Fruška gora je najbliža planina Beogradu i Novom Sadu. Ova tura nije uspon — više je šetnja sa kontekstom. Idemo od Iriškog venca kroz šumu do manastira, pa na vidikovac. Tempo je lak, pogodan i za decu od 10 godina. Vodič priča o nacionalnom parku, vinogradima i šestnaest manastira na obroncima.",
		priceRsd: 2800,
		priceUnit: "osoba",
		duration: "4 sata",
		groupSize: "6–16",
		difficulty: "lako",
		imageKey: "fruska",
		hostName: "Marija Nikolić",
		hostRole: "Vodič NP Fruška gora",
		hostYears: 8,
		hostPhone: "+381 63 303 4407",
		included: [
			"Vodič",
			"Ulaz u park",
			"Kratka degustacija lokalnog vina (21+)"
		],
		itinerary: [
			{
				title: "10:00 Iriški venac",
				detail: "Sastanak kod spomenika, mapa dana."
			},
			{
				title: "Šuma i manastir",
				detail: "Lagani hod, poseta dvorištu manastira."
			},
			{
				title: "Vidikovac",
				detail: "Pogled na Srem, povratak do 14:00."
			}
		],
		meetingPoint: "Spomenik, Iriški venac",
		rating: 4.6,
		reviewCount: 27,
		featured: false,
		reviews: [{
			author: "Bojan",
			rating: 4,
			body: "Odlično za goste iz grada. Nije naporno, a nije ni prazna šetnja."
		}]
	},
	{
		slug: "rtanj-siljak",
		title: "Rtanj — piramida i vrh Šiljak",
		category: "hike",
		region: "Rtanj",
		location: "Rtanj, istočna Srbija",
		shortDesc: "Uspon na prepoznatljivi piramidalni vrh, sa travnatim grebenom i širokim pogledom.",
		description: "Rtanj izgleda kao da ga je neko nacrtao. Staza je jasna, uspon stalan, bez penjanja. Na Šiljku je mali krst i vetar. Tura kreće rano zbog sunca na ogoljenoj padini. Vodič nosi čaj od rtanjske trave — lokalni običaj, ne magija. Pogodno za solidnu kondiciju, 1100 m visinske razlike.",
		priceRsd: 3900,
		priceUnit: "osoba",
		duration: "7 sati",
		groupSize: "4–12",
		difficulty: "umereno",
		imageKey: "rtanj",
		hostName: "Igor Savić",
		hostRole: "Planinarski vodič",
		hostYears: 6,
		hostPhone: "+381 64 404 5508",
		included: [
			"Vodič",
			"Čaj od rtanjske trave",
			"Praćenje grupe"
		],
		itinerary: [
			{
				title: "07:00 Podnožje",
				detail: "Selo Rtanj, voda i krema za sunce obavezni."
			},
			{
				title: "Uspon",
				detail: "Tri do četiri sata, stalan nagib."
			},
			{
				title: "Šiljak",
				detail: "Vrh, pauza, silazak."
			}
		],
		meetingPoint: "Parking u selu Rtanj",
		rating: 4.8,
		reviewCount: 33,
		featured: false,
		reviews: [{
			author: "Helena",
			rating: 5,
			body: "Oblik planine uživo je još jači. Uspon boli, pogled plaća."
		}]
	},
	{
		slug: "djerdap-veliki-kazan",
		title: "Đerdap i Veliki kazan",
		category: "hike",
		region: "Đerdap",
		location: "Donji Milanovac — Veliki kazan",
		shortDesc: "Vidikovci iznad Dunava tamo gde je reka najoža i litice najviše.",
		description: "Gvozdena kapija. Hodamo stazom iznad Velikog kazana, gde se Dunav steže između litica. Tura uključuje kratku vožnju čamcem ispod klisura ako je voda mirna. Vodič je iz nacionalnog parka — Trajanova tabla, istorija granice, ptice. Nije teško, ali staza je izložena; deca uz ruku.",
		priceRsd: 5200,
		priceUnit: "osoba",
		duration: "6 sati",
		groupSize: "4–12",
		difficulty: "lako",
		imageKey: "djerdap",
		hostName: "Dejan Lukić",
		hostRole: "Vodič NP Đerdap",
		hostYears: 13,
		hostPhone: "+381 60 505 6609",
		included: [
			"Vodič parka",
			"Čamac (ako vreme dozvoli)",
			"Ulaznica",
			"Prevoz između tačaka"
		],
		itinerary: [
			{
				title: "09:00 Donji Milanovac",
				detail: "Briefing, prevoz do staze."
			},
			{
				title: "Vidikovci",
				detail: "Hod iznad kazana, pauze na ogradama."
			},
			{
				title: "Reka",
				detail: "Kratka plovidba ispod litica, povratak."
			}
		],
		meetingPoint: "Centar Donjeg Milanovca, kod muzeja",
		rating: 4.9,
		reviewCount: 25,
		featured: false,
		reviews: [{
			author: "Tea",
			rating: 5,
			body: "Dunav ovde ne liči na ravnicu. Čamac ispod litica je bio vrhunac."
		}]
	},
	{
		slug: "zlatibor-jahanje",
		title: "Jahanje na Zlatiborskoj visoravni",
		category: "horse",
		region: "Zlatibor",
		location: "Ljubiš, Zlatibor",
		shortDesc: "Sat i po jahanja kroz livade i borove, za početnike i one koji već jašu.",
		description: "Konji su stariji, mirni, naviknuti na goste. Početnici dobijaju vodiča koji vodi konja na prvih petnaest minuta, zatim lagani kas po visoravni. Iskusniji mogu dužu liniju ka Šljivovici. Kaciga obavezna. Deca od 8 godina u pratnji. Nema galopa na prvoj turi.",
		priceRsd: 3500,
		priceUnit: "osoba",
		duration: "90 min",
		groupSize: "2–6",
		difficulty: "lako",
		imageKey: "horse-zlatibor",
		hostName: "Jovana Minić",
		hostRole: "Instruktor jahanja",
		hostYears: 9,
		hostPhone: "+381 62 606 7710",
		included: [
			"Konj i oprema",
			"Kaciga",
			"Instruktor",
			"Kratka obuka"
		],
		itinerary: [
			{
				title: "Obuka",
				detail: "Penjanje, držanje, zaustavljanje. 15 min."
			},
			{
				title: "Staza",
				detail: "Livade i borovi, tempo po grupi."
			},
			{
				title: "Štala",
				detail: "Predaja konja, voda, fotografije."
			}
		],
		meetingPoint: "Ergela kod Ljubiša",
		rating: 4.8,
		reviewCount: 19,
		featured: false,
		reviews: [{
			author: "Dunja",
			rating: 5,
			body: "Konji mirni, Jovana strpljiva. Ćerka od 9 je bila srećna."
		}]
	},
	{
		slug: "kamp-perucac",
		title: "Kamp Perućac na Drini",
		category: "camp",
		region: "Tara",
		location: "Perućac, obala Drine",
		shortDesc: "Šatorsko mesto uz reku, sa vatrom, kajakom i izlazom na staze Tare.",
		description: "Malo kampovanje, ne glamping. Šator na travnatoj terasi iznad vode, zajednička vatra, čista česma i suvi toalet. Iznajmljujete mesto ili kompletan šator sa vrećama. Ujutru kajak po mirnoj Drini, popodne staza ka Bajnoj Bašti. Nema razglasa. Generator se gasi u 22.",
		priceRsd: 2400,
		priceUnit: "dan",
		duration: "noćenje",
		groupSize: "1–6",
		difficulty: "lako",
		imageKey: "camp-perucac",
		hostName: "Branko Vasić",
		hostRole: "Domaćin kampa",
		hostYears: 15,
		hostPhone: "+381 63 707 8811",
		included: [
			"Mesto za šator",
			"Drva za vatru",
			"Pristup kajaku",
			"Toalet i česma"
		],
		itinerary: [
			{
				title: "Dolazak od 14:00",
				detail: "Izbor parcele, postavljanje."
			},
			{
				title: "Veče",
				detail: "Vatra, Drina, tišina posle 22."
			},
			{
				title: "Jutro",
				detail: "Kajak ili kafa, checkout do 11."
			}
		],
		meetingPoint: "Kamp Perućac, skretanje posle brane",
		rating: 4.7,
		reviewCount: 16,
		featured: false,
		reviews: [{
			author: "Vanja",
			rating: 5,
			body: "Prosto i čisto. Reka je tri koraka od šatora. Spavao sam kao top."
		}]
	},
	{
		slug: "murtenica-downhill",
		title: "Murtenica — šumski downhill",
		category: "mtb",
		region: "Zlatibor",
		location: "Murtenica, Čajetina",
		shortDesc: "Vođeni spust kroz staru šumu Murtenice, koreni, berme i malo asfalta.",
		description: "Murtenica je tamnija i tehničkija od Tornika. Tura je vođena: shuttle na vrh, pa spust šumom do Čajetine. Bicikl može vaš ili naš enduro. Kaciga puna, štitnici obavezni. Nije za prvi dan na brdskom — treba da umete da kočite i da čitate koren. Grupa mala, da se ne čeka na bermama.",
		priceRsd: 6400,
		priceUnit: "tura",
		duration: "5 sati",
		groupSize: "3–6",
		difficulty: "zahtevno",
		imageKey: "murtenica-mtb",
		hostName: "Filip Radović",
		hostRole: "Enduro vodič",
		hostYears: 7,
		hostPhone: "+381 64 808 9912",
		included: [
			"Shuttle na vrh",
			"Vodič",
			"Enduro bicikl po želji",
			"Zaštitna oprema"
		],
		itinerary: [
			{
				title: "10:00 Čajetina",
				detail: "Provera kocnica i pritisaka."
			},
			{
				title: "Shuttle",
				detail: "Uspon kombijem, briefing linije."
			},
			{
				title: "Spust",
				detail: "Šuma, koreni, dve pauze, izlaz na asfalt."
			}
		],
		meetingPoint: "Parking kod škole, Čajetina",
		rating: 4.9,
		reviewCount: 14,
		featured: false,
		reviews: [{
			author: "Andrija",
			rating: 5,
			body: "Prava šuma, nije bike-park staza. Filip zna gde se lomi."
		}]
	}
];
function parseListing(row) {
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		category: row.category,
		region: row.region,
		location: row.location,
		shortDesc: row.short_desc,
		description: row.description,
		priceRsd: Number(row.price_rsd),
		priceUnit: row.price_unit,
		duration: row.duration,
		groupSize: row.group_size,
		difficulty: row.difficulty,
		imageKey: row.image_key,
		hostName: row.host_name,
		hostRole: row.host_role,
		hostYears: Number(row.host_years),
		hostPhone: row.host_phone,
		included: JSON.parse(row.included),
		itinerary: JSON.parse(row.itinerary),
		meetingPoint: row.meeting_point,
		rating: Number(row.rating),
		reviewCount: Number(row.review_count),
		featured: Boolean(row.featured)
	};
}
var seedPromise = null;
async function ensureSeeded() {
	if (!seedPromise) seedPromise = (async () => {
		const sql = await getSql();
		const [{ c }] = await sql`select count(*)::int as c from listings`;
		if (c > 0) return;
		for (const item of SEED_LISTINGS) {
			const listingId = (await sql`
          insert into listings (
            slug, title, category, region, location, short_desc, description,
            price_rsd, price_unit, duration, group_size, difficulty, image_key,
            host_name, host_role, host_years, host_phone, included, itinerary,
            meeting_point, rating, review_count, featured
          ) values (
            ${item.slug}, ${item.title}, ${item.category}, ${item.region},
            ${item.location}, ${item.shortDesc}, ${item.description},
            ${item.priceRsd}, ${item.priceUnit}, ${item.duration}, ${item.groupSize},
            ${item.difficulty}, ${item.imageKey}, ${item.hostName}, ${item.hostRole},
            ${item.hostYears}, ${item.hostPhone}, ${JSON.stringify(item.included)},
            ${JSON.stringify(item.itinerary)}, ${item.meetingPoint}, ${item.rating},
            ${item.reviewCount}, ${item.featured}
          ) returning id
        `)[0]?.id;
			if (!listingId) continue;
			for (const review of item.reviews) await sql`
            insert into reviews (listing_id, author, rating, body)
            values (${listingId}, ${review.author}, ${review.rating}, ${review.body})
          `;
		}
	})().catch((err) => {
		seedPromise = null;
		throw err;
	});
	return seedPromise;
}
var listInput = object({
	q: string().optional(),
	category: string().optional(),
	region: string().optional(),
	difficulty: string().optional(),
	sort: _enum([
		"featured",
		"price_asc",
		"price_desc",
		"rating"
	]).optional()
});
var listListings_createServerFn_handler = createServerRpc({
	id: "f24e3e55b8843be3714011804beabbe76ca57c09c0fc5a685ef4a6ef981305e3",
	name: "listListings",
	filename: "src/lib/listings.ts"
}, (opts) => listListings.__executeServer(opts));
var listListings = createServerFn({ method: "GET" }).validator(listInput).handler(listListings_createServerFn_handler, async ({ data }) => {
	await ensureSeeded();
	let items = (await (await getSql())`
      select * from listings order by featured desc, rating desc, id asc
    `).map(parseListing);
	const q = data.q?.trim().toLowerCase();
	if (q) items = items.filter((item) => {
		return `${item.title} ${item.location} ${item.region} ${item.shortDesc} ${item.hostName}`.toLowerCase().includes(q);
	});
	if (data.category) items = items.filter((item) => item.category === data.category);
	if (data.region) items = items.filter((item) => item.region === data.region);
	if (data.difficulty) items = items.filter((item) => item.difficulty === data.difficulty);
	if (data.sort === "price_asc") items.sort((a, b) => a.priceRsd - b.priceRsd);
	if (data.sort === "price_desc") items.sort((a, b) => b.priceRsd - a.priceRsd);
	if (data.sort === "rating") items.sort((a, b) => b.rating - a.rating);
	return items;
});
var getListing_createServerFn_handler = createServerRpc({
	id: "4cec520b81c06e0e5e3b60a990851e7e368b15d05d04bd4f01a12701f07d5cc8",
	name: "getListing",
	filename: "src/lib/listings.ts"
}, (opts) => getListing.__executeServer(opts));
var getListing = createServerFn({ method: "GET" }).validator(object({ slug: string() })).handler(getListing_createServerFn_handler, async ({ data }) => {
	await ensureSeeded();
	const sql = await getSql();
	const row = (await sql`select * from listings where slug = ${data.slug} limit 1`)[0];
	if (!row) return null;
	const listing = parseListing(row);
	const reviews = (await sql`
      select id, author, rating, body, created_at
      from reviews where listing_id = ${listing.id}
      order by id desc
    `).map((r) => ({
		id: r.id,
		author: r.author,
		rating: Number(r.rating),
		body: r.body,
		createdAt: String(r.created_at)
	}));
	return {
		...listing,
		reviews
	};
});
var listFeatured_createServerFn_handler = createServerRpc({
	id: "f1208e5350025071c264cbd811b2a379c4d50678e59e5c6aacc13c1d085424c4",
	name: "listFeatured",
	filename: "src/lib/listings.ts"
}, (opts) => listFeatured.__executeServer(opts));
var listFeatured = createServerFn({ method: "GET" }).handler(listFeatured_createServerFn_handler, async () => {
	await ensureSeeded();
	return (await (await getSql())`
    select * from listings where featured = true order by rating desc limit 6
  `).map(parseListing);
});
var createInput = object({
	title: string().trim().min(4).max(80),
	category: _enum([
		"hike",
		"mtb",
		"atv",
		"rafting",
		"horse",
		"camp"
	]),
	region: string().trim().min(2).max(40),
	location: string().trim().min(3).max(80),
	shortDesc: string().trim().min(12).max(160),
	description: string().trim().min(40).max(2e3),
	priceRsd: number().int().min(500).max(2e5),
	priceUnit: _enum([
		"osoba",
		"dan",
		"sat",
		"tura"
	]),
	duration: string().trim().min(2).max(40),
	groupSize: string().trim().min(1).max(20),
	difficulty: _enum([
		"lako",
		"umereno",
		"zahtevno"
	]),
	hostName: string().trim().min(3).max(60),
	hostRole: string().trim().min(3).max(60),
	hostPhone: string().trim().min(8).max(24),
	meetingPoint: string().trim().min(4).max(120),
	included: string().trim().min(4).max(400)
});
var createListing_createServerFn_handler = createServerRpc({
	id: "dbba1fd22c0136f0cd09668c1705b57515fbeaa836d24b04e39e32b00e1b9826",
	name: "createListing",
	filename: "src/lib/listings.ts"
}, (opts) => createListing.__executeServer(opts));
var createListing = createServerFn({ method: "POST" }).validator(createInput).handler(createListing_createServerFn_handler, async ({ data }) => {
	await ensureSeeded();
	const sql = await getSql();
	const slug = slugify(data.title);
	const included = data.included.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8);
	const imageKey = CATEGORY_IMAGE[data.category] ?? "tara-hike";
	await sql`
      insert into listings (
        slug, title, category, region, location, short_desc, description,
        price_rsd, price_unit, duration, group_size, difficulty, image_key,
        host_name, host_role, host_years, host_phone, included, itinerary,
        meeting_point, rating, review_count, featured
      ) values (
        ${slug}, ${data.title}, ${data.category}, ${data.region}, ${data.location},
        ${data.shortDesc}, ${data.description}, ${data.priceRsd}, ${data.priceUnit},
        ${data.duration}, ${data.groupSize}, ${data.difficulty}, ${imageKey},
        ${data.hostName}, ${data.hostRole}, ${1}, ${data.hostPhone},
        ${JSON.stringify(included)},
        ${JSON.stringify([{
		title: "Sastanak",
		detail: data.meetingPoint
	}])},
        ${data.meetingPoint}, ${5}, ${0}, ${false}
      )
    `;
	return { slug };
});
//#endregion
export { createListing_createServerFn_handler, getListing_createServerFn_handler, listFeatured_createServerFn_handler, listListings_createServerFn_handler };
