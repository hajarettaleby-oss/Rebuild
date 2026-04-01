import React from "react";
import { useNavigate } from "react-router-dom";
const IC = ({ d, fill }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={fill||"none"} stroke="currentColor" strokeWidth="2">{d}</svg>;
export default function BottomNav({ active }) {
  const nav = useNavigate();
  const tabs = [
    { id:"home", path:"/home", label:"Home", d:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
    { id:"browse", path:"/browse", label:"Browse", d:<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></> },
    { id:"post", path:"/post", label:"Post", fab:true },
    { id:"orders", path:"/orders", label:"Orders", d:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
    { id:"profile", path:"/profile", label:"Profile", d:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  ];
  return (
    <div className="bnav">
      {tabs.map(t => t.fab ? (
        <button key="post" className="bnav-tab" onClick={() => nav("/post")}>
          <div className="bnav-fab"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
          <span style={{color:active==="post"?"var(--gold)":"var(--text-4)"}}>Post</span>
        </button>
      ) : (
        <button key={t.id} className={`bnav-tab ${active===t.id?"active":""}`} onClick={() => nav(t.path)}>
          <IC d={t.d} /><span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
