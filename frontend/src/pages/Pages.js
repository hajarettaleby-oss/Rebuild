import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listingsAPI, ordersAPI, msgAPI, notifsAPI, statsAPI, authAPI } from "../api";
import { MAD, ago, CITIES, BIZ_TYPES, CONDITIONS, CATS, Spinner, Avatar, Stars, CatIcon, InfoBox, TopBar, SectionLabel } from "../components/Shared";
import BottomNav from "../components/BottomNav";

// ════════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════════
export function LoginPage() {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ email:"", password:"" }); const [err, setErr] = useState(""); const [load, setLoad] = useState(false); const [show, setShow] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]:e.target.value }));
  const go = async () => { if (!f.email||!f.password) { setErr("Please fill all fields"); return; } setLoad(true); setErr(""); try { await login(f.email, f.password); nav("/home"); } catch(e) { setErr(e.response?.data?.error||"Invalid credentials"); } finally { setLoad(false); } };
  const demo = (email) => setF({ email, password:"demo1234" });
  return (
    <div className="app">
      <div style={{background:"var(--gold)",padding:"60px 24px 48px",textAlign:"center",flexShrink:0}}>
        <div style={{width:80,height:80,background:"rgba(255,255,255,.2)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <h1 style={{color:"#fff",fontSize:28,fontWeight:700,letterSpacing:-.5}}>ReBuild</h1>
        <p style={{color:"rgba(255,255,255,.85)",fontSize:13,marginTop:5}}>Morocco's B2B construction marketplace</p>
      </div>
      <div className="scroll" style={{padding:"28px 22px 24px"}}>
        {err && <div className="err">{err}</div>}
        <div className="field"><label>Email address</label><input className="input" type="email" placeholder="you@company.ma" value={f.email} onChange={set("email")} /></div>
        <div className="field"><label>Password</label><div style={{position:"relative"}}><input className="input" type={show?"text":"password"} placeholder="••••••••" value={f.password} onChange={set("password")} style={{paddingRight:52}} /><button onClick={() => setShow(!show)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:12,color:"var(--gold)",cursor:"pointer",fontWeight:600}}>{show?"Hide":"Show"}</button></div></div>
        <div style={{textAlign:"right",marginBottom:20}}><span style={{fontSize:12,color:"var(--gold)",cursor:"pointer"}}>Forgot password?</span></div>
        <button className="btn btn-primary" onClick={go} disabled={load}>{load?"Signing in...":"Sign in"}</button>
        <div className="divider"><span>Demo accounts (tap to fill)</span></div>
        <div style={{background:"var(--bg)",borderRadius:10,padding:12,border:"1px solid var(--border)"}}>
          {[{n:"Karim — Contractor (Casablanca)",e:"karim@btp.ma"},{n:"Mohamed — Developer (Rabat)",e:"benali@btpma.ma"},{n:"Youssef — Tiles specialist (Marrakech)",e:"amrani@carrelage.ma"},{n:"Fatima — Homeowner",e:"fatima@gmail.com"}].map(u=>(
            <button key={u.e} onClick={()=>demo(u.e)} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",padding:"7px 0",fontSize:12,color:"var(--gold)",cursor:"pointer",borderBottom:"0.5px solid var(--border)",fontFamily:"inherit"}}>
              <span style={{fontWeight:600}}>{u.n}</span><br/><span style={{color:"var(--text-3)",fontSize:11}}>{u.e}</span>
            </button>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:13,color:"var(--text-3)",marginTop:24}}>No account? <Link to="/register" style={{color:"var(--gold)",fontWeight:700,textDecoration:"none"}}>Create one free</Link></p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// REGISTER (3 steps)
// ════════════════════════════════════════════════════════════════
const ACC_TYPES = [
  { id:"sell", label:"Sell surplus materials", sub:"List leftover tiles, cement, steel, wood and more", icon:<path d="M12 2L2 7l10 5 10-5-10-5z"/> },
  { id:"buy", label:"Buy surplus materials", sub:"Find BTP materials at 30–50% below market price", icon:<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></> },
  { id:"rent", label:"Rent / share tools", sub:"Share or borrow professional BTP equipment", icon:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> },
];
export function RegisterPage() {
  const { register } = useAuth(); const nav = useNavigate();
  const [step, setStep] = useState(1); const [load, setLoad] = useState(false); const [err, setErr] = useState("");
  const [f, setF] = useState({ fullName:"", email:"", phone:"", password:"", city:"Casablanca", neighborhood:"", companyName:"", businessType:"General contractor", ice:"", yearsInBusiness:"", accountTypes:[], bio:"" });
  const set = k => e => setF(p => ({ ...p, [k]:e.target.value }));
  const tog = id => setF(p => ({ ...p, accountTypes:p.accountTypes.includes(id)?p.accountTypes.filter(t=>t!==id):[...p.accountTypes,id] }));
  const next = () => { setErr(""); if(step===1&&(!f.fullName||!f.email||!f.password)){setErr("Fill all required fields");return;} if(step===1&&f.password.length<6){setErr("Password min 6 characters");return;} if(step===3&&!f.accountTypes.length){setErr("Select at least one type");return;} if(step<3)setStep(s=>s+1); else go(); };
  const go = async () => { setLoad(true); try { await register({ ...f, yearsInBusiness:f.yearsInBusiness?parseInt(f.yearsInBusiness):null }); nav("/home"); } catch(e) { setErr(e.response?.data?.error||"Registration failed"); setStep(1); } finally { setLoad(false); } };
  return (
    <div className="app">
      <TopBar title="Create account" subtitle={`Step ${step} of 3`} onBack={() => step>1?setStep(s=>s-1):nav("/login")} />
      <div className="scroll" style={{padding:"18px 20px 24px"}}>
        <div className="steps-row">{[1,2,3].map(s=><div key={s} className={`step-bar${s<=step?" on":""}`}/>)}</div>
        {err&&<div className="err">{err}</div>}
        {step===1&&<>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:18}}>Personal information</h2>
          <div className="field"><label>Full name *</label><input className="input" placeholder="Karim Bakkali" value={f.fullName} onChange={set("fullName")}/></div>
          <div className="field"><label>Phone (Morocco) *</label><div style={{display:"flex",gap:8}}><div style={{border:"1.5px solid var(--border)",borderRadius:8,padding:"11px 13px",fontSize:14,color:"var(--text-3)",whiteSpace:"nowrap",flexShrink:0}}>+212</div><input className="input" placeholder="06 12 34 56 78" value={f.phone} onChange={set("phone")} style={{flex:1}}/></div></div>
          <div className="field"><label>Email *</label><input className="input" type="email" placeholder="you@company.ma" value={f.email} onChange={set("email")}/></div>
          <div className="field"><label>Password * (min 6 chars)</label><input className="input" type="password" placeholder="••••••••" value={f.password} onChange={set("password")}/></div>
          <div className="input-row"><div className="field"><label>City</label><select className="input" value={f.city} onChange={set("city")}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div><div className="field"><label>Neighborhood</label><input className="input" placeholder="Hay Hassani" value={f.neighborhood} onChange={set("neighborhood")}/></div></div>
        </>}
        {step===2&&<>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:6}}>Company profile</h2>
          <p style={{fontSize:13,color:"var(--text-3)",marginBottom:18,lineHeight:1.5}}>Business info helps buyers trust you. ICE verification gives you the Verified Pro badge.</p>
          <div className="field"><label>Company / business name</label><input className="input" placeholder="BTP Bakkali & Associés" value={f.companyName} onChange={set("companyName")}/></div>
          <div className="field"><label>Business type</label><select className="input" value={f.businessType} onChange={set("businessType")}>{BIZ_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="field"><label>ICE number (registre de commerce)</label><input className="input" placeholder="001 234 567 000 58" value={f.ice} onChange={set("ice")}/></div>
          <div className="field"><label>Years in business</label><select className="input" value={f.yearsInBusiness} onChange={set("yearsInBusiness")}><option value="">Select...</option>{["Less than 1","1–3","4–7","8–15","15+"].map(y=><option key={y}>{y}</option>)}</select></div>
          <div className="field"><label>Short bio (optional)</label><textarea className="input" placeholder="Describe your business activity..." value={f.bio} onChange={set("bio")}/></div>
          <InfoBox type="gold">Your ICE number lets us verify your business and grant the <strong>Verified Pro badge</strong>, boosting listing visibility by 2×.</InfoBox>
        </>}
        {step===3&&<>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:6}}>What do you want to do?</h2>
          <p style={{fontSize:13,color:"var(--text-3)",marginBottom:18,lineHeight:1.5}}>Select all that apply. You can always change this in your profile.</p>
          {ACC_TYPES.map(t=>{const sel=f.accountTypes.includes(t.id); return(
            <button key={t.id} className={`choice${sel?" sel":""}`} onClick={()=>tog(t.id)}>
              <div className="choice-icon" style={{color:sel?"#fff":"var(--text-3)"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{t.icon}</svg></div>
              <div><div className="choice-title">{t.label}</div><div className="choice-sub">{t.sub}</div></div>
              <div className="choice-check">{sel&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</div>
            </button>
          );})}
        </>}
        <button className="btn btn-primary" onClick={next} disabled={load} style={{marginTop:20}}>{load?"Creating account...":step<3?"Continue →":"Create my account"}</button>
        {step===1&&<p style={{textAlign:"center",fontSize:13,color:"var(--text-3)",marginTop:18}}>Already registered? <Link to="/login" style={{color:"var(--gold)",fontWeight:700,textDecoration:"none"}}>Sign in</Link></p>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// HOME
// ════════════════════════════════════════════════════════════════
export function HomePage() {
  const { user } = useAuth(); const nav = useNavigate();
  const [listings, setListings] = useState([]); const [load, setLoad] = useState(true);
  const [cat, setCat] = useState("all"); const [search, setSearch] = useState(""); const [stats, setStats] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  useEffect(()=>{ statsAPI.platform().then(r=>setStats(r.data)).catch(()=>{}); notifsAPI.getAll().then(r=>setNotifCount(r.data.filter(n=>!n.read).length)).catch(()=>{}); },[]);
  useEffect(()=>{ setLoad(true); listingsAPI.getAll({ category:cat==="all"?undefined:cat, search:search||undefined }).then(r=>setListings(r.data)).finally(()=>setLoad(false)); },[cat,search]);
  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-row">
          <div><h1>ReBuild</h1><p>{user?.city||"Morocco"} · BTP marketplace</p></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>nav("/notifications")} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifCount>0&&<div className="notif-dot" style={{position:"absolute",top:6,right:6}}/>}
            </button>
          </div>
        </div>
        <div className="search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search materials, tools, city..." value={search} onChange={e=>setSearch(e.target.value)} />
          {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"rgba(255,255,255,.8)",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>}
        </div>
      </div>
      <div className="scroll">
        {stats&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,padding:"13px 16px 4px"}}>
          {[{l:"Listings",v:stats.totalListings},{l:"Pro members",v:stats.totalUsers},{l:"Cities",v:stats.citiesCovered}].map(s=>(
            <div key={s.l} style={{background:"var(--white)",borderRadius:10,padding:"10px",textAlign:"center",border:"1px solid var(--border)"}}>
              <div style={{fontSize:18,fontWeight:700,color:"var(--gold)"}}>{s.v}</div>
              <div style={{fontSize:10,color:"var(--text-3)",marginTop:2,lineHeight:1.3}}>{s.l}</div>
            </div>
          ))}
        </div>}
        <div className="cat-scroll">
          {CATS.map(c=><button key={c.id} className={`pill${cat===c.id?" sel":""}`} onClick={()=>setCat(c.id)}>{c.label}</button>)}
        </div>
        <div style={{padding:"10px 16px 20px"}}>
          <SectionLabel right={<span style={{fontSize:12,color:"var(--gold)",cursor:"pointer"}} onClick={()=>nav("/browse")}>See all →</span>}>{search?`Results for "${search}"`:cat==="all"?"Latest listings near you":CATS.find(c=>c.id===cat)?.label}</SectionLabel>
          {load?<Spinner/>:listings.length===0?<div className="empty"><div className="empty-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><h3>No listings found</h3><p>Try a different category or search term</p></div>:(
            <div className="listing-grid">
              {listings.map(l=><ListingCard key={l.id} l={l} onClick={()=>nav(`/listing/${l.id}`)}/>)}
            </div>
          )}
        </div>
      </div>
      <BottomNav active="home"/>
    </div>
  );
}

function ListingCard({ l, onClick }) {
  return (
    <div className="listing-card" onClick={onClick}>
      <div className="listing-card-img"><CatIcon cat={l.category} size={36}/></div>
      <div className="listing-card-body">
        <div className="listing-card-title">{l.title}</div>
        <div className="listing-card-loc">{l.city} · {ago(l.createdAt)}</div>
        <div className="listing-card-price">{MAD(l.totalPrice)}{l.priceUnit&&<span style={{fontSize:11,fontWeight:500}}>/{l.priceUnit}</span>}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:5}}>
          {l.type==="rent"&&<span className="badge badge-rent">Rental</span>}
          {l.seller?.isVerified&&<span className="badge badge-verified">✓ Pro</span>}
          {l.views>100&&<span className="badge badge-hot">🔥 Popular</span>}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// BROWSE
// ════════════════════════════════════════════════════════════════
export function BrowsePage() {
  const nav = useNavigate();
  const [listings, setListings] = useState([]); const [load, setLoad] = useState(true);
  const [search, setSearch] = useState(""); const [filters, setFilters] = useState({ category:"all", type:"all", city:"", sort:"views" }); const [showF, setShowF] = useState(false);
  const setF = (k,v) => setFilters(p=>({...p,[k]:v}));
  useEffect(()=>{ setLoad(true); listingsAPI.getAll({ category:filters.category==="all"?undefined:filters.category, type:filters.type==="all"?undefined:filters.type, city:filters.city||undefined, search:search||undefined, sort:filters.sort }).then(r=>setListings(r.data)).finally(()=>setLoad(false)); },[filters,search]);
  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-row"><h1>Browse</h1><button onClick={()=>setShowF(!showF)} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/></svg></button></div>
        <div className="search-bar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input placeholder="Search all listings..." value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"rgba(255,255,255,.8)",cursor:"pointer",fontSize:18}}>×</button>}</div>
      </div>
      {showF&&<div style={{background:"var(--white)",padding:"13px 16px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:9}}>
          {[{label:"Category",key:"category",opts:CATS.map(c=>({v:c.id,l:c.label}))},{label:"Type",key:"type",opts:[{v:"all",l:"All types"},{v:"sale",l:"Sale"},{v:"rent",l:"Rental"}]},{label:"City",key:"city",opts:[{v:"",l:"All cities"},...CITIES.map(c=>({v:c,l:c}))]},{label:"Sort by",key:"sort",opts:[{v:"views",l:"Most popular"},{v:"newest",l:"Newest"},{v:"price_asc",l:"Price ↑"},{v:"price_desc",l:"Price ↓"}]}].map(({label,key,opts})=>(
            <div key={key}><div style={{fontSize:11,fontWeight:700,color:"var(--text-3)",marginBottom:4}}>{label}</div>
              <select style={{width:"100%",border:"1px solid var(--border)",borderRadius:7,padding:"8px 10px",fontSize:12,fontFamily:"inherit"}} value={filters[key]} onChange={e=>setF(key,e.target.value)}>
                {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={()=>{setFilters({category:"all",type:"all",city:"",sort:"views"});setSearch("");}} style={{fontSize:12,color:"var(--gold)",background:"none",border:"none",cursor:"pointer",padding:"4px 0",fontFamily:"inherit"}}>Clear all filters</button>
      </div>}
      <div className="cat-scroll">{CATS.map(c=><button key={c.id} className={`pill${filters.category===c.id?" sel":""}`} onClick={()=>setF("category",c.id)}>{c.label}</button>)}</div>
      <div className="scroll" style={{padding:"10px 16px 16px"}}>
        <div style={{fontSize:12,color:"var(--text-3)",marginBottom:11}}>{load?"Loading...":` ${listings.length} listing${listings.length!==1?"s":""} found`}</div>
        {load?<Spinner/>:listings.length===0?<div className="empty"><div className="empty-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><h3>No results</h3><p>Try different filters or search terms</p></div>:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {listings.map(l=>(
              <div key={l.id} onClick={()=>nav(`/listing/${l.id}`)} style={{background:"var(--white)",borderRadius:12,border:"1px solid var(--border)",padding:"12px 14px",cursor:"pointer",display:"flex",gap:13,alignItems:"center",boxShadow:"var(--shadow)"}}>
                <CatIcon cat={l.category} size={26}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.title}</div>
                  <div style={{fontSize:11,color:"var(--text-4)",marginBottom:4}}>{l.city}{l.neighborhood?` · ${l.neighborhood}`:""} · {ago(l.createdAt)}</div>
                  <div style={{display:"flex",gap:4}}>{l.type==="rent"&&<span className="badge badge-rent">Rental</span>}{l.seller?.isVerified&&<span className="badge badge-verified">✓ Pro</span>}<span style={{fontSize:10,color:"var(--text-4)"}}>{l.quantity}</span></div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--gold)"}}>{MAD(l.totalPrice)}</div>
                  {l.priceUnit&&<div style={{fontSize:10,color:"var(--text-4)"}}>{l.priceUnit}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav active="browse"/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// LISTING DETAIL
// ════════════════════════════════════════════════════════════════
export function ListingDetailPage() {
  const { id } = useParams(); const nav = useNavigate(); const { user } = useAuth();
  const [l, setL] = useState(null); const [load, setLoad] = useState(true);
  useEffect(()=>{ listingsAPI.getOne(id).then(r=>setL(r.data)).catch(()=>nav("/home")).finally(()=>setLoad(false)); },[id]);
  if(load)return<div className="app"><Spinner/></div>;
  if(!l)return null;
  const mine = user?.id===l.sellerId;
  const priceSaved = l.type==="sale"&&l.unitPrice?Math.round((l.unitPrice*2-l.unitPrice)/l.unitPrice*100):null;
  return (
    <div className="app">
      <div style={{overflowY:"auto",flex:1}}>
        <div style={{height:200,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0}}>
          <CatIcon cat={l.category} size={72}/>
          <button onClick={()=>nav(-1)} style={{position:"absolute",top:48,left:14,background:"rgba(255,255,255,.95)",border:"none",borderRadius:50,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"var(--shadow)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
          <button style={{position:"absolute",top:48,right:14,background:"rgba(255,255,255,.95)",border:"none",borderRadius:50,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"var(--shadow)"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div style={{padding:"16px 16px 130px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <h1 style={{fontSize:18,fontWeight:700,flex:1,lineHeight:1.3}}>{l.title}</h1>
          </div>
          <div style={{fontSize:26,fontWeight:700,color:"var(--gold)",marginBottom:10}}>{MAD(l.totalPrice)}{l.priceUnit&&<span style={{fontSize:15,fontWeight:500}}>/{l.priceUnit}</span>}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {l.type==="rent"&&<span className="badge badge-rent">Tool rental</span>}
            {l.type==="sale"&&<span className="badge badge-sale">For sale</span>}
            {l.seller?.isVerified&&<span className="badge badge-verified">✓ Verified Pro</span>}
            {l.views>100&&<span className="badge badge-hot">🔥 {l.views} views</span>}
            <span style={{fontSize:11,color:"var(--text-4)",padding:"3px 0"}}>{l.city}{l.neighborhood?` · ${l.neighborhood}`:""}</span>
          </div>
          {priceSaved&&<InfoBox type="green">Estimated saving vs. market price: approximately <strong>{priceSaved}% below</strong> the Moroccan BTP market average for this product category.</InfoBox>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
            {[{l:"Quantity",v:l.quantity},{l:"Unit price",v:l.unitPrice?`${MAD(l.unitPrice)}${l.type==="rent"?`/${l.priceUnit||"day"}`:""}`:"—"},{l:"Condition",v:l.condition},{l:"Category",v:l.category.charAt(0).toUpperCase()+l.category.slice(1)}].map(i=>(
              <div key={i.l} style={{background:"var(--bg)",borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>{i.l}</div>
                <div style={{fontSize:13,fontWeight:600,marginTop:3}}>{i.v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:16}}><h3 style={{fontSize:14,fontWeight:700,marginBottom:7}}>Description</h3><p style={{fontSize:13,color:"var(--text-2)",lineHeight:1.75}}>{l.description}</p></div>
          <div style={{borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"13px 0",marginBottom:16,display:"flex",alignItems:"center",gap:13}}>
            <Avatar name={l.seller?.fullName} size={46}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700}}>{l.seller?.fullName}</div>
              <div style={{fontSize:12,color:"var(--text-3)"}}>{l.seller?.companyName||l.seller?.businessType} · {l.seller?.city}</div>
              {l.seller?.rating>0&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:8}}><Stars rating={l.seller.rating} count={l.seller.ratingCount}/><span style={{fontSize:11,color:"var(--text-3)"}}>({l.seller.totalTransactions} transactions)</span></div>}
            </div>
            {l.seller?.isVerified&&<div style={{background:"var(--green-bg)",borderRadius:7,padding:"4px 10px",flexShrink:0}}><span style={{fontSize:10,color:"var(--green)",fontWeight:700}}>✓ Verified Pro</span></div>}
          </div>
          <div style={{background:"var(--bg)",borderRadius:10,padding:"10px 13px",display:"flex",gap:8,alignItems:"flex-start",marginBottom:16}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{marginTop:1,flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{fontSize:12,color:"var(--text-3)"}}>Listed {ago(l.createdAt)} · {l.city}{l.neighborhood?`, ${l.neighborhood}`:""} · {l.views} views</span>
          </div>
        </div>
      </div>
      <div style={{padding:"12px 16px 24px",background:"var(--white)",borderTop:"1px solid var(--border)",flexShrink:0}}>
        {mine?<div style={{display:"flex",gap:9}}><button className="btn btn-outline" style={{flex:1}} onClick={()=>nav(`/edit-listing/${id}`)}>Edit listing</button><button className="btn btn-danger" style={{flex:1}} onClick={()=>{listingsAPI.update(id,{available:false}).then(()=>nav("/profile"));}}>Mark as sold</button></div>:(
          <div style={{display:"flex",gap:9}}>
            <button className="btn btn-primary" style={{flex:2}} onClick={()=>nav(`/checkout/${id}`)}>{l.type==="rent"?"Book rental":"Buy now"}</button>
            <button className="btn btn-outline" style={{flex:1}} onClick={()=>nav(`/messages/${l.sellerId}?ref=${id}`)}>Message</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// POST LISTING
// ════════════════════════════════════════════════════════════════
const LISTING_CATS = [
  {id:"tiles",l:"Tiles & Zellige"},{id:"cement",l:"Cement & Concrete"},{id:"bricks",l:"Bricks & Blocks"},{id:"steel",l:"Steel & Iron"},{id:"wood",l:"Wood & Timber"},{id:"tools",l:"Tools & Equipment"},{id:"plumbing",l:"Plumbing & Sanitation"},{id:"electrical",l:"Electrical materials"},{id:"insulation",l:"Insulation & Waterproofing"},{id:"other",l:"Other BTP materials"},
];
export function PostPage() {
  const nav = useNavigate(); const [load, setLoad] = useState(false); const [err, setErr] = useState(""); const [done, setDone] = useState(false);
  const [f, setF] = useState({ type:"sale", category:"tiles", title:"", description:"", quantity:"", unitPrice:"", totalPrice:"", priceUnit:"day", condition:"New, unused", city:"Casablanca", neighborhood:"" });
  const set = k => e => { const v=e.target.value; setF(p=>{ const u={...p,[k]:v}; if((k==="unitPrice"||k==="quantity")&&u.type==="sale"){ const up=parseFloat(u.unitPrice)||0; const qty=parseFloat(u.quantity)||0; if(up&&qty)u.totalPrice=String(Math.round(up*qty)); } return u; }); };
  const go = async () => { if(!f.title||!f.category||!f.totalPrice){setErr("Please fill all required fields");return;} setLoad(true);setErr(""); try { const fd=new FormData(); Object.entries(f).forEach(([k,v])=>v&&fd.append(k,v)); await listingsAPI.create(fd); setDone(true); setTimeout(()=>nav("/profile"),2200); } catch(e){ setErr(e.response?.data?.error||"Failed to publish"); } finally{setLoad(false);} };
  if(done)return<div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1}}><div style={{textAlign:"center",padding:32}}><div style={{width:80,height:80,background:"var(--green-bg)",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div><h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Listing published!</h2><p style={{color:"var(--text-3)",fontSize:14}}>Your listing is now live on ReBuild.</p></div></div>;
  return (
    <div className="app">
      <TopBar title="New listing" subtitle="Sell surplus or rent tools" onBack={()=>nav(-1)}/>
      <div className="scroll" style={{padding:"16px 18px 24px"}}>
        {err&&<div className="err">{err}</div>}
        <div style={{border:"1.5px dashed var(--border-2)",borderRadius:12,padding:"22px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:16,cursor:"pointer",background:"var(--bg)"}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span style={{fontSize:13,color:"var(--text-3)"}}>Add photos (up to 6)</span>
          <span style={{fontSize:11,color:"var(--text-4)"}}>Listings with photos get 3× more views</span>
        </div>
        <div className="field"><label>Listing type *</label>
          <div style={{display:"flex",gap:9}}>
            {[["sale","For sale"],["rent","Rental"]].map(([v,l])=><button key={v} onClick={()=>setF(p=>({...p,type:v}))} style={{flex:1,padding:"11px",borderRadius:9,border:f.type===v?"1.5px solid var(--gold)":"1.5px solid var(--border)",background:f.type===v?"var(--gold-light)":"var(--white)",color:f.type===v?"var(--gold-dark)":"var(--text-3)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
          </div>
        </div>
        <div className="field"><label>Category *</label><select className="input" value={f.category} onChange={set("category")}>{LISTING_CATS.map(c=><option key={c.id} value={c.id}>{c.l}</option>)}</select></div>
        <div className="field"><label>Listing title *</label><input className="input" placeholder='e.g. "Zellige beige 60×60 — 80 m²"' value={f.title} onChange={set("title")}/></div>
        <div className="input-row">
          <div className="field"><label>Quantity</label><input className="input" placeholder='e.g. "80 m²"' value={f.quantity} onChange={set("quantity")}/></div>
          <div className="field"><label>Unit price (MAD)</label><input className="input" type="number" placeholder="60" value={f.unitPrice} onChange={set("unitPrice")}/></div>
        </div>
        <div className="field"><label>Total price (MAD) *</label><input className="input" type="number" placeholder="4800" value={f.totalPrice} onChange={set("totalPrice")}/>
          {f.type==="rent"&&<select className="input" value={f.priceUnit} onChange={set("priceUnit")} style={{marginTop:7}}><option value="day">Per day</option><option value="week">Per week</option><option value="month">Per month</option></select>}
        </div>
        <div className="input-row">
          <div className="field"><label>City *</label><select className="input" value={f.city} onChange={set("city")}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>Neighborhood</label><input className="input" placeholder="Hay Hassani" value={f.neighborhood} onChange={set("neighborhood")}/></div>
        </div>
        <div className="field"><label>Condition</label>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {CONDITIONS.map(c=><button key={c} onClick={()=>setF(p=>({...p,condition:c}))} className={`pill${f.condition===c?" sel":""}`}>{c}</button>)}
          </div>
        </div>
        <div className="field"><label>Full description</label><textarea className="input" placeholder="Describe origin, quantity details, condition, storage, pickup terms, delivery options..." value={f.description} onChange={set("description")} style={{height:110}}/></div>
        <InfoBox type="gold">ICE-verified accounts get <strong>2× more visibility</strong> in search results. Update your ICE in Profile → Edit.</InfoBox>
        <button className="btn btn-primary" onClick={go} disabled={load}>{load?"Publishing...":"Publish listing"}</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// CHECKOUT
// ════════════════════════════════════════════════════════════════
export function CheckoutPage() {
  const { listingId } = useParams(); const nav = useNavigate();
  const [l, setL] = useState(null); const [load, setLoad] = useState(true); const [sub, setSub] = useState(false); const [err, setErr] = useState("");
  const [f, setF] = useState({ deliveryType:"delivery", deliveryAddress:"", deliveryCity:"Casablanca", deliveryDate:"", paymentMethod:"card" });
  useEffect(()=>{ listingsAPI.getOne(listingId).then(r=>setL(r.data)).finally(()=>setLoad(false)); },[listingId]);
  if(load)return<div className="app"><Spinner/></div>;
  if(!l)return null;
  const set = k => e => setF(p=>({...p,[k]:e.target.value}));
  const delivFee = f.deliveryType==="delivery"?(l.totalPrice>10000?500:250):0;
  const platFee = Math.round(l.totalPrice*.06);
  const total = l.totalPrice+delivFee+platFee;
  const go = async () => { if(f.deliveryType==="delivery"&&!f.deliveryAddress){setErr("Enter your delivery address");return;} if(!f.deliveryDate){setErr("Select a delivery date");return;} setSub(true);setErr(""); try { const r=await ordersAPI.create({listingId,...f}); nav(`/order-confirmed/${r.data.order.id}`); } catch(e){ setErr(e.response?.data?.error||"Order failed. Try again."); } finally{setSub(false);} };
  return (
    <div className="app">
      <TopBar title="Checkout" subtitle="Delivery & payment" onBack={()=>nav(-1)}/>
      <div className="scroll" style={{padding:"16px 18px 24px"}}>
        {err&&<div className="err">{err}</div>}
        <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:13}}>
          <CatIcon cat={l.category} size={26}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{l.title}</div><div style={{fontSize:11,color:"var(--text-3)",marginTop:2}}>{l.quantity} · {l.city}</div></div>
          <div style={{fontSize:15,fontWeight:700,color:"var(--gold)",flexShrink:0}}>{MAD(l.totalPrice)}</div>
        </div>
        <div className="sec-lbl">Delivery option</div>
        {[{id:"delivery",label:"Delivery",sub:`Delivered to your site within 2–3 working days (+${l.totalPrice>10000?"500":"250"} MAD)`,icon:<><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>},{id:"pickup",label:"Self-pickup (free)",sub:"Collect directly from the seller. Coordinate pickup via messaging.",icon:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>}].map(o=>(
          <button key={o.id} className={`choice${f.deliveryType===o.id?" sel":""}`} onClick={()=>setF(p=>({...p,deliveryType:o.id}))}>
            <div className="choice-icon" style={{color:f.deliveryType===o.id?"#fff":"var(--text-3)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{o.icon}</svg></div>
            <div><div className="choice-title">{o.label}</div><div className="choice-sub">{o.sub}</div></div>
            <div className="choice-check">{f.deliveryType===o.id&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</div>
          </button>
        ))}
        {f.deliveryType==="delivery"&&<div className="field" style={{marginTop:4}}><label>Delivery address *</label><input className="input" placeholder="Street, neighborhood, city" value={f.deliveryAddress} onChange={set("deliveryAddress")}/></div>}
        <div className="input-row" style={{marginTop:4}}>
          <div className="field"><label>City</label><select className="input" value={f.deliveryCity} onChange={set("deliveryCity")}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="field"><label>{f.deliveryType==="delivery"?"Preferred date *":"Pickup date *"}</label><input className="input" type="date" value={f.deliveryDate} onChange={set("deliveryDate")} min={new Date().toISOString().split("T")[0]}/></div>
        </div>
        <div className="sec-lbl" style={{marginTop:14}}>Payment method</div>
        {[{id:"card",label:"Bank card (CMI secure)",sub:"CIH, Attijariwafa, BMCE — 3D Secure",icon:<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>},{id:"cash",label:"Cash on delivery",sub:"Pay in cash when materials are delivered or at pickup",icon:<><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></>},{id:"virement",label:"Bank transfer (virement)",sub:"Transfer to our escrow account before delivery",icon:<><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>}].map(o=>(
          <button key={o.id} className={`choice${f.paymentMethod===o.id?" sel":""}`} onClick={()=>setF(p=>({...p,paymentMethod:o.id}))}>
            <div className="choice-icon" style={{color:f.paymentMethod===o.id?"#fff":"var(--text-3)"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{o.icon}</svg></div>
            <div><div className="choice-title">{o.label}</div><div className="choice-sub">{o.sub}</div></div>
            <div className="choice-check">{f.paymentMethod===o.id&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}</div>
          </button>
        ))}
        {f.paymentMethod==="card"&&<div style={{background:"var(--bg)",borderRadius:10,padding:14,marginTop:4}}>
          <div className="field"><label>Name on card</label><input className="input" placeholder="KARIM BAKKALI"/></div>
          <div className="field"><label>Card number</label><input className="input" placeholder="0000 0000 0000 0000"/></div>
          <div className="input-row"><div className="field"><label>Expiry</label><input className="input" placeholder="MM/YY"/></div><div className="field"><label>CVV</label><input className="input" placeholder="•••"/></div></div>
        </div>}
        <div style={{background:"var(--bg)",borderRadius:12,padding:"14px",margin:"16px 0"}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Order summary</div>
          {[{l:l.title.slice(0,34)+"…",v:MAD(l.totalPrice)},{l:f.deliveryType==="delivery"?"Delivery fee":"Pickup (free)",v:MAD(delivFee)},{l:"Platform fee (6%)",v:MAD(platFee)}].map(r=><div key={r.l} className="receipt-row"><span className="receipt-lbl">{r.l}</span><span className="receipt-val">{r.v}</span></div>)}
          <div className="receipt-total"><span>Total</span><span style={{color:"var(--gold)"}}>{MAD(total)}</span></div>
        </div>
        <InfoBox type="green"><>Your payment is held in <strong>escrow</strong> and released to the seller only after you confirm delivery. You are fully protected.<br/>Platform fee (6%) covers: payment processing, escrow, buyer protection, and platform costs.</></InfoBox>
        <button className="btn btn-primary" onClick={go} disabled={sub}>{sub?`Processing ${MAD(total)}...`:`Confirm & pay ${MAD(total)}`}</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ORDER CONFIRMATION
// ════════════════════════════════════════════════════════════════
export function OrderConfirmedPage() {
  const { orderId } = useParams(); const nav = useNavigate();
  const [o, setO] = useState(null);
  useEffect(()=>{ ordersAPI.getOne(orderId).then(r=>setO(r.data)); },[orderId]);
  if(!o)return<div className="app"><Spinner/></div>;
  return (
    <div className="app">
      <div style={{overflowY:"auto",flex:1,paddingBottom:24}}>
        <div style={{background:"var(--gold)",padding:"52px 20px 32px",textAlign:"center",flexShrink:0}}>
          <div style={{width:84,height:84,background:"rgba(255,255,255,.25)",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h2 style={{color:"#fff",fontSize:22,fontWeight:700,marginBottom:7}}>Payment confirmed!</h2>
          <p style={{color:"rgba(255,255,255,.85)",fontSize:13,lineHeight:1.6}}>Your order is placed and the seller has been notified by email and in-app notification.</p>
        </div>
        <div style={{padding:"20px 18px"}}>
          <div style={{background:"var(--bg)",borderRadius:14,padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>Order details</div>
            {[{l:"Order ID",v:o.orderId},{l:"Item",v:o.listingTitle},{l:"Seller",v:o.seller?.companyName||o.seller?.fullName},{l:"Delivery type",v:o.deliveryType==="delivery"?"Home delivery":"Self-pickup"},{l:"Delivery city",v:o.deliveryCity},{l:"Scheduled date",v:o.deliveryDate?new Date(o.deliveryDate).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):"To be confirmed"},{l:"Delivery agent",v:o.agentName||"Self-arranged"},{l:"Payment method",v:o.paymentMethod==="card"?"Bank card (CMI)":o.paymentMethod==="cash"?"Cash on delivery":"Bank transfer (virement)"},{l:"Item price",v:MAD(o.itemPrice)},{l:"Delivery fee",v:MAD(o.deliveryFee)},{l:"Platform fee (6%)",v:MAD(o.platformFee)}].map(r=><div key={r.l} className="receipt-row"><span className="receipt-lbl">{r.l}</span><span className="receipt-val" style={{textAlign:"right",maxWidth:"58%"}}>{r.v}</span></div>)}
            <div className="receipt-total"><span>Total paid</span><span style={{color:"var(--gold)"}}>{MAD(o.totalAmount)}</span></div>
          </div>
          <InfoBox type="green"><><strong>Payment protected.</strong> Funds are in escrow. Release to seller happens automatically after you confirm delivery — or after 7 days if you take no action. A delivery agent from <strong>Logis-BTP Express</strong> will contact you 24h before delivery to confirm location and timing.</></InfoBox>
          <InfoBox type="blue">An email receipt has been sent to your registered email address with the full order details and tracking number.</InfoBox>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
            <button className="btn btn-primary" onClick={()=>nav("/orders")}>Track my orders</button>
            <button className="btn btn-outline" onClick={()=>nav(`/messages/${o.sellerId}`)}>Message seller</button>
            <button className="btn btn-ghost" onClick={()=>nav("/home")}>Back to home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════════════
export function OrdersPage() {
  const { user } = useAuth(); const nav = useNavigate();
  const [orders, setOrders] = useState([]); const [load, setLoad] = useState(true); const [tab, setTab] = useState("buying");
  const reload = () => { setLoad(true); ordersAPI.mine().then(r=>setOrders(r.data)).finally(()=>setLoad(false)); };
  useEffect(reload,[]);
  const filtered = orders.filter(o=>tab==="buying"?o.buyerId===user?.id:o.sellerId===user?.id);
  const STATUS = { confirmed:{bg:"var(--blue-bg)",c:"var(--blue)"}, pending:{bg:"#FFF7ED",c:"#C2410C"}, delivered:{bg:"var(--green-bg)",c:"var(--green)"}, cancelled:{bg:"var(--red-bg)",c:"var(--red)"} };
  return (
    <div className="app">
      <div className="topbar"><h1>My orders</h1></div>
      <div style={{display:"flex",borderBottom:"1px solid var(--border)",background:"var(--white)",flexShrink:0}}>
        {["buying","selling"].map(t=><button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"13px",fontSize:13,fontWeight:700,border:"none",background:"none",cursor:"pointer",color:tab===t?"var(--gold)":"var(--text-3)",borderBottom:tab===t?"2.5px solid var(--gold)":"2.5px solid transparent",fontFamily:"inherit"}}>{t==="buying"?"My purchases":"My sales"}</button>)}
      </div>
      <div className="scroll" style={{padding:16}}>
        {load?<Spinner/>:filtered.length===0?<div className="empty"><div className="empty-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><h3>No {tab==="buying"?"purchases":"sales"} yet</h3><p>{tab==="buying"?"Browse listings and make your first purchase":"Post a listing to start selling"}</p><button className="btn btn-outline btn-sm" style={{marginTop:14}} onClick={()=>nav(tab==="buying"?"/home":"/post")}>{tab==="buying"?"Browse listings":"Post listing"}</button></div>:
          filtered.map(o=>{
            const st = STATUS[o.deliveryStatus]||STATUS.pending;
            return (
              <div key={o.id} style={{background:"var(--white)",borderRadius:12,border:"1px solid var(--border)",padding:"13px 14px",marginBottom:10,boxShadow:"var(--shadow)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:600,flex:1,lineHeight:1.3}}>{o.listingTitle}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:st.bg,color:st.c,marginLeft:8,whiteSpace:"nowrap",flexShrink:0}}>{o.deliveryStatus}</span>
                </div>
                <div style={{fontSize:12,color:"var(--text-3)",marginBottom:6}}>{tab==="buying"?`Seller: ${o.seller?.companyName||o.seller?.fullName}`:o.buyer?.fullName} · {o.orderId}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:tab==="selling"&&o.deliveryStatus!=="delivered"?10:0}}>
                  <span style={{fontSize:14,fontWeight:700,color:"var(--gold)"}}>{MAD(tab==="buying"?o.totalAmount:o.sellerPayout)}{tab==="selling"&&<span style={{fontSize:11,fontWeight:500,color:"var(--text-3)"}}> (payout)</span>}</span>
                  <span style={{fontSize:11,color:"var(--text-4)"}}>{ago(o.createdAt)}</span>
                </div>
                {tab==="selling"&&o.deliveryStatus!=="delivered"&&(
                  <button className="btn btn-green" style={{padding:"9px"}} onClick={()=>{ordersAPI.updateStatus(o.id,{deliveryStatus:"delivered"}).then(()=>reload());}}>
                    ✓ Confirm delivery & release payout ({MAD(o.sellerPayout)})
                  </button>
                )}
                {tab==="buying"&&o.deliveryStatus==="delivered"&&<div style={{fontSize:12,color:"var(--green)",fontWeight:600,marginTop:4}}>✓ Delivery confirmed</div>}
              </div>
            );
          })
        }
      </div>
      <BottomNav active="orders"/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════════
export function NotificationsPage() {
  const nav = useNavigate(); const [ns, setNs] = useState([]); const [load, setLoad] = useState(true);
  useEffect(()=>{ notifsAPI.getAll().then(r=>{setNs(r.data);notifsAPI.readAll();}).finally(()=>setLoad(false)); },[]);
  const ICONS = { sale:{bg:"var(--green-bg)",c:"var(--green)",d:<polyline points="20 6 9 17 4 12"/>}, purchase:{bg:"var(--blue-bg)",c:"var(--blue)",d:<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>}, message:{bg:"var(--purple-bg)",c:"var(--purple)",d:<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}, payout:{bg:"var(--gold-light)",c:"var(--gold-dark)",d:<><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></>}, listing_created:{bg:"var(--green-bg)",c:"var(--green)",d:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}, delivered:{bg:"var(--green-bg)",c:"var(--green)",d:<polyline points="20 6 9 17 4 12"/>} };
  return (
    <div className="app">
      <TopBar title="Notifications" onBack={()=>nav(-1)}/>
      <div className="scroll" style={{padding:16}}>
        {load?<Spinner/>:ns.length===0?<div className="empty"><div className="empty-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div><h3>No notifications</h3><p>You're all caught up!</p></div>:
          ns.map(n=>{const ic=ICONS[n.type]||ICONS.message; return(
            <div key={n.id} style={{background:n.read?"var(--white)":"var(--gold-pale)",borderRadius:12,border:`1px solid ${n.read?"var(--border)":"#EFB84A"}`,padding:"12px 14px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:36,height:36,borderRadius:50,background:ic.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ic.c} strokeWidth="2">{ic.d}</svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{n.title}</div>
                <p style={{fontSize:12,color:"var(--text-2)",lineHeight:1.55}}>{n.message}</p>
                <p style={{fontSize:10,color:"var(--text-4)",marginTop:5}}>{ago(n.createdAt)}</p>
              </div>
              {!n.read&&<div style={{width:8,height:8,borderRadius:50,background:"var(--gold)",marginTop:4,flexShrink:0}}/>}
            </div>
          );})}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MESSAGES
// ════════════════════════════════════════════════════════════════
export function MessagesPage() {
  const nav = useNavigate(); const [convs, setConvs] = useState([]); const [load, setLoad] = useState(true);
  useEffect(()=>{ msgAPI.convs().then(r=>setConvs(r.data)).catch(()=>{}).finally(()=>setLoad(false)); },[]);
  return (
    <div className="app">
      <div className="topbar"><h1>Messages</h1></div>
      <div className="scroll">
        {load?<Spinner/>:convs.length===0?<div className="empty"><div className="empty-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><h3>No conversations</h3><p>Message a seller to start a conversation</p></div>:
          convs.map(c=>(
            <div key={c.otherId} onClick={()=>nav(`/messages/${c.otherId}`)} style={{display:"flex",alignItems:"center",gap:13,padding:"14px 16px",borderBottom:"1px solid var(--border)",cursor:"pointer",background:c.unread>0?"var(--gold-pale)":"var(--white)"}}>
              <Avatar name={c.other?.fullName} size={46}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:14,fontWeight:c.unread>0?700:500}}>{c.other?.fullName}</span>
                  <span style={{fontSize:10,color:"var(--text-4)"}}>{ago(c.lastMsg.createdAt)}</span>
                </div>
                <div style={{fontSize:12,color:"var(--text-3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg.content}</div>
                <div style={{fontSize:10,color:"var(--text-4)",marginTop:2}}>{c.other?.companyName||c.other?.city}</div>
              </div>
              {c.unread>0&&<div style={{width:20,height:20,background:"var(--gold)",borderRadius:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700,flexShrink:0}}>{c.unread}</div>}
            </div>
          ))}
      </div>
      <BottomNav active="messages"/>
    </div>
  );
}

export function ChatPage() {
  const { userId } = useParams(); const nav = useNavigate(); const { user } = useAuth();
  const [msgs, setMsgs] = useState([]); const [other, setOther] = useState(null); const [text, setText] = useState(""); const [load, setLoad] = useState(true);
  const bottom = useRef(null);
  useEffect(()=>{ msgAPI.thread(userId).then(r=>setMsgs(r.data)); fetch(`http://localhost:4000/api/users/${userId}`).then(r=>r.json()).then(setOther).finally(()=>setLoad(false)); },[userId]);
  useEffect(()=>{ bottom.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send = async () => { if(!text.trim())return; const r=await msgAPI.send({receiverId:userId,content:text}); setMsgs(p=>[...p,r.data]); setText(""); };
  return (
    <div className="app">
      <div className="topbar-simple" style={{flexShrink:0}}>
        <button className="topbar-back" onClick={()=>nav(-1)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>
        <Avatar name={other?.fullName} size={34}/>
        <div style={{flex:1}}><div className="topbar-title">{other?.fullName}</div><div style={{fontSize:10,color:"rgba(255,255,255,.8)",marginTop:1}}>{other?.companyName||other?.city}</div></div>
      </div>
      <div className="scroll" style={{padding:"12px 14px",background:"var(--bg)"}}>
        {load?<Spinner/>:msgs.length===0?<div style={{textAlign:"center",padding:"32px 0",color:"var(--text-3)",fontSize:13}}>Start the conversation</div>:
          msgs.map(m=>{const mine=m.senderId===user?.id; return(
            <div key={m.id} style={{display:"flex",justifyContent:mine?"flex-end":"flex-start",marginBottom:10,gap:8}}>
              {!mine&&<Avatar name={other?.fullName} size={28} style={{marginTop:2,flexShrink:0}}/>}
              <div style={{maxWidth:"72%",background:mine?"var(--gold)":"var(--white)",color:mine?"#fff":"var(--text)",borderRadius:mine?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 13px",fontSize:13,lineHeight:1.5,border:mine?"none":"1px solid var(--border)"}}>
                {m.content}
                <div style={{fontSize:10,opacity:.7,marginTop:4,textAlign:"right"}}>{ago(m.createdAt)}</div>
              </div>
            </div>
          );})}
        <div ref={bottom}/>
      </div>
      <div style={{padding:"10px 14px 20px",background:"var(--white)",borderTop:"1px solid var(--border)",display:"flex",gap:10,flexShrink:0}}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Write a message..." style={{flex:1,border:"1.5px solid var(--border)",borderRadius:22,padding:"10px 16px",fontSize:14,outline:"none",fontFamily:"inherit",transition:"border-color .15s"}} onFocus={e=>e.target.style.borderColor="var(--gold)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
        <button onClick={send} style={{width:44,height:44,background:"var(--gold)",borderRadius:50,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PROFILE
// ════════════════════════════════════════════════════════════════
export function ProfilePage() {
  const { user, logout, setUser } = useAuth(); const nav = useNavigate();
  const [stats, setStats] = useState(null); const [myListings, setMyListings] = useState([]); const [editing, setEditing] = useState(false); const [saving, setSaving] = useState(false); const [f, setF] = useState({});
  useEffect(()=>{ if(!user)return; statsAPI.mine().then(r=>setStats(r.data)).catch(()=>{}); listingsAPI.getMine().then(r=>setMyListings(r.data)).catch(()=>{}); setF({fullName:user.fullName,phone:user.phone,city:user.city,neighborhood:user.neighborhood||"",companyName:user.companyName||"",businessType:user.businessType,ice:user.ice||"",yearsInBusiness:user.yearsInBusiness||"",bio:user.bio||""}); },[user]);
  const save = async ()=>{ setSaving(true); try{const r=await authAPI.profile(f);setUser(r.data);setEditing(false);}finally{setSaving(false);} };
  if(!user)return<div className="app"><Spinner/></div>;
  return (
    <div className="app">
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{background:"var(--gold)",padding:"48px 16px 24px",textAlign:"center",flexShrink:0}}>
          <div style={{width:76,height:76,borderRadius:50,background:"rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:28,fontWeight:700,color:"#fff"}}>{user.fullName?.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
          <h2 style={{color:"#fff",fontSize:18,fontWeight:700}}>{user.fullName}</h2>
          <p style={{color:"rgba(255,255,255,.85)",fontSize:12,marginTop:3}}>{user.companyName||user.businessType} · {user.city}</p>
          {user.isVerified&&<div style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.2)",borderRadius:20,padding:"4px 14px",marginTop:9}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg><span style={{fontSize:11,color:"#fff",fontWeight:700}}>Verified Pro</span></div>}
          {stats&&<div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,.3)",marginTop:14,paddingTop:14}}>
            {[{v:stats.activeListings,l:"Active listings"},{v:stats.totalSales,l:"Sales"},{v:stats.totalPurchases,l:"Purchases"}].map(s=><div key={s.l} style={{flex:1,textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#fff"}}>{s.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.75)",marginTop:2}}>{s.l}</div></div>)}
          </div>}
        </div>
        <div style={{padding:"16px 18px 24px"}}>
          {!editing?<>
            {[{l:"Email",v:user.email},{l:"Phone",v:user.phone||"—"},{l:"City & neighborhood",v:`${user.city}${user.neighborhood?`, ${user.neighborhood}`:""}`},{l:"Business type",v:user.businessType},{l:"ICE number",v:user.ice||"Not provided — add to get Verified Pro badge"},{l:"Years in business",v:user.yearsInBusiness||"—"},{l:"Bio",v:user.bio||"—"}].map(r=>(
              <div key={r.l} style={{padding:"11px 0",borderBottom:"1px solid var(--border)"}}><div style={{fontSize:11,color:"var(--text-3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".04em"}}>{r.l}</div><div style={{fontSize:13,color:"var(--text)",marginTop:3,lineHeight:1.5}}>{r.v}</div></div>
            ))}
            <button className="btn btn-ghost" style={{marginTop:18}} onClick={()=>setEditing(true)}>Edit profile</button>
            {myListings.length>0&&<>
              <div style={{fontSize:12,fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".05em",marginTop:22,marginBottom:10}}>My listings ({myListings.length})</div>
              {myListings.map(l=>(
                <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>nav(`/listing/${l.id}`)}>
                  <div><div style={{fontSize:13,fontWeight:500}}>{l.title.slice(0,40)}</div><div style={{fontSize:11,color:"var(--text-3)"}}>{l.city} · {l.available?"Active":"Sold"}</div></div>
                  <div style={{textAlign:"right"}}><span style={{fontSize:13,fontWeight:700,color:"var(--gold)"}}>{MAD(l.totalPrice)}</span></div>
                </div>
              ))}
            </>}
            {stats&&stats.totalRevenue>0&&<div style={{background:"var(--green-bg)",borderRadius:12,padding:"13px 14px",marginTop:16}}><div style={{fontSize:12,color:"var(--green)",fontWeight:700,marginBottom:4}}>💰 Total earnings</div><div style={{fontSize:22,fontWeight:700,color:"var(--green)"}}>{MAD(stats.totalRevenue)}</div><div style={{fontSize:11,color:"var(--green)",marginTop:2}}>After platform fees</div></div>}
            <button className="btn btn-danger" style={{marginTop:20}} onClick={()=>{logout();nav("/login");}}>Sign out</button>
          </>:<>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:18}}>Edit profile</h3>
            <div className="field"><label>Full name</label><input className="input" value={f.fullName} onChange={e=>setF(p=>({...p,fullName:e.target.value}))}/></div>
            <div className="field"><label>Phone</label><input className="input" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div>
            <div className="input-row"><div className="field"><label>City</label><select className="input" value={f.city} onChange={e=>setF(p=>({...p,city:e.target.value}))}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div><div className="field"><label>Neighborhood</label><input className="input" value={f.neighborhood} onChange={e=>setF(p=>({...p,neighborhood:e.target.value}))}/></div></div>
            <div className="field"><label>Company name</label><input className="input" value={f.companyName} onChange={e=>setF(p=>({...p,companyName:e.target.value}))}/></div>
            <div className="field"><label>Business type</label><select className="input" value={f.businessType} onChange={e=>setF(p=>({...p,businessType:e.target.value}))}>{BIZ_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="field"><label>ICE number (for Verified Pro badge)</label><input className="input" placeholder="001 234 567 000 58" value={f.ice} onChange={e=>setF(p=>({...p,ice:e.target.value}))}/></div>
            <div className="field"><label>Bio</label><textarea className="input" value={f.bio} onChange={e=>setF(p=>({...p,bio:e.target.value}))} placeholder="Describe your business..."/></div>
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button className="btn btn-outline" style={{flex:1}} onClick={()=>setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={save} disabled={saving}>{saving?"Saving...":"Save changes"}</button>
            </div>
          </>}
        </div>
      </div>
      <BottomNav active="profile"/>
    </div>
  );
}
