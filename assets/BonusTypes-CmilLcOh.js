import{r as i,j as e,C as K}from"./index-CeiCU0zs.js";import{a as f}from"./apiService-C4XhZ6hP.js";import"./DropdownSearch-LviYzHFQ.js";import{C as Q,a as y}from"./CRow-BOTpF-Qu.js";import{C as F,a as w}from"./CCardBody-DaHs3ufB.js";import{C as V}from"./CCardHeader-C4z8y5CD.js";import{a as u}from"./index.es-DuVix-BO.js";import{C as W}from"./CAlert-DouU5QuH.js";import{C as X,a as Y,b as E,c,d as Z,e as m}from"./CTable-BLphWcap.js";import{C as ee,a as T}from"./CPaginationItem-BOfQJ9Hh.js";import{C as M,a as P,b as k,c as D,d as O}from"./CModalTitle-BwbNuXqt.js";import{C as N}from"./CForm-2JjP1Tdm.js";import{C as p}from"./CFormLabel-CbwYzW-9.js";import{C as h}from"./CFormInput-CU_BxwIi.js";import"./CCloseButton-CkZ_HPXF.js";import"./DefaultLayout-DQ356eyJ.js";import"./cil-user-Dlmw-Gem.js";import"./CFormControlWrapper-1foQ7KjH.js";import"./CFormControlValidation-CaJ4I8JF.js";const ye=()=>{const[H,_]=i.useState([]),[r,g]=i.useState(1),[b,I]=i.useState(1),[R,t]=i.useState(!1),[z,j]=i.useState(!1),[L,x]=i.useState(!1),[n,v]=i.useState({id:"",name:"",code:"",amount:"",description:""}),[S,B]=i.useState(null);i.useState(),i.useEffect(()=>{C(r)},[r]);const d=s=>{B(s)},U=()=>{B(null)},C=async s=>{t(!0);try{const o=await f("POST",`listBonusTypes?page=${s}`,{});if(!o.success){const a=Object.values(o.message).flat().join(", ");d(a);return}_(o.data.data||[]),I(o.data.last_page||1)}catch(o){console.error("Error fetching categories:",o),d(o.message)}finally{t(!1)}},$=async()=>{const s=new FormData;n.name&&s.append("name",n.name),n.code&&s.append("code",n.code),n.amount&&s.append("amount",n.amount),n.description&&s.append("description",n.description),t(!0);try{const o=await f("POST","addBonusType",s);if(!o.success){const a=Object.values(o.message).flat().join(", ");d(a);return}j(!1),C(r)}catch(o){console.error("Error adding bonus type:",o),d(o.message)}finally{t(!1)}},q=async()=>{const s=new FormData;n.id&&s.append("id",n.id),n.name&&s.append("name",n.name),n.code&&s.append("code",n.code),n.amount&&s.append("amount",n.amount),n.description&&s.append("description",n.description),t(!0);try{const o=await f("POST","updateBonusType",s);if(!o.success){const a=Object.values(o.message).flat().join(", ");d(a);return}x(!1),C(r)}catch(o){console.error("Error updating Bonus Type:",o),d(o.message)}finally{t(!1)}},G=async s=>{t(!0);try{const o=await f("POST","deleteBonusType",{id:s});if(!o.success){const a=Object.values(o.message).flat().join(", ");d(a);return}C(r)}catch(o){console.error("Error deleting Bonus Type:",o),d(o.message)}finally{t(!1)}},J=s=>{v({id:s.id,name:s.name,code:s.code,amount:s.amount,description:s.description}),x(!0)},l=s=>{const{name:o,value:a}=s.target;v(A=>(console.log(a),a==2?{...A,[o]:""}:{...A,[o]:a}))};return e.jsxs(Q,{children:[e.jsx(y,{xs:12,children:e.jsxs(F,{className:"mb-4",children:[e.jsx(V,{children:e.jsxs(y,{xs:12,children:[e.jsx(F,{className:"mb-4",children:e.jsx(w,{children:e.jsx(y,{xs:"auto",children:e.jsx(u,{color:"primary",onClick:()=>j(!0),children:"Add"})})})}),S&&e.jsx(W,{color:"danger",onClose:U,dismissible:!0,children:S})]})}),e.jsx(w,{children:R?e.jsx(K,{color:"primary"}):e.jsxs(e.Fragment,{children:[e.jsxs(X,{children:[e.jsx(Y,{children:e.jsxs(E,{children:[e.jsx(c,{scope:"col",children:"#"}),e.jsx(c,{scope:"col",children:"Name"}),e.jsx(c,{scope:"col",children:"Code"}),e.jsx(c,{scope:"col",children:"Amount"}),e.jsx(c,{scope:"col",children:"Description"}),e.jsx(c,{scope:"col",children:"Created At"}),e.jsx(c,{scope:"col",children:"Updated At"}),e.jsx(c,{scope:"col",children:"Actions"})]})}),e.jsx(Z,{children:H.map((s,o)=>e.jsxs(E,{children:[e.jsx(m,{children:o+1}),e.jsx(m,{children:s.name}),e.jsx(m,{children:s.code}),e.jsx(m,{children:s.amount}),e.jsx(m,{children:s.description}),e.jsx(m,{children:s.created_at}),e.jsx(m,{children:s.updated_at}),e.jsxs(m,{children:[e.jsx(u,{color:"warning",size:"sm",onClick:()=>J(s),children:"Edit"})," ",e.jsx(u,{color:"danger",size:"sm",onClick:()=>G(s.id),children:"Delete"})]})]},s.id))})]}),e.jsxs(ee,{children:[e.jsx(T,{disabled:r<=1,onClick:()=>g(r-1),children:"Previous"}),Array.from({length:b},(s,o)=>e.jsx(T,{active:o+1===r,onClick:()=>g(o+1),children:o+1},o)),e.jsx(T,{disabled:r>=b,onClick:()=>g(r+1),children:"Next"})]})]})})]})}),e.jsxs(M,{visible:z,onClose:()=>j(!1),children:[e.jsx(P,{onClose:()=>j(!1),children:e.jsx(k,{children:"Add Bonus Type"})}),e.jsx(D,{children:e.jsxs(N,{children:[e.jsx(p,{htmlFor:"name",children:"Name"}),e.jsx(h,{id:"name",name:"name",value:n.name,onChange:l}),e.jsx(p,{htmlFor:"code",children:"Code"}),e.jsx(h,{id:"code",name:"code",value:n.code,onChange:l}),e.jsx(p,{htmlFor:"amount",children:"Amount"}),e.jsx(h,{id:"amount",name:"amount",value:n.amount,onChange:l}),e.jsx(p,{htmlFor:"description",children:"Description"}),e.jsx(h,{id:"description",name:"description",value:n.description,onChange:l})]})}),e.jsxs(O,{children:[e.jsx(u,{color:"secondary",onClick:()=>j(!1),children:"Close"}),e.jsx(u,{color:"primary",onClick:$,children:"Add"})]})]}),e.jsxs(M,{visible:L,onClose:()=>x(!1),children:[e.jsx(P,{onClose:()=>x(!1),children:e.jsx(k,{children:"Edit Category"})}),e.jsx(D,{children:e.jsxs(N,{children:[e.jsx(p,{htmlFor:"name",children:"Name"}),e.jsx(h,{id:"name",name:"name",value:n.name,onChange:l}),e.jsx(p,{htmlFor:"code",children:"Code"}),e.jsx(h,{id:"code",name:"code",value:n.code,onChange:l}),e.jsx(p,{htmlFor:"amount",children:"Amount"}),e.jsx(h,{id:"amount",name:"amount",value:n.amount,onChange:l}),e.jsx(p,{htmlFor:"description",children:"Description"}),e.jsx(h,{id:"description",name:"description",value:n.description,onChange:l})]})}),e.jsxs(O,{children:[e.jsx(u,{color:"secondary",onClick:()=>x(!1),children:"Close"}),e.jsx(u,{color:"primary",onClick:q,children:"Save Changes"})]})]})]})};export{ye as default};