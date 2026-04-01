import React from "react";
export const MAD = n => `${Number(n).toLocaleString("fr-MA")} MAD`;
export const ago = d => { const s = Math.floor((Date.now()-new Date(d))/1000); if(s<60)return"Just now"; if(s<3600)return`${Math.floor(s/60)}m ago`; if(s<86400)return`${Math.floor(s/3600)}h ago`; return`${Math.floor(s/86400)}d ago`; };
export const CITIES = ["Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir","Meknès","Oujda","Kénitra","Tétouan","Safi","El Jadida","Mohammedia"];
export const BIZ_TYPES = ["General contractor","Renovation professional","Real estate developer","Architecture firm","Tiling specialist","Electrician","Plumber","Carpentry & wood","Civil engineer","Individual homeowner","Other"];
export const CONDITIONS = ["New, unused","Like new","Good condition","Fair condition"];
export const CATS = [ { id:"all",label:"All" }, { id:"tiles",label:"Tiles" }, { id:"cement",label:"Cement" }, { id:"bricks",label:"Bricks" }, { id:"steel",label:"Steel" }, { id:"wood",label:"Wood" }, { id:"tools",label:"Tools" }, { id:"plumbing",label:"Plumbing" }, { id:"electrical",label:"Electrical" } ];

export function Spinner() { return <div className="loading"><div className="spin" /></div>; }

export function Avatar({ name, size = 38, style = {} }) {
  const init = name ? name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "?";
  return <div className="av" style={{ width:size, height:size, fontSize:size*.36, ...style }}>{init}</div>;
}

export function Stars({ rating, count }) {
  return <div className="stars">{[1,2,3,4,5].map(s=><svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s<=Math.round(rating)?"#B8720A":"#E5E3DC"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}<span style={{fontSize:11,color:"#6B7280",marginLeft:3}}>{Number(rating||0).toFixed(1)}{count!==undefined&&` (${count})`}</span></div>;
}

export function CatIcon({ cat, size=32 }) {
  const map = {
    tiles:{ bg:"#F1EFE8", s:"#888780", d:<><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"></rect></> },
    cement:{ bg:"#F1EFE8", s:"#888780", d:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
    bricks:{ bg:"#FAECE7", s:"#993C1D", d:<><rect x="1" y="7" width="22" height="4" rx="1"/><rect x="1" y="13" width="22" height="4" rx="1"/><rect x="5" y="3" width="6" height="4" rx="1"/><rect x="13" y="17" width="6" height="4" rx="1"/></> },
    steel:{ bg:"#DBEAFE", s:"#1D4ED8", d:<><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></> },
    wood:{ bg:"#EAF3DE", s:"#3B6D11", d:<><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></> },
    tools:{ bg:"#EDE9FE", s:"#7C3AED", d:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> },
    plumbing:{ bg:"#DBEAFE", s:"#1D4ED8", d:<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></> },
    electrical:{ bg:"#FEF3E2", s:"#B8720A", d:<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></> },
  };
  const ic = map[cat] || map.cement;
  return <div style={{ width:size+18, height:size+18, background:ic.bg, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={ic.s} strokeWidth="1.8">{ic.d}</svg></div>;
}

export function InfoBox({ type="gold", icon, children }) {
  return <div className={`info-box ${type}`}>{icon||<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}<p>{children}</p></div>;
}

export function TopBar({ title, subtitle, onBack, right }) {
  return <div className="topbar-simple">{onBack&&<button className="topbar-back" onClick={onBack}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>}<div style={{flex:1}}><div className="topbar-title">{title}</div>{subtitle&&<div style={{fontSize:11,color:"rgba(255,255,255,.8)",marginTop:1}}>{subtitle}</div>}</div>{right&&<div>{right}</div>}</div>;
}

export function SectionLabel({ children, right }) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span className="sec-lbl">{children}</span>{right}</div>;
}
