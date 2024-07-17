import{r as y,_ as x,R as m,a as C,c as E,P as o,b as H}from"./index-DXNJ3qnV.js";var S=y.forwardRef(function(e,s){var a=e.children,r=e.active,n=e.as,t=n===void 0?"a":n,i=e.className,c=e.disabled,p=x(e,["children","active","as","className","disabled"]);return m.createElement(t,C({className:E(i,{active:r,disabled:c})},r&&{"aria-current":"page"},t==="a"&&c&&{"aria-disabled":!0,tabIndex:-1},(t==="a"||t==="button")&&{onClick:function(d){d.preventDefault,!c&&p.onClick&&p.onClick(d)}},{disabled:c},p,{ref:s}),a)});S.propTypes={active:o.bool,as:o.elementType,children:o.node,className:o.string,disabled:o.bool};S.displayName="CLink";var A=y.forwardRef(function(e,s){var a,r=e.children,n=e.as,t=n===void 0?"button":n,i=e.className,c=e.color,p=e.shape,d=e.size,h=e.type,b=h===void 0?"button":h,u=e.variant,v=x(e,["children","as","className","color","shape","size","type","variant"]);return m.createElement(S,C({as:v.href?"a":t},!v.href&&{type:b},{className:E("btn",u?"btn-".concat(u,"-").concat(c):"btn-".concat(c),(a={},a["btn-".concat(d)]=d,a),p,i)},v,{ref:s}),r)});A.propTypes={as:o.elementType,children:o.node,className:o.string,color:H,shape:o.string,size:o.oneOf(["sm","lg"]),type:o.oneOf(["button","submit","reset"]),variant:o.oneOf(["outline","ghost"])};A.displayName="CButton";var J=["xxl","xl","lg","md","sm","fluid"],k=y.forwardRef(function(e,s){var a=e.children,r=e.className,n=x(e,["children","className"]),t=[];return J.forEach(function(i){var c=n[i];delete n[i],c&&t.push("container-".concat(i))}),m.createElement("div",C({className:E(t.length>0?t:"container",r)},n,{ref:s}),a)});k.propTypes={children:o.node,className:o.string,sm:o.bool,md:o.bool,lg:o.bool,xl:o.bool,xxl:o.bool,fluid:o.bool};k.displayName="CContainer";var _={VITE_ENV:"production",VITE_API_URL:"https://dev.tourkokan.com/admin/v2"},N=function(){return N=Object.assign||function(s){for(var a,r=1,n=arguments.length;r<n;r++){a=arguments[r];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(s[t]=a[t])}return s},N.apply(this,arguments)};function K(e,s){var a={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&s.indexOf(r)<0&&(a[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,r=Object.getOwnPropertySymbols(e);n<r.length;n++)s.indexOf(r[n])<0&&Object.prototype.propertyIsEnumerable.call(e,r[n])&&(a[r[n]]=e[r[n]]);return a}function F(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var W={exports:{}},T,j;function Y(){if(j)return T;j=1;var e="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return T=e,T}var w,I;function G(){if(I)return w;I=1;var e=Y();function s(){}function a(){}return a.resetWarningCache=s,w=function(){function r(i,c,p,d,h,b){if(b!==e){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}r.isRequired=r;function n(){return r}var t={array:r,bigint:r,bool:r,func:r,number:r,object:r,string:r,symbol:r,any:r,arrayOf:n,element:r,elementType:r,instanceOf:n,node:r,objectOf:n,oneOf:n,oneOfType:n,shape:n,exact:n,checkPropTypes:a,resetWarningCache:s};return t.PropTypes=t,t},w}W.exports=G()();var Q=W.exports,l=F(Q),B={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(e){(function(){var s={}.hasOwnProperty;function a(){for(var r=[],n=0;n<arguments.length;n++){var t=arguments[n];if(t){var i=typeof t;if(i==="string"||i==="number")r.push(t);else if(Array.isArray(t)){if(t.length){var c=a.apply(null,t);c&&r.push(c)}}else if(i==="object"){if(t.toString!==Object.prototype.toString&&!t.toString.toString().includes("[native code]")){r.push(t.toString());continue}for(var p in t)s.call(t,p)&&t[p]&&r.push(p)}}}return r.join(" ")}e.exports?(a.default=a,e.exports=a):window.classNames=a})()})(B);var X=B.exports,z=F(X),Z=function(e){return e.replace(/([-_][a-z0-9])/gi,function(s){return s.toUpperCase()}).replace(/-/gi,"")},L=y.forwardRef(function(e,s){var a,r=e.className,n=e.content,t=e.customClassName,i=e.height,c=e.icon,p=e.name,d=e.size,h=e.title,b=e.use,u=e.width,v=K(e,["className","content","customClassName","height","icon","name","size","title","use","width"]),P=y.useState(0),O=P[0],q=P[1],f=c||n||p;n&&process,p&&process,y.useMemo(function(){return q(O+1)},[f,JSON.stringify(f)]);var M=h?"<title>".concat(h,"</title>"):"",g=y.useMemo(function(){var $=f&&typeof f=="string"&&f.includes("-")?Z(f):f;if(Array.isArray(f))return f;if(typeof f=="string"&&m.icons)return m.icons[$]},[O]),D=y.useMemo(function(){return Array.isArray(g)?g[1]||g[0]:g},[O]),U=function(){return Array.isArray(g)&&g.length>1?g[0]:"64 64"}(),V=function(){return v.viewBox||"0 0 ".concat(U)}(),R=t?z(t):z("icon",(a={},a["icon-".concat(d)]=d,a["icon-custom-size"]=i||u,a),r);return m.createElement(m.Fragment,null,b?m.createElement("svg",N({xmlns:"http://www.w3.org/2000/svg",className:R},i&&{height:i},u&&{width:u},{role:"img","aria-hidden":"true"},v,{ref:s}),m.createElement("use",{href:b})):m.createElement("svg",N({xmlns:"http://www.w3.org/2000/svg",viewBox:V,className:R},i&&{height:i},u&&{width:u},{role:"img","aria-hidden":"true",dangerouslySetInnerHTML:{__html:M+D}},v,{ref:s})),h&&m.createElement("span",{className:"visually-hidden"},h))});L.propTypes={className:l.string,content:l.oneOfType([l.array,l.string]),customClassName:l.string,height:l.number,icon:l.oneOfType([l.array,l.string]),name:l.string,size:l.oneOf(["custom","custom-size","sm","lg","xl","xxl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"]),title:l.any,use:l.any,width:l.number};L.displayName="CIcon";export{S as C,A as a,k as b,L as c};
