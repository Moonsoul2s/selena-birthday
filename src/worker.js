const JSON_HEADERS={"content-type":"application/json; charset=utf-8"};
const MEDIA_KEYS=new Set(["memory1","memory2","memory3","memory4","memory5","memory6","memory7","memory8"]);
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:JSON_HEADERS})}
function bad(msg,status=400){return json({ok:false,error:msg},status)}
async function readJson(r){try{return await r.json()}catch{return {}}}
function base64url(bytes){let s="";for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}
function base64urlText(t){return base64url(new TextEncoder().encode(t))}
async function hmac(secret,msg){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return base64url(new Uint8Array(await crypto.subtle.sign("HMAC",k,new TextEncoder().encode(msg))))}
async function createToken(env){const p=base64urlText(JSON.stringify({exp:Date.now()+12*60*60*1000,role:"admin"}));return p+"."+await hmac(env.SESSION_SECRET||env.ADMIN_PASSWORD,p)}
async function verifyToken(env,t){if(!t||!t.includes("."))return false;const[p,s]=t.split(".");if(s!==await hmac(env.SESSION_SECRET||env.ADMIN_PASSWORD,p))return false;try{const raw=p.replace(/-/g,"+").replace(/_/g,"/"),pad=raw+"=".repeat((4-raw.length%4)%4),d=JSON.parse(atob(pad));return d.role==="admin"&&d.exp>Date.now()}catch{return false}}
async function requireAdmin(r,e){const a=r.headers.get("authorization")||"";return verifyToken(e,a.startsWith("Bearer ")?a.slice(7):"")}
async function getSetting(env,key,f=""){const row=await env.DB.prepare("SELECT value FROM settings WHERE key=?").bind(key).first();return row?.value??f}
function b64bytes(b64=""){const bin=atob(b64),b=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)b[i]=bin.charCodeAt(i);return b}
async function media(env,key){if(!MEDIA_KEYS.has(key))return bad("Not found",404);const b=await getSetting(env,"media_"+key+"_b64",""),m=await getSetting(env,"media_"+key+"_mime","image/jpeg");if(!b)return bad("Not found",404);return new Response(b64bytes(b),{headers:{"content-type":m,"cache-control":"public,max-age=31536000,immutable"}})}
async function versions(env){const rows=(await env.DB.prepare("SELECT key,value FROM settings WHERE key LIKE 'media_memory%_version'").all()).results||[];return json({ok:true,settings:Object.fromEntries(rows.map(x=>[x.key,x.value]))})}
async function admin(r,env,u){
 if(u.pathname==="/api/admin/login"&&r.method==="POST"){const{password}=await readJson(r);if(!env.ADMIN_PASSWORD)return bad("Admin password is not configured.",503);if(String(password||"")!==env.ADMIN_PASSWORD)return bad("Incorrect password.",401);return json({ok:true,token:await createToken(env)})}
 if(!(await requireAdmin(r,env)))return bad("Admin login required.",401);
 if(u.pathname==="/api/admin/bootstrap"&&r.method==="GET"){const x=await versions(env);return x}
 const m=u.pathname.match(/^\/api\/admin\/media\/(memory[1-8])$/);
 if(m&&r.method==="POST"){const b=await readJson(r),mime=String(b.mime||""),base64=String(b.base64||"");if(!["image/jpeg","image/png","image/webp"].includes(mime))return bad("Use JPG, PNG, or WebP.");if(!base64)return bad("Choose a photo first.");if(base64.length>1800000)return bad("Photo is too large after compression.");const v=String(Date.now());for(const[k,val]of[["media_"+m[1]+"_b64",base64],["media_"+m[1]+"_mime",mime],["media_"+m[1]+"_version",v]])await env.DB.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(k,val).run();return json({ok:true,version:v})}
 if(m&&r.method==="DELETE"){await env.DB.prepare("DELETE FROM settings WHERE key IN (?,?,?)").bind("media_"+m[1]+"_b64","media_"+m[1]+"_mime","media_"+m[1]+"_version").run();return json({ok:true})}
 return bad("Admin endpoint not found.",404)
}
export default{async fetch(r,env){const u=new URL(r.url);try{if(u.pathname==="/api/media-versions")return versions(env);const m=u.pathname.match(/^\/api\/site-media\/(memory[1-8])$/);if(m&&r.method==="GET")return media(env,m[1]);if(u.pathname.startsWith("/api/admin/"))return admin(r,env,u);if(u.pathname.startsWith("/api/"))return bad("Not found",404);return env.ASSETS.fetch(r)}catch(e){console.error(e);return bad("Something went wrong.",500)}}};