(function(){
var C=window.RB_CONFIG,LIVE=!!(C.supabaseUrl&&C.supabaseKey);
var ACTIVE=["pending","confirmed","chair"],OFF=["cancelled","noshow"];
var LBL={pending:"Waiting",confirmed:"Confirmed",chair:"In the chair",done:"Done",noshow:"No-show",cancelled:"Cancelled"};
var $=function(i){return document.getElementById(i)};
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML}
function norm(p){return String(p).replace(/\D/g,"").slice(-9)}
function iso(n){var d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function nice(d){return new Date(d+"T00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
function ft(t){var p=t.split(":"),h=+p[0];return(h>12?h-12:h)+":"+p[1]+(h>=12?" pm":" am")}
function money(n){return C.currency+" "+Number(n).toLocaleString("en-US")}
function wa(p,m){return"https://wa.me/254"+norm(p)+"?text="+encodeURIComponent(m)}
function srt(a){return a.slice().sort(function(x,y){return(x.day+x.time)<(y.day+y.time)?-1:1})}
function openDays(){var a=[];for(var i=0;i<8;i++){var d=iso(i);if(C.closedDays.indexOf(new Date(d+"T00:00").getDay())<0)a.push(d)}return a}
function chDay(cur,a){return openDays().map(function(d){return'<button class="chip '+(d==cur?"on":"")+'" data-a="'+a+'" data-v="'+d+'">'+nice(d)+'</button>'}).join("")}
function chTime(d,cur,a,taken,x){var n=new Date(),hm=String(n.getHours()).padStart(2,"0")+":"+String(n.getMinutes()).padStart(2,"0");
 return C.openTimes.map(function(t){var off=taken(d,t,x)||(d==iso(0)&&t<hm);return'<button class="chip '+(t==cur?"on":"")+'" data-a="'+a+'" data-v="'+t+'"'+(off?" disabled":"")+'>'+ft(t)+'</button>'}).join("")}

/* One booking card. mode "o" = owner, "c" = client. ctx = {rs, taken} */
function card(b,mode,ctx){
 var o=mode=="o",live=ACTIVE.indexOf(b.status)>-1,when=nice(b.day)+" · "+ft(b.time),id=' data-i="'+b.id+'"';
 var h='<div class="card"><div class="row"><div><b>'+esc(o?b.name:b.service)+'</b><br><span class="mut">'+(o?esc(b.service)+" · "+money(b.price):when+" · "+money(b.price))+'</span>'+(o&&b.day!=iso(0)?'<br><span class="mut">'+nice(b.day)+'</span>':"")+'</div><div><div class="t">'+(o?ft(b.time):"")+'</div><span class="st '+b.status+'">'+LBL[b.status]+'</span></div></div>';
 if(b.rescheduled)h+='<span class="tag">Rescheduled</span>';
 if(b.reminded)h+='<span class="tag">Reminder sent ✓</span>';
 h+='<div class="acts">';
 if(o){
  if(b.status=="pending")h+='<button class="b p" data-a="confirmed"'+id+'>Confirm</button>';
  if(b.status=="confirmed")h+='<button class="b p" data-a="chair"'+id+'>Start</button><a class="b" data-a="remind"'+id+' target="_blank" rel="noopener" href="'+wa(b.phone,"Hi "+b.name+", a reminder of your "+b.service+" appointment on "+when+" at "+C.name+". Reply here if you need to change it.")+'">Send reminder</a>';
  if(b.status=="chair")h+='<button class="b p" data-a="done"'+id+'>Mark done</button>';
  h+='<a class="b" href="tel:+254'+norm(b.phone)+'">Call</a><a class="b g" target="_blank" rel="noopener" href="'+wa(b.phone,"Hi "+b.name+", your "+b.service+" booking on "+when+" is "+LBL[b.status].toLowerCase()+".")+'">WhatsApp</a>';
 }
 if(live&&b.status!="chair")h+='<button class="b" data-a="resch"'+id+'>Reschedule</button>';
 if(o&&b.status=="confirmed")h+='<button class="b" data-a="noshow"'+id+'>No-show</button>';
 if(live&&b.status!="chair")h+='<button class="b" data-a="cancelled"'+id+'>Cancel</button>';
 h+='</div>';
 if(ctx.rs&&ctx.rs.id==b.id)h+='<div class="rs"><h3>New day</h3><div class="chips">'+chDay(ctx.rs.d,"rday")+'</div><h3>New time</h3><div class="chips">'+chTime(ctx.rs.d,ctx.rs.t,"rtime",ctx.taken,b.id)+'</div><div class="acts"><button class="b p" data-a="rsave"'+id+'>Save new time</button><button class="b" data-a="rclose">Close</button></div></div>';
 return h+'</div>'}

/* ---------- Data layer: Supabase when keys are set, otherwise browser demo ---------- */
var KEY="rb_demo_"+C.name,demo=null;
function dsave(){try{localStorage.setItem(KEY,JSON.stringify(demo))}catch(e){}}
function mk(n,p,s,d,t,st){var sv=C.services[s%C.services.length];return{id:String(Math.random()).slice(2),name:n,phone:p,service:sv.name,price:sv.price,day:d,time:t,status:st,note:"",rescheduled:false,reminded:false}}
function dload(){if(demo)return demo;try{demo=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}
 if(!demo){var T=C.openTimes,od=openDays().filter(function(d){return d>iso(0)}),d1=od[0]||iso(1),d2=od[1]||iso(2);demo=[mk("Amina W.","0712 345 678",0,iso(0),T[0],"done"),mk("Grace K.","0722 000 111",1,iso(0),T[2],"confirmed"),mk("Mary N.","0733 000 222",2,d1,T[1],"confirmed"),mk("Faith M.","0744 000 333",0,d1,T[4]||T[3],"pending"),mk("Joy A.","0755 000 444",1,d2,T[3],"confirmed"),mk("Amina W.","0712 345 678",1,iso(-7),T[2],"done")];dsave()}return demo}
function clash(d,t,x){return dload().some(function(b){return b.day==d&&b.time==t&&ACTIVE.indexOf(b.status)>-1&&b.id!=x})}
async function sb(path,o){o=o||{};var h={apikey:C.supabaseKey,"Content-Type":"application/json",Authorization:"Bearer "+(o.token||C.supabaseKey)};if(o.prefer)h.Prefer=o.prefer;
 var r=await fetch(C.supabaseUrl.replace(/\/$/,"")+path,{method:o.method||"GET",headers:h,body:o.body?JSON.stringify(o.body):undefined});
 var t=await r.text(),j=null;try{j=t?JSON.parse(t):null}catch(e){}
 if(!r.ok)throw new Error((j&&(j.message||j.error_description||j.msg))||"Something went wrong. Please try again.");return j}
var API={
 taken:async function(from,to){if(!LIVE)return dload().filter(function(b){return ACTIVE.indexOf(b.status)>-1&&b.day>=from&&b.day<=to}).map(function(b){return{day:b.day,time:b.time}});
  return sb("/rest/v1/rpc/taken_slots",{method:"POST",body:{p_from:from,p_to:to}})},
 create:async function(b){if(!LIVE){if(clash(b.day,b.time))throw new Error("That time was just taken. Please pick another.");var n={id:String(Math.random()).slice(2),name:b.name,phone:b.phone,service:b.service,price:b.price,day:b.day,time:b.time,status:"pending",note:b.note||"",rescheduled:false,reminded:false};dload().push(n);dsave();return n.id}
  return sb("/rest/v1/rpc/create_booking",{method:"POST",body:{p_name:b.name,p_phone:b.phone,p_service:b.service,p_price:b.price,p_day:b.day,p_time:b.time,p_note:b.note||""}})},
 mine:async function(phone){if(!LIVE)return srt(dload().filter(function(b){return norm(b.phone)==norm(phone)}));return sb("/rest/v1/rpc/my_bookings",{method:"POST",body:{p_phone:phone}})},
 change:async function(id,phone,action,day,time){
  if(!LIVE){var b=dload().filter(function(x){return x.id==id&&norm(x.phone)==norm(phone)})[0];if(!b||ACTIVE.indexOf(b.status)<0)throw new Error("This booking cannot be changed.");
   if(action=="cancel")b.status="cancelled";else{if(clash(day,time,id))throw new Error("That time was just taken. Please pick another.");b.day=day;b.time=time;b.status="pending";b.rescheduled=true;b.reminded=false}dsave();return}
  return sb("/rest/v1/rpc/change_booking",{method:"POST",body:{p_id:id,p_phone:phone,p_action:action,p_day:day||null,p_time:time||null}})},
 login:async function(email,pw){if(!LIVE){sessionStorage.setItem("rb_tok","demo");return}var j=await sb("/auth/v1/token?grant_type=password",{method:"POST",body:{email:email,password:pw}});sessionStorage.setItem("rb_tok",j.access_token)},
 token:function(){return sessionStorage.getItem("rb_tok")},
 logout:function(){sessionStorage.removeItem("rb_tok")},
 list:async function(){if(!LIVE)return dload().slice();return sb("/rest/v1/bookings?select=*&order=day.asc,time.asc",{token:API.token()})},
 update:async function(id,patch){if(!LIVE){var b=dload().filter(function(x){return x.id==id})[0];if(b){Object.assign(b,patch);dsave()}return}
  return sb("/rest/v1/bookings?id=eq."+encodeURIComponent(id),{method:"PATCH",body:patch,token:API.token(),prefer:"return=minimal"})},
 add:async function(b){if(!LIVE){var n=mk("",b.phone,0,b.day,b.time,b.status);Object.assign(n,b);dload().push(n);dsave();return}
  return sb("/rest/v1/bookings",{method:"POST",body:b,token:API.token(),prefer:"return=minimal"})}
};
/* theme from config */
var st=document.documentElement.style;if(C.colors){st.setProperty("--lilac",C.colors.main);st.setProperty("--gold",C.colors.accent);st.setProperty("--bg",C.colors.bg)}
window.RB={openDays:openDays,C:C,LIVE:LIVE,ACTIVE:ACTIVE,OFF:OFF,LBL:LBL,$:$,esc:esc,norm:norm,iso:iso,nice:nice,ft:ft,money:money,wa:wa,srt:srt,chDay:chDay,chTime:chTime,card:card,API:API};
})();
