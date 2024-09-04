import{r as l,j as e,C as ne}from"./index-CeiCU0zs.js";import{a as S}from"./apiService-C4XhZ6hP.js";import{D as T}from"./DropdownSearch-LviYzHFQ.js";import{C as te,a as C}from"./CRow-BOTpF-Qu.js";import{C as I,a as N}from"./CCardBody-DaHs3ufB.js";import{C as re}from"./CCardHeader-C4z8y5CD.js";import{C as w}from"./CForm-2JjP1Tdm.js";import{C as i}from"./CFormLabel-CbwYzW-9.js";import{C as c}from"./CFormInput-CU_BxwIi.js";import{C as O}from"./CFormSelect-C4kMfULs.js";import{a as p}from"./index.es-DuVix-BO.js";import{C as ie}from"./CAlert-DouU5QuH.js";import{C as oe,a as le,b as z,c as j,d as de,e as x}from"./CTable-BLphWcap.js";import{C as ce}from"./CImage-C-s99Ld_.js";import{C as me}from"./CFormSwitch-DDJM26Ba.js";import{C as he,a as F}from"./CPaginationItem-BOfQJ9Hh.js";import{C as B,a as H,b as R,c as L,d as $}from"./CModalTitle-BwbNuXqt.js";import"./CFormControlWrapper-1foQ7KjH.js";import"./CFormControlValidation-CaJ4I8JF.js";import"./CCloseButton-CkZ_HPXF.js";import"./DefaultLayout-DQ356eyJ.js";import"./cil-user-Dlmw-Gem.js";const Ne=()=>{const[J,D]=l.useState([]),[r,y]=l.useState(1),[E,q]=l.useState(1),[G,o]=l.useState(!1),[K,u]=l.useState(!1),[Q,f]=l.useState(!1),[s,_]=l.useState({id:"",name:"",parent_id:"",description:"",icon:null,status:!1,meta_data:""}),[M,k]=l.useState(null),[U,V]=l.useState();l.useEffect(()=>{g(r)},[r]);const d=a=>{k(a)},W=()=>{k(null)},g=async a=>{const n=new FormData;n.append("apitype","list"),s.parent_id&&n.append("parent_id",s.parent_id),s.status&&n.append("status",s.status),o(!0);try{const t=await S("POST",`listcategories?page=${a}`,n);D(t.data.data||[]),q(t.data.last_page||1)}catch(t){console.error("Error fetching categories:",t),d(t.message)}finally{o(!1)}},m=a=>{const{name:n,value:t}=a.target;_(h=>(console.log(t),t==2?{...h,[n]:""}:{...h,[n]:t}))},P=a=>{_({...s,icon:a.target.files[0]})},X=async()=>{const a=new FormData;s.id&&a.append("id",s.id),s.name&&a.append("name",s.name),s.parent_id&&a.append("parent_id",s.parent_id),s.description&&a.append("description",s.description),s.icon&&a.append("icon",s.icon),a.append("status",s.status?"1":"0"),s.meta_data&&a.append("meta_data",s.meta_data),o(!0);try{const n=await S("POST","addCategory",a);if(!n.success){const t=Object.values(n.message).flat().join(", ");d(t);return}u(!1),g(r)}catch(n){console.error("Error adding category:",n),d(n.message)}finally{o(!1)}},Y=async()=>{const a=new FormData;s.id&&a.append("id",s.id),s.name&&a.append("name",s.name),s.parent_id&&a.append("parent_id",s.parent_id),s.description&&a.append("description",s.description),s.icon&&a.append("icon",s.icon),s.meta_data&&a.append("meta_data",s.meta_data),o(!0);try{const n=await S("POST","updateCategory",a);if(!n.success){const t=Object.values(n.message).flat().join(", ");d(t);return}f(!1),g(r)}catch(n){console.error("Error updating category:",n),d(n.message)}finally{o(!1)}},Z=async a=>{o(!0);try{const n=await S("POST","deleteCategory",{id:a});if(!n.success){const t=Object.values(n.message).flat().join(", ");d(t);return}g(r)}catch(n){console.error("Error deleting category:",n),d(n.message)}finally{o(!1)}},ee=a=>{_({id:a.id,name:a.name,description:a.description,icon:null,meta_data:a.meta_data}),f(!0)},ae=async(a,n)=>{const t=new FormData;t.append("id",a),t.append("status",n),V(!U),o(!0);try{const h=await S("POST","updateCategory",t);if(!h.success){const v=Object.values(h.message).flat().join(", ");d(v);return}D(v=>v.map(b=>b.id===a?{...b,status:n}:b))}catch(h){console.error("Error updating category:",h),d(h.message)}finally{o(!1)}},A=a=>{console.log(a),_({...s,parent_id:a})},se=()=>{y(1),g(r)};return e.jsxs(te,{children:[e.jsx(C,{xs:12,children:e.jsxs(I,{className:"mb-4",children:[e.jsx(re,{children:e.jsxs(C,{xs:12,children:[e.jsx(I,{className:"mb-4",children:e.jsx(N,{children:e.jsxs(w,{className:"row gx-3 gy-2 align-items-center",onSubmit:a=>{a.preventDefault(),se()},children:[e.jsxs(C,{sm:3,children:[e.jsx(i,{className:"visually-hidden",htmlFor:"specificSizeInputName",children:"Name"}),e.jsx(c,{id:"specificSizeInputName",placeholder:"Jane Doe"})]}),e.jsx(C,{sm:3,children:e.jsx(T,{onChange:A,endpoint:"listcategories",label:"Categories",filter:[{}]})}),e.jsx(C,{sm:3,children:e.jsxs(O,{id:"status",name:"status",value:s.status,onChange:m,children:[e.jsx("option",{value:"2",children:"All..."}),e.jsx("option",{value:"1",children:"Enable"}),e.jsx("option",{value:"0",children:"Disable"})]})}),e.jsx(C,{xs:"auto",children:e.jsx(p,{color:"primary",type:"submit",children:"Search"})}),e.jsx(C,{xs:"auto",children:e.jsx(p,{color:"primary",onClick:()=>u(!0),children:"Add"})})]})})}),M&&e.jsx(ie,{color:"danger",onClose:W,dismissible:!0,children:M})]})}),e.jsx(N,{children:G?e.jsx(ne,{color:"primary"}):e.jsxs(e.Fragment,{children:[e.jsxs(oe,{children:[e.jsx(le,{children:e.jsxs(z,{children:[e.jsx(j,{scope:"col",children:"#"}),e.jsx(j,{scope:"col",children:"Name"}),e.jsx(j,{scope:"col",children:"Description"}),e.jsx(j,{scope:"col",children:"Icon"}),e.jsx(j,{scope:"col",children:"Status"}),e.jsx(j,{scope:"col",children:"Actions"})]})}),e.jsx(de,{children:J.map((a,n)=>e.jsxs(z,{children:[e.jsx(x,{children:n+1}),e.jsx(x,{children:a.name}),e.jsx(x,{children:a.description}),e.jsx(x,{children:a.icon?e.jsx(ce,{src:a.icon,alt:a.name,width:"50"}):"No Image"}),e.jsx(x,{children:e.jsx(me,{id:`formSwitchCheckChecked-${a.id}`,defaultChecked:a.status==1?1:0,onChange:()=>ae(a.id,a.status==1?0:1)})}),e.jsxs(x,{children:[e.jsx(p,{color:"warning",size:"sm",onClick:()=>ee(a),children:"Edit"})," ",e.jsx(p,{color:"danger",size:"sm",onClick:()=>Z(a.id),children:"Delete"})]})]},a.id))})]}),e.jsxs(he,{children:[e.jsx(F,{disabled:r<=1,onClick:()=>y(r-1),children:"Previous"}),Array.from({length:E},(a,n)=>e.jsx(F,{active:n+1===r,onClick:()=>y(n+1),children:n+1},n)),e.jsx(F,{disabled:r>=E,onClick:()=>y(r+1),children:"Next"})]})]})})]})}),e.jsxs(B,{visible:K,onClose:()=>u(!1),children:[e.jsx(H,{onClose:()=>u(!1),children:e.jsx(R,{children:"Add Category"})}),e.jsx(L,{children:e.jsxs(w,{children:[e.jsx(i,{htmlFor:"name",children:"Name"}),e.jsx(c,{id:"name",name:"name",value:s.name,onChange:m}),e.jsx(i,{htmlFor:"parent_id",children:"Parent Catgeory"}),e.jsx(T,{onChange:A,endpoint:"listcategories",label:"Parent Catgeory",filter:[{}]}),e.jsx(i,{htmlFor:"description",children:"Description"}),e.jsx(c,{id:"description",name:"description",value:s.description,onChange:m}),e.jsx(i,{htmlFor:"icon",children:"Icon"}),e.jsx(c,{type:"file",id:"icon",name:"icon",onChange:P}),e.jsx(i,{htmlFor:"status",children:"Status"}),e.jsxs(O,{id:"status",name:"status",value:s.status,onChange:m,children:[e.jsx("option",{value:!0,children:"Active"}),e.jsx("option",{value:!1,children:"Inactive"})]}),e.jsx(i,{htmlFor:"meta_data",children:"Meta Data"}),e.jsx(c,{id:"meta_data",name:"meta_data",value:s.meta_data,onChange:m})]})}),e.jsxs($,{children:[e.jsx(p,{color:"secondary",onClick:()=>u(!1),children:"Close"}),e.jsx(p,{color:"primary",onClick:X,children:"Add"})]})]}),e.jsxs(B,{visible:Q,onClose:()=>f(!1),children:[e.jsx(H,{onClose:()=>f(!1),children:e.jsx(R,{children:"Edit Category"})}),e.jsx(L,{children:e.jsxs(w,{children:[e.jsx(i,{htmlFor:"name",children:"Name"}),e.jsx(c,{id:"name",name:"name",value:s.name,onChange:m}),e.jsx(i,{htmlFor:"description",children:"Description"}),e.jsx(c,{id:"description",name:"description",value:s.description,onChange:m}),e.jsx(i,{htmlFor:"icon",children:"Icon"}),e.jsx(c,{type:"file",id:"icon",name:"icon",onChange:P}),e.jsx(i,{htmlFor:"meta_data",children:"Meta Data"}),e.jsx(c,{id:"meta_data",name:"meta_data",value:s.meta_data,onChange:m})]})}),e.jsxs($,{children:[e.jsx(p,{color:"secondary",onClick:()=>f(!1),children:"Close"}),e.jsx(p,{color:"primary",onClick:Y,children:"Save Changes"})]})]})]})};export{Ne as default};