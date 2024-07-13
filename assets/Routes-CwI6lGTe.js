import{P as B,R as ee,r as d,j as e,C as ae}from"./index-nL3JI2sF.js";import{a as S}from"./apiService-BO8Zjuly.js";import{C as k}from"./CFormSelect-CPFHmx-0.js";import{C as se,a as u}from"./CRow-Dj3ruFxd.js";import{C as L,a as O}from"./CCardBody-CfNNIafC.js";import{C as te}from"./CCardHeader-Bve7lgPy.js";import{C as N}from"./CForm-a86DSA6J.js";import{C as i}from"./CFormLabel-BOq5L0Yd.js";import{C as n}from"./CFormInput-BzcF2Gle.js";import{a as x}from"./index.es-CvZb-286.js";import{C as ie,a as ne,b as q,c as l,d as oe,e as c}from"./CTable-ZTB9Nu-T.js";import{C as de,a as re}from"./CPaginationItem-Cv7tZCXk.js";import{C as H,a as $,b as K,c as W,d as G}from"./CModalTitle-DpyVf6DY.js";import{C as le}from"./CAlert-B32q7EBW.js";import"./CFormControlWrapper-BtQtE9kz.js";import"./CFormControlValidation-D8xtLuVX.js";import"./DefaultLayout-BLPf44xV.js";import"./cil-user-Dlmw-Gem.js";const J=P=>{const{onChange:F,endpoint:T}=P,[R,m]=d.useState([]),[v,I]=d.useState([]),[w,z]=d.useState(1),[h,E]=d.useState(1),[j,D]=d.useState(!1),[g,s]=d.useState(null),[C,A]=d.useState({id:"",name:"",search:""});d.useEffect(()=>{y(w,T)},[w]);const b=r=>{s(r)},y=async(r,t)=>{const f=new FormData;C.search&&f.append("search",C.search),f.append("apitype","dropdown"),f.append("type","bus"),D(!0);try{const p=await S("POST",`${t}?page=${r}`,f);m(p.data.data||[]),I(p.data.links||[]),E(p.data.last_page||1)}catch(p){console.error("Error fetching routes:",p),b(p.message)}finally{D(!1)}},M=r=>{const{value:t}=r.target;F&&F(t)};return e.jsx("div",{className:"example",children:j?e.jsx("p",{children:"Loading routes..."}):e.jsxs(k,{id:"specificSizeSelectRoute",name:"route",onChange:M,children:[e.jsx("option",{value:"",children:"Category..."}),R.map(r=>e.jsx("option",{value:r.id,children:r.name},r.id))]})})};J.propTypes={onChange:B.func,endpoint:B.string.isRequired};const ce=ee.memo(J),Pe=()=>{const[P,F]=d.useState([]),[T,R]=d.useState([]),[m,v]=d.useState(1),[I,w]=d.useState(1),[z,h]=d.useState(!1),[E,j]=d.useState(!1),[D,g]=d.useState(!1),[s,C]=d.useState({id:"",name:"",description:"",icon:null,status:!1,meta_data:"",source_place_id:"",destination_place_id:"",bus_type_id:"",distance:"",start_time:"",end_time:"",total_time:"",delayed_time:"",working_days:"",search:""}),[A,b]=d.useState(null);d.useEffect(()=>{r(m)},[m]);const y=a=>{b(a)},M=()=>{b(null)},r=async a=>{const o=new FormData;s.source_place_id&&o.append("source_place_id",s.source_place_id),s.destination_place_id&&o.append("destination_place_id",s.destination_place_id),s.search&&o.append("search",s.search),s.per_page&&o.append("per_page",s.per_page),o.append("apitype","list"),h(!0);try{const _=await S("POST",`routes?page=${a}`,o);F(_.data.data||[]),R(_.data.links||[]),w(_.data.last_page||1)}catch(_){console.error("Error fetching routes:",_),y(_.message)}finally{h(!1)}},t=a=>{const{name:o,value:_}=a.target;C({...s,[o]:_})},f=async()=>{const a=new FormData;s.id&&a.append("id",s.id),s.name&&a.append("name",s.name),s.description&&a.append("description",s.description),s.icon&&a.append("icon",s.icon),a.append("status",s.status?"1":"0"),s.meta_data&&a.append("meta_data",s.meta_data),h(!0);try{await S("POST","addCategory",a),j(!1),r(m)}catch(o){console.error("Error adding category:",o),y(o.message)}finally{h(!1)}},p=async()=>{const a=new FormData;s.id&&a.append("id",s.id),s.name&&a.append("name",s.name),s.description&&a.append("description",s.description),s.icon&&a.append("icon",s.icon),a.append("status",s.status?"1":"0"),s.meta_data&&a.append("meta_data",s.meta_data),h(!0);try{await S("POST","updateRoute",a),g(!1),r(m)}catch(o){console.error("Error updating category:",o),y(o.message)}finally{h(!1)}},Q=async a=>{h(!0);try{await S("POST","deleteRoute",{id:a}),r(m)}catch(o){console.error("Error deleting category:",o),y(o.message)}finally{h(!1)}},U=a=>{C({id:a.id,name:a.name,description:a.description,source_place_id:a.source_place_id,destination_place_id:a.destination_place_id,bus_type_id:a.bus_type_id,distance:a.distance,start_time:a.start_time,end_time:a.end_time,total_time:a.total_time,delayed_time:a.delayed_time,working_days:a.working_days,meta_data:a.meta_data}),g(!0)},V=a=>{v(a==="&laquo; Previous"?m-1:a==="Next &raquo;"?m+1:parseInt(a))},X=a=>a.replace("&laquo;","").replace("&raquo;",""),Y=()=>{v(1),r(1)},Z=a=>{console.log(a),C({...s,category:a})};return e.jsxs(se,{children:[e.jsx(u,{xs:12,children:e.jsxs(L,{className:"mb-4",children:[e.jsx(te,{children:e.jsx(u,{xs:12,children:e.jsx(L,{className:"mb-4",children:e.jsx(O,{children:e.jsxs(N,{className:"row gx-3 gy-2 align-items-center",onSubmit:a=>{a.preventDefault(),Y()},children:[e.jsxs(u,{sm:3,children:[e.jsx(i,{htmlFor:"specificSizeInputName",children:"Name"}),e.jsx(n,{id:"specificSizeInputName",name:"search",value:s.search,onChange:t,placeholder:"Route name"})]}),e.jsxs(u,{sm:3,children:[e.jsx(i,{htmlFor:"specificSizeSelectRoutes",children:"Source Place"}),e.jsx(ce,{onChange:Z,endpoint:"sites"})]}),e.jsxs(u,{sm:3,children:[e.jsx(i,{htmlFor:"specificSizeSelectCity",children:"City"}),e.jsxs(k,{id:"specificSizeSelectCity",name:"city",value:s.city,onChange:t,children:[e.jsx("option",{value:"",children:"City..."}),e.jsx("option",{value:"1",children:"One"}),e.jsx("option",{value:"2",children:"Two"}),e.jsx("option",{value:"3",children:"Three"})]})]}),e.jsx(u,{xs:"auto",children:e.jsx(x,{color:"primary",type:"submit",children:"Search"})}),e.jsx(u,{xs:"auto",children:e.jsx(x,{color:"primary",onClick:()=>j(!0),children:"Add"})})]})})})})}),e.jsx(O,{children:z?e.jsx(ae,{color:"primary"}):e.jsxs(e.Fragment,{children:[e.jsxs(ie,{children:[e.jsx(ne,{children:e.jsxs(q,{children:[e.jsx(l,{scope:"col",children:"#"}),e.jsx(l,{scope:"col",children:"Name"}),e.jsx(l,{scope:"col",children:"Source Place"}),e.jsx(l,{scope:"col",children:"Description"}),e.jsx(l,{scope:"col",children:"Destination Place"}),e.jsx(l,{scope:"col",children:"Bus Type"}),e.jsx(l,{scope:"col",children:"Distance"}),e.jsx(l,{scope:"col",children:"Start Time"}),e.jsx(l,{scope:"col",children:"End Time"}),e.jsx(l,{scope:"col",children:"Total Time"}),e.jsx(l,{scope:"col",children:"Delayed Time"}),e.jsx(l,{scope:"col",children:"Working Days"}),e.jsx(l,{scope:"col",children:"Status"}),e.jsx(l,{scope:"col",children:"Actions"})]})}),e.jsx(oe,{children:P.map((a,o)=>e.jsxs(q,{children:[e.jsx(c,{children:o+1}),e.jsx(c,{children:a.name}),e.jsx(c,{children:a.source_place.name+" ("+a.source_place.category.name+")"}),e.jsx(c,{children:a.destination_place.name+" ("+a.destination_place.category.name+")"}),e.jsx(c,{children:a.bus_type.type}),e.jsx(c,{children:a.description}),e.jsx(c,{children:a.distance+" KM"}),e.jsx(c,{children:a.start_time}),e.jsx(c,{children:a.end_time}),e.jsx(c,{children:a.total_time}),e.jsx(c,{children:a.delayed_time}),e.jsx(c,{children:a.working_days}),e.jsx(c,{children:a.status?"Inactive":"Active"}),e.jsxs(c,{children:[e.jsx(x,{color:"warning",size:"sm",onClick:()=>U(a),children:"Edit"})," ",e.jsx(x,{color:"danger",size:"sm",onClick:()=>Q(a.id),children:"Delete"})]})]},a.id))})]}),e.jsx(de,{children:T.map((a,o)=>e.jsx(re,{active:a.active,onClick:()=>V(a.label),disabled:!a.url,children:X(a.label)},o))})]})})]})}),e.jsxs(H,{visible:E,onClose:()=>j(!1),children:[e.jsx($,{onClose:()=>j(!1),children:e.jsx(K,{children:"Add Category"})}),e.jsx(W,{children:e.jsxs(N,{children:[e.jsx(i,{htmlFor:"name",children:"Name"}),e.jsx(n,{id:"name",name:"name",value:s.name,onChange:t}),e.jsx(i,{htmlFor:"description",children:"Description"}),e.jsx(n,{id:"description",name:"description",value:s.description,onChange:t}),e.jsx(i,{htmlFor:"source_place_id",children:"Destination Place"}),e.jsx(n,{id:"source_place_id",name:"source_place_id",value:s.source_place_id,onChange:t}),e.jsx(i,{htmlFor:"destination_place_id",children:"Destination Place"}),e.jsx(n,{id:"destination_place_id",name:"destination_place_id",value:s.destination_place_id,onChange:t}),e.jsx(i,{htmlFor:"bus_type_id",children:"Bus Type"}),e.jsx(n,{id:"bus_type_id",name:"bus_type_id",value:s.bus_type_id,onChange:t}),e.jsx(i,{htmlFor:"distance",children:"Distance"}),e.jsx(n,{id:"distance",name:"distance",value:s.distance,onChange:t}),e.jsx(i,{htmlFor:"status",children:"Status"}),e.jsxs(k,{id:"status",name:"status",value:s.status,onChange:t,children:[e.jsx("option",{value:!0,children:"Active"}),e.jsx("option",{value:!1,children:"Inactive"})]}),e.jsx(i,{htmlFor:"start_time",children:"start_time"}),e.jsx(n,{id:"start_time",name:"start_time",value:s.start_time,onChange:t}),e.jsx(i,{htmlFor:"end_time",children:"end_time"}),e.jsx(n,{id:"end_time",name:"end_time",value:s.end_time,onChange:t}),e.jsx(i,{htmlFor:"total_time",children:"total_time"}),e.jsx(n,{id:"total_time",name:"total_time",value:s.total_time,onChange:t}),e.jsx(i,{htmlFor:"delayed_time",children:"delayed_time"}),e.jsx(n,{id:"delayed_time",name:"delayed_time",value:s.delayed_time,onChange:t}),e.jsx(i,{htmlFor:"working_days",children:"working_days"}),e.jsx(n,{id:"working_days",name:"working_days",value:s.working_days,onChange:t}),e.jsx(i,{htmlFor:"meta_data",children:"Meta Data"}),e.jsx(n,{id:"meta_data",name:"meta_data",value:s.meta_data,onChange:t})]})}),e.jsxs(G,{children:[e.jsx(x,{color:"secondary",onClick:()=>j(!1),children:"Close"}),e.jsx(x,{color:"primary",onClick:f,children:"Add"})]})]}),e.jsxs(H,{visible:D,onClose:()=>g(!1),children:[e.jsx($,{onClose:()=>g(!1),children:e.jsx(K,{children:"Edit Routes"})}),e.jsx(W,{children:e.jsxs(N,{children:[e.jsx(i,{htmlFor:"name",children:"Name"}),e.jsx(n,{id:"name",name:"name",value:s.name,onChange:t}),e.jsx(i,{htmlFor:"description",children:"Description"}),e.jsx(n,{id:"description",name:"description",value:s.description,onChange:t}),e.jsx(i,{htmlFor:"source_place_id",children:"Destination Place"}),e.jsx(n,{id:"source_place_id",name:"source_place_id",value:s.source_place_id,onChange:t}),e.jsx(i,{htmlFor:"destination_place_id",children:"Destination Place"}),e.jsx(n,{id:"destination_place_id",name:"destination_place_id",value:s.destination_place_id,onChange:t}),e.jsx(i,{htmlFor:"bus_type_id",children:"Bus Type"}),e.jsx(n,{id:"bus_type_id",name:"bus_type_id",value:s.bus_type_id,onChange:t}),e.jsx(i,{htmlFor:"distance",children:"Distance"}),e.jsx(n,{id:"distance",name:"distance",value:s.distance,onChange:t}),e.jsx(i,{htmlFor:"status",children:"Status"}),e.jsxs(k,{id:"status",name:"status",value:s.status,onChange:t,children:[e.jsx("option",{value:!0,children:"Active"}),e.jsx("option",{value:!1,children:"Inactive"})]}),e.jsx(i,{htmlFor:"start_time",children:"start_time"}),e.jsx(n,{id:"start_time",name:"start_time",value:s.start_time,onChange:t}),e.jsx(i,{htmlFor:"end_time",children:"end_time"}),e.jsx(n,{id:"end_time",name:"end_time",value:s.end_time,onChange:t}),e.jsx(i,{htmlFor:"total_time",children:"total_time"}),e.jsx(n,{id:"total_time",name:"total_time",value:s.total_time,onChange:t}),e.jsx(i,{htmlFor:"delayed_time",children:"delayed_time"}),e.jsx(n,{id:"delayed_time",name:"delayed_time",value:s.delayed_time,onChange:t}),e.jsx(i,{htmlFor:"working_days",children:"working_days"}),e.jsx(n,{id:"working_days",name:"working_days",value:s.working_days,onChange:t}),e.jsx(i,{htmlFor:"meta_data",children:"Meta Data"}),e.jsx(n,{id:"meta_data",name:"meta_data",value:s.meta_data,onChange:t})]})}),e.jsxs(G,{children:[e.jsx(x,{color:"secondary",onClick:()=>g(!1),children:"Close"}),e.jsx(x,{color:"primary",onClick:p,children:"Save Changes"})]})]}),A&&e.jsx(le,{color:"danger",onClose:M,dismissible:!0,children:A})]})};export{Pe as default};
