import{d,u as _,a as h,c as m,b as u,r as p,o as a,e as n,f as e,t as o,g as r,F as f,h as g,n as v,i as b,j as x,k as y,l as k,m as N,_ as w}from"./index-C5IRY5Kt.js";import{N as P}from"./NoteDisplay-B4oIELs3.js";const V={class:"m-4"},L={class:"mb-10"},S={class:"text-4xl font-bold mt-2"},T={class:"opacity-50"},j={class:"text-lg"},z={class:"font-bold flex gap-2"},B={class:"opacity-50"},D=e("div",{class:"flex-auto"},null,-1),H={key:0,class:"border-gray-400/50 mb-8"},C=d({__name:"PresenterPrint",setup(F){_(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),h({title:`Notes - ${m.title}`});const i=u(()=>p.map(s=>{var l;return(l=s.meta)==null?void 0:l.slide}).filter(s=>s!==void 0&&s.noteHTML!==""));return(s,l)=>(a(),n("div",{id:"page-root",style:v(r(b))},[e("div",V,[e("div",L,[e("h1",S,o(r(m).title),1),e("div",T,o(new Date().toLocaleString()),1)]),(a(!0),n(f,null,g(i.value,(t,c)=>(a(),n("div",{key:c,class:"flex flex-col gap-4 break-inside-avoid-page"},[e("div",null,[e("h2",j,[e("div",z,[e("div",B,o(t==null?void 0:t.no)+"/"+o(r(x)),1),y(" "+o(t==null?void 0:t.title)+" ",1),D])]),k(P,{"note-html":t.noteHTML,class:"max-w-full"},null,8,["note-html"])]),c<i.value.length-1?(a(),n("hr",H)):N("v-if",!0)]))),128))])],4))}}),A=w(C,[["__file","/home/runner/work/mermaid-slides/mermaid-slides/node_modules/.pnpm/@slidev+client@0.47.5_snahdbb47e7yhhguzajdnrqce4/node_modules/@slidev/client/internals/PresenterPrint.vue"]]);export{A as default};
