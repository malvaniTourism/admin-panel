import{r as n,j as e,C as P}from"./index-VJ3WgKSh.js";import{a as _}from"./apiService-CXN-QJi0.js";import{D as C}from"./DropdownSearch-DeEYKyzG.js";import{C as v,a as l}from"./CRow-PCGzrUN3.js";import{C as g,a as u}from"./CCardBody--TxWnu0_.js";import{C as F}from"./CCardHeader-BRZ2UYVm.js";import{C as I}from"./CForm-BaxACZCL.js";import{C as k}from"./CFormLabel-Bx7nyDAR.js";import{C as E}from"./CFormInput-Ba0tVn8q.js";import{a as L}from"./index.es-DqjKMj31.js";import{C as H,a as B,b as f,c as a,d as R,e as o}from"./CTable-BumLcFF_.js";import{C as z,a as m}from"./CPaginationItem-DrePgupq.js";import"./CFormControlWrapper-BTg1Nxrf.js";import"./CFormControlValidation-Da6TrRma.js";const Z=()=>{const[y,S]=n.useState([]),[c,i]=n.useState(1),[d,b]=n.useState(1),[w,p]=n.useState(!1),[x,j]=n.useState({id:"",name:"",parent_id:""});n.useEffect(()=>{D(c)},[c]);const D=async s=>{const t=localStorage.getItem("token"),h=new FormData;h.append("apitype","list"),h.append("category","city"),p(!0),console.log(t,"Token");try{const r=await _("POST",`sites?page=${s}`,h);if(r.success==!1){showAlert((r==null?void 0:r.message)||"Something went wrong");return}if(r&&r.data)S(r.data.data||[]),b(r.data.last_page||1);else throw new Error("Invalid data structure")}catch(r){console.error("Error fetching sites:",r)}finally{p(!1)}},T=s=>{console.log(s),j({...x,category:s})},N=s=>{console.log(s),j({...x,category:s})};return e.jsx(v,{children:e.jsx(l,{xs:12,children:e.jsxs(g,{className:"mb-4",children:[e.jsx(F,{children:e.jsx(l,{xs:12,children:e.jsx(g,{className:"mb-4",children:e.jsx(u,{children:e.jsxs(I,{className:"row gx-3 gy-2 align-items-center",onSubmit:s=>{s.preventDefault(),handleSearch()},children:[e.jsxs(l,{sm:3,children:[e.jsx(k,{className:"visually-hidden",htmlFor:"specificSizeInputName",children:"Name"}),e.jsx(E,{id:"specificSizeInputName",placeholder:"Jane Doe"})]}),e.jsx(l,{sm:3,children:e.jsx(C,{onChange:T,endpoint:"sites",label:"Cities",filter:[{category:"city"}]})}),e.jsx(l,{sm:3,children:e.jsx(C,{onChange:N,endpoint:"listcategories",label:"Categories",filter:[{}],valueKey:"code"})}),e.jsx(l,{xs:"auto",children:e.jsx(L,{color:"primary",type:"submit",children:"Search"})})]})})})})}),e.jsxs(u,{children:[w?e.jsx(P,{color:"primary"}):e.jsx(e.Fragment,{children:e.jsxs(H,{children:[e.jsx(B,{children:e.jsxs(f,{children:[e.jsx(a,{scope:"col",children:"#"}),e.jsx(a,{scope:"col",children:"Name"}),e.jsx(a,{scope:"col",children:"Category"}),e.jsx(a,{scope:"col",children:"Stop Type"}),e.jsx(a,{scope:"col",children:"Tag Line"}),e.jsx(a,{scope:"col",children:"Description"}),e.jsx(a,{scope:"col",children:"Domain Name"}),e.jsx(a,{scope:"col",children:"Status"}),e.jsx(a,{scope:"col",children:"Is Hot Place"}),e.jsx(a,{scope:"col",children:"Latitude"}),e.jsx(a,{scope:"col",children:"Longitude"})]})}),e.jsx(R,{children:y.map((s,t)=>e.jsxs(f,{children:[e.jsx(a,{scope:"row",children:t+1}),e.jsx(o,{children:s.name}),e.jsx(o,{children:s.category.name}),e.jsx(o,{children:s.bus_stop_type}),e.jsx(o,{children:s.tag_line}),e.jsx(o,{children:s.description}),e.jsx(o,{children:s.domain_name}),e.jsx(o,{children:s.status}),e.jsx(o,{children:s.is_hot_place}),e.jsx(o,{children:s.latitude}),e.jsx(o,{children:s.longitude})]},s.id))})]})}),e.jsxs(z,{"aria-label":"Page navigation example",children:[e.jsx(m,{disabled:c===1,onClick:()=>i(s=>Math.max(s-1,1)),children:"Previous"}),Array.from({length:d},(s,t)=>e.jsx(m,{active:t+1===c,onClick:()=>i(t+1),children:t+1},t+1)),e.jsx(m,{disabled:c===d,onClick:()=>i(s=>Math.min(s+1,d)),children:"Next"})]})]})]})})})};export{Z as default};
