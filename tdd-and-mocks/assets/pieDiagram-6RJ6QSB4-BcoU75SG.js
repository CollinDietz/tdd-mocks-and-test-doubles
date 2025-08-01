import{p as N}from"./chunk-K2ZEYYM2-BLLj_H6x.js";import{p as B}from"./treemap-75Q7IDZK-SV5UZEO6-DD5x5fdI.js";import{a as i,g as U,s as H,b as K,c as Q,x as V,v as Z,l as C,d as j,H as q,aO as J,aQ as X,aR as z,aS as Y,f as ee,B as te,aT as ae,K as re}from"./Mermaid.vue_vue_type_script_setup_true_lang-BJ2vTx9F.js";import"./chunk-TGZYFRKZ-CbUIgpVr.js";import"./index-UpKHkio-.js";import"./modules/vue-yEidkMur.js";import"./modules/shiki-DTuP-x8k.js";import"./modules/file-saver-C8BEGaqa.js";var ie=re.pie,D={sections:new Map,showData:!1},h=D.sections,w=D.showData,se=structuredClone(ie),oe=i(()=>structuredClone(se),"getConfig"),ne=i(()=>{h=new Map,w=D.showData,te()},"clear"),le=i(({label:e,value:t})=>{h.has(e)||(h.set(e,t),C.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),ce=i(()=>h,"getSections"),de=i(e=>{w=e},"setShowData"),pe=i(()=>w,"getShowData"),F={getConfig:oe,clear:ne,setDiagramTitle:Z,getDiagramTitle:V,setAccTitle:Q,getAccTitle:K,setAccDescription:H,getAccDescription:U,addSection:le,getSections:ce,setShowData:de,getShowData:pe},ge=i((e,t)=>{N(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),ue={parse:i(async e=>{const t=await B("pie",e);C.debug(t),ge(t,F)},"parse")},fe=i(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),he=fe,me=i(e=>{const t=[...e.entries()].map(s=>({label:s[0],value:s[1]})).sort((s,n)=>n.value-s.value);return ae().value(s=>s.value)(t)},"createPieArcs"),Se=i((e,t,G,s)=>{C.debug(`rendering pie chart
`+e);const n=s.db,y=j(),T=q(n.getConfig(),y.pie),$=40,o=18,p=4,c=450,m=c,S=J(t),l=S.append("g");l.attr("transform","translate("+m/2+","+c/2+")");const{themeVariables:a}=y;let[A]=X(a.pieOuterStrokeWidth);A??=2;const _=T.textPosition,g=Math.min(m,c)/2-$,O=z().innerRadius(0).outerRadius(g),R=z().innerRadius(g*_).outerRadius(g*_);l.append("circle").attr("cx",0).attr("cy",0).attr("r",g+A/2).attr("class","pieOuterCircle");const b=n.getSections(),v=me(b),W=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12],d=Y(W);l.selectAll("mySlices").data(v).enter().append("path").attr("d",O).attr("fill",r=>d(r.data.label)).attr("class","pieCircle");let E=0;b.forEach(r=>{E+=r}),l.selectAll("mySlices").data(v).enter().append("text").text(r=>(r.data.value/E*100).toFixed(0)+"%").attr("transform",r=>"translate("+R.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),l.append("text").text(n.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const x=l.selectAll(".legend").data(d.domain()).enter().append("g").attr("class","legend").attr("transform",(r,u)=>{const f=o+p,P=f*d.domain().length/2,I=12*o,L=u*f-P;return"translate("+I+","+L+")"});x.append("rect").attr("width",o).attr("height",o).style("fill",d).style("stroke",d),x.data(v).append("text").attr("x",o+p).attr("y",o-p).text(r=>{const{label:u,value:f}=r.data;return n.getShowData()?`${u} [${f}]`:u});const M=Math.max(...x.selectAll("text").nodes().map(r=>r?.getBoundingClientRect().width??0)),k=m+$+o+p+M;S.attr("viewBox",`0 0 ${k} ${c}`),ee(S,c,k,T.useMaxWidth)},"draw"),ve={draw:Se},_e={parser:ue,db:F,renderer:ve,styles:he};export{_e as diagram};
