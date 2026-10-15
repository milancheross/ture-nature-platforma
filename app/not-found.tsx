import Link from "next/link";
export default function NotFound() { return <main className="container" style={{paddingBlock:100,minHeight:"70vh"}}><p className="kicker">404 · STAZA</p><h1 style={{fontSize:"clamp(36px,5vw,58px)"}}>Ova staza se ne nalazi ovde.</h1><p><Link className="btn" href="/">Vrati se na početnu</Link></p></main>; }
