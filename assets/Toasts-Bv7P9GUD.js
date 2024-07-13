import{r as o,_ as R,R as l,b as u,c as A,P as r,d as W,w as D,j as e}from"./index-nL3JI2sF.js";import{u as X,T as Z,y as L,t as $,a as x}from"./DefaultLayout-BLPf44xV.js";import{a as z}from"./index.es-CvZb-286.js";import{C as _,a as y}from"./CRow-Dj3ruFxd.js";import{C,a as N}from"./CCardBody-CfNNIafC.js";import{C as T}from"./CCardHeader-Bve7lgPy.js";import"./cil-user-Dlmw-Gem.js";var G=o.createContext({}),d=o.forwardRef(function(s,n){var i=s.children,a=s.animation,t=a===void 0?!0:a,c=s.autohide,U=c===void 0?!0:c,E=s.className,p=s.color,v=s.delay,w=v===void 0?5e3:v,m=s.index,b=s.key,k=s.visible,B=k===void 0?!1:k,H=s.onClose,M=s.onShow,J=R(s,["children","animation","autohide","className","color","delay","index","key","visible","onClose","onShow"]),F=o.useRef(),K=X(n,F),O=o.useState(!1),Y=O[0],P=O[1],S=o.useRef();o.useEffect(function(){P(B)},[B]);var Q={visible:Y,setVisible:P};o.useEffect(function(){return function(){return clearTimeout(S.current)}},[]),o.useEffect(function(){q()},[Y]);var q=function(){U&&(clearTimeout(S.current),S.current=window.setTimeout(function(){P(!1)},w))};return l.createElement(Z,{in:Y,nodeRef:F,onEnter:function(){return M&&M(m??null)},onExited:function(){return H&&H(m??null)},timeout:250,unmountOnExit:!0},function(V){var j;return l.createElement(G.Provider,{value:Q},l.createElement("div",u({className:A("toast",(j={fade:t},j["bg-".concat(p)]=p,j["border-0"]=p,j["show showing"]=V==="entering"||V==="exiting",j.show=V==="entered",j),E),"aria-live":"assertive","aria-atomic":"true",role:"alert",onMouseEnter:function(){return clearTimeout(S.current)},onMouseLeave:function(){return q()}},J,{key:b,ref:K}),i))})});d.propTypes={animation:r.bool,autohide:r.bool,children:r.node,className:r.string,color:W,delay:r.number,index:r.number,key:r.number,onClose:r.func,onShow:r.func,visible:r.bool};d.displayName="CToast";var h=o.forwardRef(function(s,n){var i=s.children,a=s.className,t=R(s,["children","className"]);return l.createElement("div",u({className:A("toast-body",a)},t,{ref:n}),i)});h.propTypes={children:r.node,className:r.string};h.displayName="CToastBody";var g=o.forwardRef(function(s,n){var i=s.children,a=s.as,t=R(s,["children","as"]),c=o.useContext(G).setVisible;return a?l.createElement(a,u({onClick:function(){return c(!1)}},t,{ref:n}),i):l.createElement(L,u({onClick:function(){return c(!1)}},t,{ref:n}))});g.propTypes=u(u({},L.propTypes),{as:r.elementType});g.displayName="CToastClose";var f=o.forwardRef(function(s,n){var i=s.children,a=s.className,t=s.closeButton,c=R(s,["children","className","closeButton"]);return l.createElement("div",u({className:A("toast-header",a)},c,{ref:n}),i,t&&l.createElement(g,null))});f.propTypes={children:r.node,className:r.string,closeButton:r.bool};f.displayName="CToastHeader";var I=o.forwardRef(function(s,n){var i=s.children,a=s.className,t=s.placement,c=s.push,U=R(s,["children","className","placement","push"]),E=o.useState([]),p=E[0],v=E[1],w=o.useRef(0);o.useEffect(function(){w.current++,c&&m(c)},[c]);var m=function(b){v(function(k){return D(D([],k,!0),[l.cloneElement(b,{index:w.current,key:w.current,onClose:function(B){return v(function(H){return H.filter(function(M){return M.props.index!==B})})}})],!1)})};return l.createElement($,{portal:typeof t=="string"},p.length>0||i?l.createElement("div",u({className:A("toaster toast-container",{"position-fixed":t,"top-0":t&&t.includes("top"),"top-50 translate-middle-y":t&&t.includes("middle"),"bottom-0":t&&t.includes("bottom"),"start-0":t&&t.includes("start"),"start-50 translate-middle-x":t&&t.includes("center"),"end-0":t&&t.includes("end")},a)},U,{ref:n}),i,p.map(function(b){return l.cloneElement(b,{visible:!0})})):null)});I.propTypes={children:r.node,className:r.string,placement:r.oneOfType([r.string,r.oneOf(["top-start","top-center","top-end","middle-start","middle-center","middle-end","bottom-start","bottom-center","bottom-end"])]),push:r.any};I.displayName="CToaster";const ee=()=>{const[s,n]=o.useState(0),i=o.useRef(),a=e.jsxs(d,{title:"CoreUI for React.js",children:[e.jsxs(f,{closeButton:!0,children:[e.jsx("svg",{className:"rounded me-2",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid slice",focusable:"false",role:"img",children:e.jsx("rect",{width:"100%",height:"100%",fill:"#007aff"})}),e.jsx("strong",{className:"me-auto",children:"CoreUI for React.js"}),e.jsx("small",{children:"7 min ago"})]}),e.jsx(h,{children:"Hello, world! This is a toast message."})]});return e.jsxs(e.Fragment,{children:[e.jsx(z,{color:"primary",onClick:()=>n(a),children:"Send a toast"}),e.jsx(I,{ref:i,push:s,placement:"top-end"})]})},le=()=>e.jsxs(_,{children:[e.jsx(y,{xs:12,children:e.jsxs(C,{className:"mb-4",children:[e.jsxs(T,{children:[e.jsx("strong",{children:"React Toast"})," ",e.jsx("small",{children:"Basic"})]}),e.jsxs(N,{children:[e.jsx("p",{className:"text-body-secondary small",children:"Toasts are as flexible as you need and have very little required markup. At a minimum, we require a single element to contain your “toasted” content and strongly encourage a dismiss button."}),e.jsx(x,{href:"components/toast",children:e.jsxs(d,{autohide:!1,visible:!0,children:[e.jsxs(f,{closeButton:!0,children:[e.jsx("svg",{className:"rounded me-2",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid slice",focusable:"false",role:"img",children:e.jsx("rect",{width:"100%",height:"100%",fill:"#007aff"})}),e.jsx("strong",{className:"me-auto",children:"CoreUI for React.js"}),e.jsx("small",{children:"7 min ago"})]}),e.jsx(h,{children:"Hello, world! This is a toast message."})]})}),e.jsx(x,{href:"components/toast",children:ee()})]})]})}),e.jsx(y,{xs:12,children:e.jsxs(C,{className:"mb-4",children:[e.jsxs(T,{children:[e.jsx("strong",{children:"React Toast"})," ",e.jsx("small",{children:"Translucent"})]}),e.jsxs(N,{children:[e.jsx("p",{className:"text-body-secondary small",children:"Toasts are slightly translucent to blend in with what's below them."}),e.jsx(x,{href:"components/toast#translucent",tabContentClassName:"bg-dark",children:e.jsxs(d,{autohide:!1,visible:!0,children:[e.jsxs(f,{closeButton:!0,children:[e.jsx("svg",{className:"rounded me-2",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid slice",focusable:"false",role:"img",children:e.jsx("rect",{width:"100%",height:"100%",fill:"#007aff"})}),e.jsx("strong",{className:"me-auto",children:"CoreUI for React.js"}),e.jsx("small",{children:"7 min ago"})]}),e.jsx(h,{children:"Hello, world! This is a toast message."})]})})]})]})}),e.jsx(y,{xs:12,children:e.jsxs(C,{className:"mb-4",children:[e.jsxs(T,{children:[e.jsx("strong",{children:"React Toast"})," ",e.jsx("small",{children:"Stacking"})]}),e.jsxs(N,{children:[e.jsx("p",{className:"text-body-secondary small",children:"You can stack toasts by wrapping them in a toast container, which will vertically add some spacing."}),e.jsx(x,{href:"components/toast#stacking",children:e.jsxs(I,{className:"position-static",children:[e.jsxs(d,{autohide:!1,visible:!0,children:[e.jsxs(f,{closeButton:!0,children:[e.jsx("svg",{className:"rounded me-2",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid slice",focusable:"false",role:"img",children:e.jsx("rect",{width:"100%",height:"100%",fill:"#007aff"})}),e.jsx("strong",{className:"me-auto",children:"CoreUI for React.js"}),e.jsx("small",{children:"7 min ago"})]}),e.jsx(h,{children:"Hello, world! This is a toast message."})]}),e.jsxs(d,{autohide:!1,visible:!0,children:[e.jsxs(f,{closeButton:!0,children:[e.jsx("svg",{className:"rounded me-2",width:"20",height:"20",xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"xMidYMid slice",focusable:"false",role:"img",children:e.jsx("rect",{width:"100%",height:"100%",fill:"#007aff"})}),e.jsx("strong",{className:"me-auto",children:"CoreUI for React.js"}),e.jsx("small",{children:"7 min ago"})]}),e.jsx(h,{children:"Hello, world! This is a toast message."})]})]})})]})]})}),e.jsx(y,{xs:12,children:e.jsxs(C,{className:"mb-4",children:[e.jsxs(T,{children:[e.jsx("strong",{children:"React Toast"})," ",e.jsx("small",{children:"Custom content"})]}),e.jsxs(N,{children:[e.jsxs("p",{className:"text-body-secondary small",children:["Customize your toasts by removing sub-components, tweaking them with"," ",e.jsx("a",{href:"https://coreui.io/docs/utilities/api",children:"utilities"}),", or by adding your own markup. Here we've created a simpler toast by removing the default"," ",e.jsx("code",{children:"<CToastHeader>"}),", adding a custom hide icon from"," ",e.jsx("a",{href:"https://coreui.io/icons/",children:"CoreUI Icons"}),", and using some"," ",e.jsx("a",{href:"https://coreui.io/docs/utilities/flex",children:"flexbox utilities"})," to adjust the layout."]}),e.jsx(x,{href:"components/toast#custom-content",children:e.jsx(d,{autohide:!1,className:"align-items-center",visible:!0,children:e.jsxs("div",{className:"d-flex",children:[e.jsx(h,{children:"Hello, world! This is a toast message."}),e.jsx(g,{className:"me-2 m-auto"})]})})}),e.jsx("p",{className:"text-body-secondary small",children:"Alternatively, you can also add additional controls and components to toasts."}),e.jsx(x,{href:"components/toast#custom-content",children:e.jsx(d,{autohide:!1,visible:!0,children:e.jsxs(h,{children:["Hello, world! This is a toast message.",e.jsxs("div",{className:"mt-2 pt-2 border-top",children:[e.jsx(z,{type:"button",color:"primary",size:"sm",children:"Take action"}),e.jsx(g,{as:z,color:"secondary",size:"sm",className:"ms-1",children:"Close"})]})]})})})]})]})}),e.jsx(y,{xs:12,children:e.jsxs(C,{className:"mb-4",children:[e.jsxs(T,{children:[e.jsx("strong",{children:"React Toast"})," ",e.jsx("small",{children:"Custom content"})]}),e.jsxs(N,{children:[e.jsxs("p",{className:"text-body-secondary small",children:["Building on the above example, you can create different toast color schemes with our"," ",e.jsx("a",{href:"https://coreui.io/docs/utilities/colors",children:"color"})," and"," ",e.jsx("a",{href:"https://coreui.io/docs/utilities/background",children:"background"})," utilities. Here we've set ",e.jsx("code",{children:'color="primary"'})," and added ",e.jsx("code",{children:".text-white"})," ","class to the ",e.jsx("code",{children:"<Ctoast>"}),", and then set ",e.jsx("code",{children:"white"})," property to our close button. For a crisp edge, we remove the default border with"," ",e.jsx("code",{children:".border-0"}),"."]}),e.jsx(x,{href:"components/toast#color-schemes",children:e.jsx(d,{autohide:!1,color:"primary",className:"text-white align-items-center",visible:!0,children:e.jsxs("div",{className:"d-flex",children:[e.jsx(h,{children:"Hello, world! This is a toast message."}),e.jsx(g,{className:"me-2 m-auto",white:!0})]})})})]})]})})]});export{le as default};
