(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{238:function(e,t,a){e.exports=a(562)},243:function(e,t,a){},248:function(e,t,a){},258:function(e,t,a){},357:function(e,t,a){},359:function(e,t,a){},560:function(e,t,a){},562:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),s=a(6),o=a.n(s),c=(a(243),a(35)),i=a(36),l=a(38),m=a(37),u=a(39),f=(a(158),a(72)),d=a.n(f),p=(a(248),a(570)),h=a(568),g=a(571),v=(a(250),a(103)),y=a.n(v),E=(a(159),a(27)),D=a.n(E),b=a(567),S=(a(258),d.a.Header),j=function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=[r.a.createElement(y.a.Item,{key:"/"},r.a.createElement(b.a,{to:"/"},r.a.createElement(D.a,{type:"home",className:"nav-icon"}))),r.a.createElement(y.a.Item,{key:"/roster"},r.a.createElement(b.a,{to:"/roster/"},r.a.createElement("span",null,"Roster")))];return r.a.createElement(S,{className:"app-header"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"app-title"},r.a.createElement(b.a,{to:"/"},"Cafe Employees Management System")),r.a.createElement(y.a,{className:"app-menu",mode:"horizontal",selectedKeys:[this.props.location.pathname],style:{lineHeight:"64px"}},e)))}}]),t}(n.Component),O=Object(g.a)(j),k=(a(333),a(235)),w=a.n(k),L=(a(336),a(157)),N=a.n(L),T=(a(121),a(74)),C=a.n(T),I=a(236),R=a(237),z=(a(354),a(41)),P=a.n(z),x="https://cafe-employee-management.herokuapp.com/api",A=function(e){var t=new Headers({"Content-Type":"application/json"});localStorage.getItem("accessToken")&&t.append("Authorization","Bearer "+localStorage.getItem("accessToken"));var a={headers:t};return e=Object.assign({},a,e),fetch(e.url,e).then(function(e){return e.json().then(function(t){return e.ok?t:Promise.reject(t)})})};function H(e,t){return A({url:"".concat(x,"/roster/load?from=").concat(e,"&to=").concat(t),method:"GET"})}function M(e){var t=new Date;return t.setTime(e),"".concat(t.getDate(),"-").concat(t.getMonth()+1,"-").concat(t.getFullYear())}function B(e){var t=new Date;return t.setTime(e),"".concat(t.getHours(),":").concat(t.getMinutes())}function G(e,t){var a=new Date(e),n=new Date(t);return a.getTime()>n.getTime()?M(n):M(a)}function J(e){var t=e.split("-");return"".concat(t[1],"-").concat(t[0],"-").concat(t[2])}function q(e,t){var a=new Date(+e),n=new Date;return t?a.setDate(a.getDate()-(a.getDay()||7)+1):a.setDate(a.getDate()-a.getDay()),n.setDate(a.getDate()+6),{firstDate:a,lastDate:n}}a(357),a(359);var F=a(156),K=a.n(F),V=a(234),Y=a.n(V),Q=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(l.a)(this,Object(m.a)(t).call(this))).loadData=function(){e.setState({isLoading:!0});var t=q(new Date,!1);Promise.all([A({url:"".concat(x,"/employee/load"),method:"GET"}),H(M(t.firstDate),M(t.lastDate))]).then(function(t){e.setState({employees:t[0],roster:t[1]?t[1]:{},events:t[1]&&t[1].shiftList?e.convertStringToDateInShiftList(t[1].shiftList):[],isLoading:!1})}).catch(function(e){P.a.error({message:"Roster",description:e,duration:2})})},e.convertStringToDateInShiftList=function(e){if(e)return e.map(function(e){return Object(R.a)({},e,{start:new Date(J(e.start)),end:new Date(J(e.end))})})},e.timeSelect=function(t){var a=t.start,n=t.end;e.enableSelectEmployee(),e.setState({events:Object(I.a)(e.state.events).concat([{start:a,end:n,title:"Please select an employee"}])}),P.a.info({message:"Roster",description:"Please select an employee for the selected shift!",duration:2})},e.enableSelectEmployee=function(){e.setState({isCalendarClickable:!1,isEmployeeSelectable:!0})},e.disableSelectEmployee=function(){e.setState({isCalendarClickable:!0,isEmployeeSelectable:!1})},e.employeeSelect=function(t){var a=e.state,n=a.events,r=a.roster,s=a.shiftList;if(n.length>0){var o=n[n.length-1];o.title="".concat(t.firstName," ").concat(t.lastName),o.employeeId=t.id,n[n.length-1]=o,r.fromDate=r.fromDate?G(o.start,r.fromDate):M(o.start),r.toDate=r.toDate?G(o.end,r.toDate):M(o.end),r.createdDate=M(new Date),s[M(o.start)]||(s[M(o.start)]=[]),s[M(o.start)].push({startTime:B(o.start),endTime:B(o.end),note:"",employeeId:t.id}),e.setState({events:n,roster:r,shiftList:s})}e.disableSelectEmployee()},e.updateShiftList=function(){var t=e.state,a=t.roster,n=t.events,r=t.shiftList;return n&&0!==n.length?(n.map(function(e){a.fromDate=a.fromDate?G(e.start,a.fromDate):M(e.start),a.toDate=a.toDate?G(e.end,a.toDate):M(e.end),r[M(e.start)]||(r[M(e.start)]=[]),r[M(e.start)].push({startTime:B(e.start),endTime:B(e.end),note:"",employeeId:e.id})}),console.log(r),r):[]},e.saveRoster=function(){var t,a,n=e.state,r=n.events,s=n.roster,o=n.shiftList;0!==r.length&&0!==o.length?(s.shiftList=[],Object.keys(o).map(function(e){s.shiftList.push({date:e,employeeShifts:o[e]})}),a=s,t=A({url:x+"/roster/create",method:"POST",body:JSON.stringify(a)}),e.setState({isLoading:!0}),t.then(function(e){e.success?P.a.success({message:"Roster",description:"Create roster successfully!",duration:5}):P.a.error({message:"Roster",description:e.message,duration:5})}).catch(function(e){P.a.error({message:"Roster",description:e,duration:5})})):P.a.error({message:"Roster",description:"Please select at least a shift and an employee for create roster!",duration:5})},e.onNavigate=function(t,a){var n=q(t,!1);e.setState({isLoading:!0}),H(M(n.firstDate),M(n.lastDate)).then(function(t){e.setState({roster:t||{},events:t.shiftList?e.convertStringToDateInShiftList(t.shiftList):[],isLoading:!1})}).catch(function(e){P.a.error({message:"Roster",description:e,duration:2})})},e.state={employees:[],events:[],isLoading:!1,isEmployeeSelectable:!1,isCalendarClickable:!0,roster:{fromDate:new Date,toDate:new Date,createDate:new Date},shiftList:{}},e}return Object(u.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.loadData()}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:""},r.a.createElement("h1",{className:"title"},"Roster"),r.a.createElement("div",{className:"desc"},r.a.createElement(K.a,{selectable:this.state.isCalendarClickable,localizer:K.a.momentLocalizer(Y.a),events:this.state.events,startAccessor:"start",endAccessor:"end",defaultView:"week",views:{week:!0},onSelectSlot:this.timeSelect,onNavigate:this.onNavigate})),r.a.createElement(w.a,{style:{position:"absolute",top:64,right:10},className:"employee-list-affix"},r.a.createElement("h2",null,"Employees"),r.a.createElement(N.a,{dataSource:this.state.employees,renderItem:function(t){return r.a.createElement(N.a.Item,null,r.a.createElement(C.a,{disabled:!e.state.isEmployeeSelectable,onClick:function(){e.employeeSelect(t)}},t.firstName))}})),r.a.createElement(C.a,{className:"go-back-btn",type:"primary",size:"large",onClick:this.saveRoster},"Save roster"))}}]),t}(n.Component),U=(a(560),function(e){function t(){return Object(c.a)(this,t),Object(l.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"page-not-found"},r.a.createElement("h1",{className:"title"},"404"),r.a.createElement("div",{className:"desc"},"The Page you're looking for was not found."),r.a.createElement(b.a,{to:"/"},r.a.createElement(C.a,{className:"go-back-btn",type:"primary",size:"large"},"Go Back")))}}]),t}(n.Component)),W=(a(175),a(155)),X=a.n(W);function Z(e){var t=r.a.createElement(D.a,{type:"loading-3-quarters",style:{fontSize:30},spin:!0});return r.a.createElement(X.a,{indicator:t,style:{display:"block",textAlign:"center",marginTop:30}})}var $=d.a.Content,_=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(l.a)(this,Object(m.a)(t).call(this,e))).state={isLoading:!1},a}return Object(u.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return this.state.isLoading?r.a.createElement(Z,null):r.a.createElement(d.a,{className:"app-container"},r.a.createElement(O,null),r.a.createElement($,{className:"app-content"},r.a.createElement("div",{className:"container"},r.a.createElement(p.a,null,r.a.createElement(h.a,{exact:!0,path:"/",render:function(e){return r.a.createElement(Q,e)}}),r.a.createElement(h.a,{component:U})))))}}]),t}(n.Component),ee=Object(g.a)(_),te=a(569);o.a.render(r.a.createElement(te.a,null,r.a.createElement(ee,null)),document.getElementById("root"))}},[[238,2,1]]]);
//# sourceMappingURL=main.9447b479.chunk.js.map