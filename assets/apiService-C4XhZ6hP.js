const s="/api",c=async o=>{const e=await o.json();if(console.log(e),!o.ok)throw e.message&&e.message.status?new Error(e.message.status[0]):new Error("Network response was not ok");return e},i=async(o,e,t=null)=>{const a=localStorage.getItem("token"),r={method:o.toUpperCase(),headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"}};t&&(r.body=t instanceof FormData?t:JSON.stringify(t),t instanceof FormData&&delete r.headers["Content-Type"]);try{const n=await fetch(`${s}/${e}`,r);return c(n)}catch(n){throw console.error("Error fetching data:",n),new Error("Network error occurred")}};export{i as a};
