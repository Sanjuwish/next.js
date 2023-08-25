(function(){"use strict";var e={806:function(e,t){Object.defineProperty(t,"__esModule",{value:true});t.subscribeToUpdate=t.subscribeToChunkUpdate=t.setHooks=t.connect=void 0;function connect({addMessageListener:e,sendMessage:t}){e((e=>{switch(e.type){case"turbopack-connected":handleSocketConnected(t);break;default:handleSocketMessage(e.data);break}}));const n=globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;if(n!=null&&!Array.isArray(n)){throw new Error("A separate HMR handler was already registered")}globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS={push:([e,n])=>{subscribeToChunkUpdate(e,t,n)}};if(Array.isArray(n)){for(const[e,s]of n){subscribeToChunkUpdate(e,t,s)}}}t.connect=connect;const n=new Map;function sendJSON(e,t){e(JSON.stringify(t))}function resourceKey(e){return JSON.stringify({path:e.path,headers:e.headers||null})}function subscribeToUpdates(e,t){sendJSON(e,{type:"turbopack-subscribe",...t});return()=>{sendJSON(e,{type:"turbopack-unsubscribe",...t})}}function handleSocketConnected(e){for(const t of n.keys()){subscribeToUpdates(e,JSON.parse(t))}}const s=new Map;function aggregateUpdates(e,t){const n=resourceKey(e.resource);let r=s.get(n);if(e.type==="issues"&&r!=null){if(!t){s.delete(n)}return{...e,type:"partial",instruction:r.update}}if(e.type!=="partial")return e;if(r==null){if(t){s.set(n,{resource:e.resource,update:e.instruction})}return e}r={resource:e.resource,update:mergeChunkListUpdates(r.update,e.instruction)};if(t){s.set(n,r)}else{s.delete(n)}return{...e,instruction:r.update}}function mergeChunkListUpdates(e,t){let n;if(e.chunks!=null){if(t.chunks==null){n=e.chunks}else{n=mergeChunkListChunks(e.chunks,t.chunks)}}else if(t.chunks!=null){n=t.chunks}let s;if(e.merged!=null){if(t.merged==null){s=e.merged}else{let n=e.merged[0];for(let t=1;t<e.merged.length;t++){n=mergeChunkListEcmascriptMergedUpdates(n,e.merged[t])}for(let e=0;e<t.merged.length;e++){n=mergeChunkListEcmascriptMergedUpdates(n,t.merged[e])}s=[n]}}else if(t.merged!=null){s=t.merged}return{type:"ChunkListUpdate",chunks:n,merged:s}}function mergeChunkListChunks(e,t){const n={};for(const[s,r]of Object.entries(e)){const e=t[s];if(e!=null){const t=mergeChunkUpdates(r,e);if(t!=null){n[s]=t}}else{n[s]=r}}for(const[e,s]of Object.entries(t)){if(n[e]==null){n[e]=s}}return n}function mergeChunkUpdates(e,t){if(e.type==="added"&&t.type==="deleted"||e.type==="deleted"&&t.type==="added"){return undefined}if(e.type==="partial"){invariant(e.instruction,"Partial updates are unsupported")}if(t.type==="partial"){invariant(t.instruction,"Partial updates are unsupported")}return undefined}function mergeChunkListEcmascriptMergedUpdates(e,t){const n=mergeEcmascriptChunkEntries(e.entries,t.entries);const s=mergeEcmascriptChunksUpdates(e.chunks,t.chunks);return{type:"EcmascriptMergedUpdate",entries:n,chunks:s}}function mergeEcmascriptChunkEntries(e,t){return{...e,...t}}function mergeEcmascriptChunksUpdates(e,t){if(e==null){return t}if(t==null){return e}const n={};for(const[s,r]of Object.entries(e)){const e=t[s];if(e!=null){const t=mergeEcmascriptChunkUpdates(r,e);if(t!=null){n[s]=t}}else{n[s]=r}}for(const[e,s]of Object.entries(t)){if(n[e]==null){n[e]=s}}if(Object.keys(n).length===0){return undefined}return n}function mergeEcmascriptChunkUpdates(e,t){if(e.type==="added"&&t.type==="deleted"){return undefined}if(e.type==="deleted"&&t.type==="added"){const n=[];const s=[];const r=new Set(e.modules??[]);const o=new Set(t.modules??[]);for(const e of o){if(!r.has(e)){n.push(e)}}for(const e of r){if(!o.has(e)){s.push(e)}}if(n.length===0&&s.length===0){return undefined}return{type:"partial",added:n,deleted:s}}if(e.type==="partial"&&t.type==="partial"){const n=new Set([...e.added??[],...t.added??[]]);const s=new Set([...e.deleted??[],...t.deleted??[]]);if(t.added!=null){for(const e of t.added){s.delete(e)}}if(t.deleted!=null){for(const e of t.deleted){n.delete(e)}}return{type:"partial",added:[...n],deleted:[...s]}}if(e.type==="added"&&t.type==="partial"){const n=new Set([...e.modules??[],...t.added??[]]);for(const e of t.deleted??[]){n.delete(e)}return{type:"added",modules:[...n]}}if(e.type==="partial"&&t.type==="deleted"){const n=new Set(t.modules??[]);if(e.added!=null){for(const t of e.added){n.delete(t)}}return{type:"deleted",modules:[...n]}}return undefined}function invariant(e,t){throw new Error(`Invariant: ${t}`)}const r=["bug","error","fatal"];function compareByList(e,t,n){const s=e.indexOf(t)+1||e.length;const r=e.indexOf(n)+1||e.length;return s-r}const o=new Map;function emitIssues(){const e=[];const t=new Set;for(const[n,s]of o){for(const n of s){if(t.has(n.formatted))continue;e.push(n);t.add(n.formatted)}}sortIssues(e);u.issues(e)}function handleIssues(e){const t=resourceKey(e.resource);let n=false;for(const t of e.issues){if(r.includes(t.severity)){n=true}}if(e.issues.length>0){o.set(t,e.issues)}else if(o.has(t)){o.delete(t)}emitIssues();return n}const i=["bug","fatal","error","warning","info","log"];const c=["parse","resolve","code generation","rendering","typescript","other"];function sortIssues(e){e.sort(((e,t)=>{const n=compareByList(i,e.severity,t.severity);if(n!==0)return n;return compareByList(c,e.category,t.category)}))}const u={beforeRefresh:()=>{},refresh:()=>{},buildOk:()=>{},issues:e=>{}};function setHooks(e){Object.assign(u,e)}t.setHooks=setHooks;function handleSocketMessage(e){sortIssues(e.issues);const t=handleIssues(e);const n=false;const r=aggregateUpdates(e,n);if(n)return;const o=s.size===0;if(r.type!=="issues"){if(o)u.beforeRefresh();triggerUpdate(r);if(o)u.refresh()}if(o)u.buildOk();if(r.type!=="issues"&&globalThis.__NEXT_HMR_CB){globalThis.__NEXT_HMR_CB();globalThis.__NEXT_HMR_CB=null}}function subscribeToChunkUpdate(e,t,n){return subscribeToUpdate({path:e},t,n)}t.subscribeToChunkUpdate=subscribeToChunkUpdate;function subscribeToUpdate(e,t,s){const r=resourceKey(e);let o;const i=n.get(r);if(!i){o={callbacks:new Set([s]),unsubscribe:subscribeToUpdates(t,e)};n.set(r,o)}else{i.callbacks.add(s);o=i}return()=>{o.callbacks.delete(s);if(o.callbacks.size===0){o.unsubscribe();n.delete(r)}}}t.subscribeToUpdate=subscribeToUpdate;function triggerUpdate(e){const t=resourceKey(e.resource);const s=n.get(t);if(!s){return}try{for(const t of s.callbacks){t(e)}if(e.type==="notFound"){n.delete(t)}}catch(t){console.error(`An error occurred during the update of resource \`${e.resource.path}\``,t);location.reload()}}},634:function(e,t,n){var s=this&&this.__createBinding||(Object.create?function(e,t,n,s){if(s===undefined)s=n;var r=Object.getOwnPropertyDescriptor(t,n);if(!r||("get"in r?!t.__esModule:r.writable||r.configurable)){r={enumerable:true,get:function(){return t[n]}}}Object.defineProperty(e,s,r)}:function(e,t,n,s){if(s===undefined)s=n;e[s]=t[n]});var r=this&&this.__exportStar||function(e,t){for(var n in e)if(n!=="default"&&!Object.prototype.hasOwnProperty.call(t,n))s(t,e,n)};Object.defineProperty(t,"__esModule",{value:true});r(n(806),t);r(n(824),t)},824:function(e,t){Object.defineProperty(t,"__esModule",{value:true});t.connectHMR=t.sendMessage=t.addMessageListener=void 0;let n;const s=[];function getSocketProtocol(e){let t=location.protocol;try{t=new URL(e).protocol}catch(e){}return t==="http:"?"ws":"wss"}function addMessageListener(e){s.push(e)}t.addMessageListener=addMessageListener;function sendMessage(e){if(!n||n.readyState!==n.OPEN)return;return n.send(e)}t.sendMessage=sendMessage;function connectHMR(e){const{timeout:t=5*1e3}=e;function init(){if(n)n.close();console.log("[HMR] connecting...");function handleOnline(){const t={type:"turbopack-connected"};s.forEach((e=>{e(t)}));if(e.log)console.log("[HMR] connected")}function handleMessage(e){const t={type:"turbopack-message",data:JSON.parse(e.data)};s.forEach((e=>{e(t)}))}function handleDisconnect(){n.close();setTimeout(init,t)}const{hostname:r,port:o}=location;const i=getSocketProtocol(e.assetPrefix||"");const c=e.assetPrefix.replace(/^\/+/,"");let u=`${i}://${r}:${o}${c?`/${c}`:""}`;if(c.startsWith("http")){u=`${i}://${c.split("://")[1]}`}n=new window.WebSocket(`${u}${e.path}`);n.onopen=handleOnline;n.onerror=handleDisconnect;n.onmessage=handleMessage}init()}t.connectHMR=connectHMR}};var t={};function __nccwpck_require__(n){var s=t[n];if(s!==undefined){return s.exports}var r=t[n]={exports:{}};var o=true;try{e[n].call(r.exports,r,r.exports,__nccwpck_require__);o=false}finally{if(o)delete t[n]}return r.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var n=__nccwpck_require__(634);module.exports=n})();