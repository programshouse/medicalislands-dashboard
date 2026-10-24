import React, { useId } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ page = 1, pageSize = 10, total = 0, onPageChange, onPageSizeChange, position = "bottom" }) {
  const selectId = useId();
  const safeSize = Math.max(1, Number(pageSize) || 10);
  const pages = Math.max(1, Math.ceil(total / safeSize));
  const current = Math.min(Math.max(1, Number(page) || 1), pages);
  if (position === "top") {
    return (
      <div className="flex w-full items-center justify-end gap-2 px-4 py-3 sm:px-6">
        <label htmlFor={selectId} className="text-sm font-medium text-slate-600">Showing</label>
        <select id={selectId} aria-label="Entries per page" value={safeSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="h-9 min-w-[76px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-[#173f68] focus:ring-2 focus:ring-blue-100">
          {[10,20,50,100].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
        <span className="text-sm text-slate-500">entries</span>
      </div>
    );
  }
  const start = total > 0 ? (current - 1) * safeSize + 1 : 0;
  const end = Math.min(current * safeSize, total);
  const visible = [...new Set([1, pages, current-1, current, current+1])].filter(n=>n>=1 && n<=pages).sort((a,b)=>a-b);
  const numbers = visible.reduce((result,n,i)=>{if(i && n-visible[i-1]>1) result.push(n-visible[i-1]===2?visible[i-1]+1:'...');result.push(n);return result;},[]);
  const change = (n) => {if(n>=1 && n<=pages && n!==current) onPageChange?.(n);};
  const btn = "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-35";
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span className="text-center text-sm text-slate-500 sm:text-left">Showing <strong className="text-slate-800">{start}–{end}</strong> of <strong className="text-slate-800">{total}</strong> entries</span>
      {pages>1 && <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
        <button type="button" aria-label="First page" disabled={current===1} onClick={()=>change(1)} className={btn}><ChevronsLeft size={16}/></button>
        <button type="button" aria-label="Previous page" disabled={current===1} onClick={()=>change(current-1)} className={btn}><ChevronLeft size={16}/></button>
        {numbers.map((n,i)=>n==='...'?<span key={`dots-${i}`} className="flex h-9 w-7 items-center justify-center text-slate-400">…</span>:<button key={n} type="button" aria-label={`Page ${n}`} aria-current={n===current?'page':undefined} onClick={()=>change(n)} className={`${btn} ${n===current?'!border-[#173f68] !bg-[#173f68] !text-white':''}`}>{n}</button>)}
        <button type="button" aria-label="Next page" disabled={current===pages} onClick={()=>change(current+1)} className={btn}><ChevronRight size={16}/></button>
        <button type="button" aria-label="Last page" disabled={current===pages} onClick={()=>change(pages)} className={btn}><ChevronsRight size={16}/></button>
      </nav>}
    </div>
  );
}
