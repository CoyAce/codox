import{a as te,b as se}from"./chunk-ZWOIQVFE.mjs";import{b as ee}from"./chunk-7EQ4C65P.mjs";import{e as Qt,m as Zt}from"./chunk-KIEMEOLO.mjs";import{L as O,P as jt,Q as Wt,R as zt,S as Kt,T as Xt,U as Jt,V as qt,X as C,b}from"./chunk-LXRGKPZR.mjs";import{a as l}from"./chunk-CPXVQKWD.mjs";var Lt=function(){var t=l(function($,a,c,n){for(c=c||{},n=$.length;n--;c[$[n]]=a);return c},"o"),e=[1,2],s=[1,3],o=[1,4],r=[2,4],d=[1,9],u=[1,11],f=[1,16],S=[1,17],m=[1,18],E=[1,19],D=[1,32],P=[1,20],R=[1,21],p=[1,22],I=[1,23],v=[1,24],B=[1,26],F=[1,27],w=[1,28],G=[1,29],et=[1,30],st=[1,31],it=[1,34],rt=[1,35],nt=[1,36],at=[1,37],q=[1,33],g=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],ot=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],Ut=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],_t={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,classDef:38,CLASSDEF_ID:39,CLASSDEF_STYLEOPTS:40,DEFAULT:41,style:42,STYLE_IDS:43,STYLEDEF_STYLEOPTS:44,class:45,CLASSENTITY_IDS:46,STYLECLASS:47,direction_tb:48,direction_bt:49,direction_rl:50,direction_lr:51,eol:52,";":53,EDGE_STATE:54,STYLE_SEPARATOR:55,left_of:56,right_of:57,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"classDef",39:"CLASSDEF_ID",40:"CLASSDEF_STYLEOPTS",41:"DEFAULT",42:"style",43:"STYLE_IDS",44:"STYLEDEF_STYLEOPTS",45:"class",46:"CLASSENTITY_IDS",47:"STYLECLASS",48:"direction_tb",49:"direction_bt",50:"direction_rl",51:"direction_lr",53:";",54:"EDGE_STATE",55:"STYLE_SEPARATOR",56:"left_of",57:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[52,1],[52,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:l(function(a,c,n,y,T,i,Q){var h=i.length-1;switch(T){case 3:return y.setRootDoc(i[h]),i[h];break;case 4:this.$=[];break;case 5:i[h]!="nl"&&(i[h-1].push(i[h]),this.$=i[h-1]);break;case 6:case 7:this.$=i[h];break;case 8:this.$="nl";break;case 12:this.$=i[h];break;case 13:let lt=i[h-1];lt.description=y.trimColon(i[h]),this.$=lt;break;case 14:this.$={stmt:"relation",state1:i[h-2],state2:i[h]};break;case 15:let ct=y.trimColon(i[h]);this.$={stmt:"relation",state1:i[h-3],state2:i[h-1],description:ct};break;case 19:this.$={stmt:"state",id:i[h-3],type:"default",description:"",doc:i[h-1]};break;case 20:var V=i[h],z=i[h-2].trim();if(i[h].match(":")){var Z=i[h].split(":");V=Z[0],z=[z,Z[1]]}this.$={stmt:"state",id:V,type:"default",description:z};break;case 21:this.$={stmt:"state",id:i[h-3],type:"default",description:i[h-5],doc:i[h-1]};break;case 22:this.$={stmt:"state",id:i[h],type:"fork"};break;case 23:this.$={stmt:"state",id:i[h],type:"join"};break;case 24:this.$={stmt:"state",id:i[h],type:"choice"};break;case 25:this.$={stmt:"state",id:y.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:i[h-1].trim(),note:{position:i[h-2].trim(),text:i[h].trim()}};break;case 29:this.$=i[h].trim(),y.setAccTitle(this.$);break;case 30:case 31:this.$=i[h].trim(),y.setAccDescription(this.$);break;case 32:case 33:this.$={stmt:"classDef",id:i[h-1].trim(),classes:i[h].trim()};break;case 34:this.$={stmt:"style",id:i[h-1].trim(),styleClass:i[h].trim()};break;case 35:this.$={stmt:"applyClass",id:i[h-1].trim(),styleClass:i[h].trim()};break;case 36:y.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 37:y.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 38:y.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 39:y.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 42:case 43:this.$={stmt:"state",id:i[h].trim(),type:"default",description:""};break;case 44:this.$={stmt:"state",id:i[h-2].trim(),classes:[i[h].trim()],type:"default",description:""};break;case 45:this.$={stmt:"state",id:i[h-2].trim(),classes:[i[h].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:e,5:s,6:o},{1:[3]},{3:5,4:e,5:s,6:o},{3:6,4:e,5:s,6:o},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,42,45,48,49,50,51,54],r,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:d,5:u,8:8,9:10,10:12,11:13,12:14,13:15,16:f,17:S,19:m,22:E,24:D,25:P,26:R,27:p,28:I,29:v,32:25,33:B,35:F,37:w,38:G,42:et,45:st,48:it,49:rt,50:nt,51:at,54:q},t(g,[2,5]),{9:38,10:12,11:13,12:14,13:15,16:f,17:S,19:m,22:E,24:D,25:P,26:R,27:p,28:I,29:v,32:25,33:B,35:F,37:w,38:G,42:et,45:st,48:it,49:rt,50:nt,51:at,54:q},t(g,[2,7]),t(g,[2,8]),t(g,[2,9]),t(g,[2,10]),t(g,[2,11]),t(g,[2,12],{14:[1,39],15:[1,40]}),t(g,[2,16]),{18:[1,41]},t(g,[2,18],{20:[1,42]}),{23:[1,43]},t(g,[2,22]),t(g,[2,23]),t(g,[2,24]),t(g,[2,25]),{30:44,31:[1,45],56:[1,46],57:[1,47]},t(g,[2,28]),{34:[1,48]},{36:[1,49]},t(g,[2,31]),{39:[1,50],41:[1,51]},{43:[1,52]},{46:[1,53]},t(ot,[2,42],{55:[1,54]}),t(ot,[2,43],{55:[1,55]}),t(g,[2,36]),t(g,[2,37]),t(g,[2,38]),t(g,[2,39]),t(g,[2,6]),t(g,[2,13]),{13:56,24:D,54:q},t(g,[2,17]),t(Ut,r,{7:57}),{24:[1,58]},{24:[1,59]},{23:[1,60]},{24:[2,46]},{24:[2,47]},t(g,[2,29]),t(g,[2,30]),{40:[1,61]},{40:[1,62]},{44:[1,63]},{47:[1,64]},{24:[1,65]},{24:[1,66]},t(g,[2,14],{14:[1,67]}),{4:d,5:u,8:8,9:10,10:12,11:13,12:14,13:15,16:f,17:S,19:m,21:[1,68],22:E,24:D,25:P,26:R,27:p,28:I,29:v,32:25,33:B,35:F,37:w,38:G,42:et,45:st,48:it,49:rt,50:nt,51:at,54:q},t(g,[2,20],{20:[1,69]}),{31:[1,70]},{24:[1,71]},t(g,[2,32]),t(g,[2,33]),t(g,[2,34]),t(g,[2,35]),t(ot,[2,44]),t(ot,[2,45]),t(g,[2,15]),t(g,[2,19]),t(Ut,r,{7:72}),t(g,[2,26]),t(g,[2,27]),{4:d,5:u,8:8,9:10,10:12,11:13,12:14,13:15,16:f,17:S,19:m,21:[1,73],22:E,24:D,25:P,26:R,27:p,28:I,29:v,32:25,33:B,35:F,37:w,38:G,42:et,45:st,48:it,49:rt,50:nt,51:at,54:q},t(g,[2,21])],defaultActions:{5:[2,1],6:[2,2],46:[2,46],47:[2,47]},parseError:l(function(a,c){if(c.recoverable)this.trace(a);else{var n=new Error(a);throw n.hash=c,n}},"parseError"),parse:l(function(a){var c=this,n=[0],y=[],T=[null],i=[],Q=this.table,h="",V=0,z=0,Z=0,lt=2,ct=1,ke=i.slice.call(arguments,1),_=Object.create(this.lexer),U={yy:{}};for(var Dt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Dt)&&(U.yy[Dt]=this.yy[Dt]);_.setInput(a,U.yy),U.yy.lexer=_,U.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var kt=_.yylloc;i.push(kt);var xe=_.options&&_.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Ye(A){n.length=n.length-2*A,T.length=T.length-A,i.length=i.length-A}l(Ye,"popStack");function Ae(){var A;return A=y.pop()||_.lex()||ct,typeof A!="number"&&(A instanceof Array&&(y=A,A=y.pop()),A=c.symbols_[A]||A),A}l(Ae,"lex");for(var k,xt,H,L,Me,At,K={},ht,N,Ht,dt;;){if(H=n[n.length-1],this.defaultActions[H]?L=this.defaultActions[H]:((k===null||typeof k>"u")&&(k=Ae()),L=Q[H]&&Q[H][k]),typeof L>"u"||!L.length||!L[0]){var Ct="";dt=[];for(ht in Q[H])this.terminals_[ht]&&ht>lt&&dt.push("'"+this.terminals_[ht]+"'");_.showPosition?Ct="Parse error on line "+(V+1)+`:
`+_.showPosition()+`
Expecting `+dt.join(", ")+", got '"+(this.terminals_[k]||k)+"'":Ct="Parse error on line "+(V+1)+": Unexpected "+(k==ct?"end of input":"'"+(this.terminals_[k]||k)+"'"),this.parseError(Ct,{text:_.match,token:this.terminals_[k]||k,line:_.yylineno,loc:kt,expected:dt})}if(L[0]instanceof Array&&L.length>1)throw new Error("Parse Error: multiple actions possible at state: "+H+", token: "+k);switch(L[0]){case 1:n.push(k),T.push(_.yytext),i.push(_.yylloc),n.push(L[1]),k=null,xt?(k=xt,xt=null):(z=_.yyleng,h=_.yytext,V=_.yylineno,kt=_.yylloc,Z>0&&Z--);break;case 2:if(N=this.productions_[L[1]][1],K.$=T[T.length-N],K._$={first_line:i[i.length-(N||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(N||1)].first_column,last_column:i[i.length-1].last_column},xe&&(K._$.range=[i[i.length-(N||1)].range[0],i[i.length-1].range[1]]),At=this.performAction.apply(K,[h,z,V,U.yy,L[1],T,i].concat(ke)),typeof At<"u")return At;N&&(n=n.slice(0,-1*N*2),T=T.slice(0,-1*N),i=i.slice(0,-1*N)),n.push(this.productions_[L[1]][0]),T.push(K.$),i.push(K._$),Ht=Q[n[n.length-2]][n[n.length-1]],n.push(Ht);break;case 3:return!0}}return!0},"parse")},De=function(){var $={EOF:1,parseError:l(function(c,n){if(this.yy.parser)this.yy.parser.parseError(c,n);else throw new Error(c)},"parseError"),setInput:l(function(a,c){return this.yy=c||this.yy||{},this._input=a,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:l(function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.match+=a,this.matched+=a;var c=a.match(/(?:\r\n?|\n).*/g);return c?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},"input"),unput:l(function(a){var c=a.length,n=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-c),this.offset-=c;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var T=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===y.length?this.yylloc.first_column:0)+y[y.length-n.length].length-n[0].length:this.yylloc.first_column-c},this.options.ranges&&(this.yylloc.range=[T[0],T[0]+this.yyleng-c]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(a){this.unput(this.match.slice(a))},"less"),pastInput:l(function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(function(){var a=this.pastInput(),c=new Array(a.length+1).join("-");return a+this.upcomingInput()+`
`+c+"^"},"showPosition"),test_match:l(function(a,c){var n,y,T;if(this.options.backtrack_lexer&&(T={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(T.yylloc.range=this.yylloc.range.slice(0))),y=a[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+a[0].length},this.yytext+=a[0],this.match+=a[0],this.matches=a,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(a[0].length),this.matched+=a[0],n=this.performAction.call(this,this.yy,this,c,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var i in T)this[i]=T[i];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,c,n,y;this._more||(this.yytext="",this.match="");for(var T=this._currentRules(),i=0;i<T.length;i++)if(n=this._input.match(this.rules[T[i]]),n&&(!c||n[0].length>c[0].length)){if(c=n,y=i,this.options.backtrack_lexer){if(a=this.test_match(n,T[i]),a!==!1)return a;if(this._backtrack){c=!1;continue}else return!1}else if(!this.options.flex)break}return c?(a=this.test_match(c,T[y]),a!==!1?a:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var c=this.next();return c||this.lex()},"lex"),begin:l(function(c){this.conditionStack.push(c)},"begin"),popState:l(function(){var c=this.conditionStack.length-1;return c>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(c){return c=this.conditionStack.length-1-Math.abs(c||0),c>=0?this.conditionStack[c]:"INITIAL"},"topState"),pushState:l(function(c){this.begin(c)},"pushState"),stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(function(c,n,y,T){var i=T;switch(y){case 0:return 41;case 1:return 48;case 2:return 49;case 3:return 50;case 4:return 51;case 5:break;case 6:break;case 7:return 5;case 8:break;case 9:break;case 10:break;case 11:break;case 12:return this.pushState("SCALE"),17;break;case 13:return 18;case 14:this.popState();break;case 15:return this.begin("acc_title"),33;break;case 16:return this.popState(),"acc_title_value";break;case 17:return this.begin("acc_descr"),35;break;case 18:return this.popState(),"acc_descr_value";break;case 19:this.begin("acc_descr_multiline");break;case 20:this.popState();break;case 21:return"acc_descr_multiline_value";case 22:return this.pushState("CLASSDEF"),38;break;case 23:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";break;case 24:return this.popState(),this.pushState("CLASSDEFID"),39;break;case 25:return this.popState(),40;break;case 26:return this.pushState("CLASS"),45;break;case 27:return this.popState(),this.pushState("CLASS_STYLE"),46;break;case 28:return this.popState(),47;break;case 29:return this.pushState("STYLE"),42;break;case 30:return this.popState(),this.pushState("STYLEDEF_STYLES"),43;break;case 31:return this.popState(),44;break;case 32:return this.pushState("SCALE"),17;break;case 33:return 18;case 34:this.popState();break;case 35:this.pushState("STATE");break;case 36:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),25;break;case 37:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),26;break;case 38:return this.popState(),n.yytext=n.yytext.slice(0,-10).trim(),27;break;case 39:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),25;break;case 40:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),26;break;case 41:return this.popState(),n.yytext=n.yytext.slice(0,-10).trim(),27;break;case 42:return 48;case 43:return 49;case 44:return 50;case 45:return 51;case 46:this.pushState("STATE_STRING");break;case 47:return this.pushState("STATE_ID"),"AS";break;case 48:return this.popState(),"ID";break;case 49:this.popState();break;case 50:return"STATE_DESCR";case 51:return 19;case 52:this.popState();break;case 53:return this.popState(),this.pushState("struct"),20;break;case 54:break;case 55:return this.popState(),21;break;case 56:break;case 57:return this.begin("NOTE"),29;break;case 58:return this.popState(),this.pushState("NOTE_ID"),56;break;case 59:return this.popState(),this.pushState("NOTE_ID"),57;break;case 60:this.popState(),this.pushState("FLOATING_NOTE");break;case 61:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";break;case 62:break;case 63:return"NOTE_TEXT";case 64:return this.popState(),"ID";break;case 65:return this.popState(),this.pushState("NOTE_TEXT"),24;break;case 66:return this.popState(),n.yytext=n.yytext.substr(2).trim(),31;break;case 67:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),31;break;case 68:return 6;case 69:return 6;case 70:return 16;case 71:return 54;case 72:return 24;case 73:return n.yytext=n.yytext.trim(),14;break;case 74:return 15;case 75:return 28;case 76:return 55;case 77:return 5;case 78:return"INVALID"}},"anonymous"),rules:[/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[9,10],inclusive:!1},struct:{rules:[9,10,22,26,29,35,42,43,44,45,54,55,56,57,71,72,73,74,75],inclusive:!1},FLOATING_NOTE_ID:{rules:[64],inclusive:!1},FLOATING_NOTE:{rules:[61,62,63],inclusive:!1},NOTE_TEXT:{rules:[66,67],inclusive:!1},NOTE_ID:{rules:[65],inclusive:!1},NOTE:{rules:[58,59,60],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[31],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[30],inclusive:!1},CLASS_STYLE:{rules:[28],inclusive:!1},CLASS:{rules:[27],inclusive:!1},CLASSDEFID:{rules:[25],inclusive:!1},CLASSDEF:{rules:[23,24],inclusive:!1},acc_descr_multiline:{rules:[20,21],inclusive:!1},acc_descr:{rules:[18],inclusive:!1},acc_title:{rules:[16],inclusive:!1},SCALE:{rules:[13,14,33,34],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[48],inclusive:!1},STATE_STRING:{rules:[49,50],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[9,10,36,37,38,39,40,41,46,47,51,52,53],inclusive:!1},ID:{rules:[9,10],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,10,11,12,15,17,19,22,26,29,32,35,53,57,68,69,70,71,72,73,74,76,77,78],inclusive:!0}}};return $}();_t.lexer=De;function bt(){this.yy={}}return l(bt,"Parser"),bt.prototype=_t,_t.Parser=bt,new bt}();Lt.parser=Lt;var Be=Lt;var ie="TB",ut="TB",It="dir",Y="state",j="root",tt="relation",re="classDef",ne="style",ae="applyClass",W="default",St="divider",Rt="fill:none",vt="fill: #333",Nt="c",Ot="text",Pt="normal",pt="rect",ft="rectWithTitle",oe="stateStart",le="stateEnd",wt="divider",Gt="roundedWithTitle",ce="note",he="noteGroup",X="statediagram",Ce="state",de=`${X}-${Ce}`,$t="transition",Le="note",Ie="note-edge",ue=`${$t} ${Ie}`,Se=`${X}-${Le}`,Re="cluster",pe=`${X}-${Re}`,ve="cluster-alt",fe=`${X}-${ve}`,Yt="parent",Mt="note",ge="state",gt="----",ye=`${gt}${Mt}`,Bt=`${gt}${Yt}`;var Ft=l((t,e=ut)=>{if(!t.doc)return e;let s=e;for(let o of t.doc)o.stmt==="dir"&&(s=o.value);return s},"getDir"),Ne=l(function(t,e){return e.db.getClasses()},"getClasses"),Oe=l(async function(t,e,s,o){b.info("REF0:"),b.info("Drawing state diagram (v2)",e);let{securityLevel:r,state:d,layout:u}=C();o.db.extract(o.db.getRootDocV2());let f=o.db.getData(),S=te(e,r);f.type=o.type,f.layoutAlgorithm=u,f.nodeSpacing=d?.nodeSpacing||50,f.rankSpacing=d?.rankSpacing||50,f.markers=["barb"],f.diagramId=e,await ee(f,S);let m=8;Zt.insertTitle(S,"statediagramTitleText",d?.titleTopMargin??25,o.db.getDiagramTitle()),se(S,m,X,d?.useMaxWidth??!0)},"draw"),qe={getClasses:Ne,draw:Oe,getDir:Ft};var mt=new Map,M=0;function Vt(t="",e=0,s="",o=gt){let r=s!==null&&s.length>0?`${o}${s}`:"";return`${ge}-${t}${r}-${e}`}l(Vt,"stateDomId");var Pe=l((t,e,s,o,r,d,u,f)=>{b.trace("items",e),e.forEach(S=>{switch(S.stmt){case Y:J(t,S,s,o,r,d,u,f);break;case W:J(t,S,s,o,r,d,u,f);break;case tt:{J(t,S.state1,s,o,r,d,u,f),J(t,S.state2,s,o,r,d,u,f);let m={id:"edge"+M,start:S.state1.id,end:S.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Rt,labelStyle:"",label:O.sanitizeText(S.description??"",C()),arrowheadStyle:vt,labelpos:Nt,labelType:Ot,thickness:Pt,classes:$t,look:u};r.push(m),M++}break}})},"setupDoc"),me=l((t,e=ut)=>{let s=e;if(t.doc)for(let o of t.doc)o.stmt==="dir"&&(s=o.value);return s},"getDir");function yt(t,e,s){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(r=>{let d=s.get(r);d&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...d.styles])}));let o=t.find(r=>r.id===e.id);o?Object.assign(o,e):t.push(e)}l(yt,"insertOrUpdateNode");function we(t){return t?.classes?.join(" ")??""}l(we,"getClassesFromDbInfo");function Ge(t){return t?.styles??[]}l(Ge,"getStylesFromDbInfo");var J=l((t,e,s,o,r,d,u,f)=>{let S=e.id,m=s.get(S),E=we(m),D=Ge(m),P=C();if(b.info("dataFetcher parsedItem",e,m,D),S!=="root"){let R=pt;e.start===!0?R=oe:e.start===!1&&(R=le),e.type!==W&&(R=e.type),mt.get(S)||mt.set(S,{id:S,shape:R,description:O.sanitizeText(S,P),cssClasses:`${E} ${de}`,cssStyles:D});let p=mt.get(S);e.description&&(Array.isArray(p.description)?(p.shape=ft,p.description.push(e.description)):p.description?.length&&p.description.length>0?(p.shape=ft,p.description===S?p.description=[e.description]:p.description=[p.description,e.description]):(p.shape=pt,p.description=e.description),p.description=O.sanitizeTextOrArray(p.description,P)),p.description?.length===1&&p.shape===ft&&(p.type==="group"?p.shape=Gt:p.shape=pt),!p.type&&e.doc&&(b.info("Setting cluster for XCX",S,me(e)),p.type="group",p.isGroup=!0,p.dir=me(e),p.shape=e.type===St?wt:Gt,p.cssClasses=`${p.cssClasses} ${pe} ${d?fe:""}`);let I={labelStyle:"",shape:p.shape,label:p.description,cssClasses:p.cssClasses,cssCompiledStyles:[],cssStyles:p.cssStyles,id:S,dir:p.dir,domId:Vt(S,M),type:p.type,isGroup:p.type==="group",padding:8,rx:10,ry:10,look:u};if(I.shape===wt&&(I.label=""),t&&t.id!=="root"&&(b.trace("Setting node ",S," to be child of its parent ",t.id),I.parentId=t.id),I.centerLabel=!0,e.note){let v={labelStyle:"",shape:ce,label:e.note.text,cssClasses:Se,cssStyles:[],cssCompiledStyles:[],id:S+ye+"-"+M,domId:Vt(S,M,Mt),type:p.type,isGroup:p.type==="group",padding:P.flowchart?.padding,look:u,position:e.note.position},B=S+Bt,F={labelStyle:"",shape:he,label:e.note.text,cssClasses:p.cssClasses,cssStyles:[],id:S+Bt,domId:Vt(S,M,Yt),type:"group",isGroup:!0,padding:16,look:u,position:e.note.position};M++,F.id=B,v.parentId=B,yt(o,F,f),yt(o,v,f),yt(o,I,f);let w=S,G=v.id;e.note.position==="left of"&&(w=v.id,G=S),r.push({id:w+"-"+G,start:w,end:G,arrowhead:"none",arrowTypeEnd:"",style:Rt,labelStyle:"",classes:ue,arrowheadStyle:vt,labelpos:Nt,labelType:Ot,thickness:Pt,look:u})}else yt(o,I,f)}e.doc&&(b.trace("Adding nodes children "),Pe(e,e.doc,s,o,r,!d,u,f))},"dataFetcher"),Te=l(()=>{mt.clear(),M=0},"reset");var x={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Ee=l(()=>new Map,"newClassesList"),_e=l(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),Tt=l(t=>JSON.parse(JSON.stringify(t)),"clone"),Et=class Et{constructor(e){this.version=e;this.nodes=[];this.edges=[];this.rootDoc=[];this.classes=Ee();this.documents={root:_e()};this.currentDocument=this.documents.root;this.startEndCount=0;this.dividerCnt=0;this.getAccTitle=zt;this.setAccTitle=Wt;this.getAccDescription=Xt;this.setAccDescription=Kt;this.setDiagramTitle=Jt;this.getDiagramTitle=qt;this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}extract(e){this.clear(!0);for(let r of Array.isArray(e)?e:e.doc)switch(r.stmt){case Y:this.addState(r.id.trim(),r.type,r.doc,r.description,r.note);break;case tt:this.addRelation(r.state1,r.state2,r.description);break;case re:this.addStyleClass(r.id.trim(),r.classes);break;case ne:this.handleStyleDef(r);break;case ae:this.setCssClass(r.id.trim(),r.styleClass);break}let s=this.getStates(),o=C();Te(),J(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,o.look,this.classes);for(let r of this.nodes)if(Array.isArray(r.label)){if(r.description=r.label.slice(1),r.isGroup&&r.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${r.id}]`);r.label=r.label[0]}}handleStyleDef(e){let s=e.id.trim().split(","),o=e.styleClass.split(",");for(let r of s){let d=this.getState(r);if(!d){let u=r.trim();this.addState(u),d=this.getState(u)}d&&(d.styles=o.map(u=>u.replace(/;/g,"")?.trim()))}}setRootDoc(e){b.info("Setting root doc",e),this.rootDoc=e,this.version===1?this.extract(e):this.extract(this.getRootDocV2())}docTranslator(e,s,o){if(s.stmt===tt){this.docTranslator(e,s.state1,!0),this.docTranslator(e,s.state2,!1);return}if(s.stmt===Y&&(s.id===x.START_NODE?(s.id=e.id+(o?"_start":"_end"),s.start=o):s.id=s.id.trim()),s.stmt!==j&&s.stmt!==Y||!s.doc)return;let r=[],d=[];for(let u of s.doc)if(u.type===St){let f=Tt(u);f.doc=Tt(d),r.push(f),d=[]}else d.push(u);if(r.length>0&&d.length>0){let u={stmt:Y,id:Qt(),type:"divider",doc:Tt(d)};r.push(Tt(u)),s.doc=r}s.doc.forEach(u=>this.docTranslator(s,u,!0))}getRootDocV2(){return this.docTranslator({id:j,stmt:j},{id:j,stmt:j,doc:this.rootDoc},!0),{id:j,doc:this.rootDoc}}addState(e,s=W,o=void 0,r=void 0,d=void 0,u=void 0,f=void 0,S=void 0){let m=e?.trim();if(!this.currentDocument.states.has(m))b.info("Adding state ",m,r),this.currentDocument.states.set(m,{stmt:Y,id:m,descriptions:[],type:s,doc:o,note:d,classes:[],styles:[],textStyles:[]});else{let E=this.currentDocument.states.get(m);if(!E)throw new Error(`State not found: ${m}`);E.doc||(E.doc=o),E.type||(E.type=s)}if(r&&(b.info("Setting state description",m,r),(Array.isArray(r)?r:[r]).forEach(D=>this.addDescription(m,D.trim()))),d){let E=this.currentDocument.states.get(m);if(!E)throw new Error(`State not found: ${m}`);E.note=d,E.note.text=O.sanitizeText(E.note.text,C())}u&&(b.info("Setting state classes",m,u),(Array.isArray(u)?u:[u]).forEach(D=>this.setCssClass(m,D.trim()))),f&&(b.info("Setting state styles",m,f),(Array.isArray(f)?f:[f]).forEach(D=>this.setStyle(m,D.trim()))),S&&(b.info("Setting state styles",m,f),(Array.isArray(S)?S:[S]).forEach(D=>this.setTextStyle(m,D.trim())))}clear(e){this.nodes=[],this.edges=[],this.documents={root:_e()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Ee(),e||jt()}getState(e){return this.currentDocument.states.get(e)}getStates(){return this.currentDocument.states}logDocuments(){b.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}startIdIfNeeded(e=""){return e===x.START_NODE?(this.startEndCount++,`${x.START_TYPE}${this.startEndCount}`):e}startTypeIfNeeded(e="",s=W){return e===x.START_NODE?x.START_TYPE:s}endIdIfNeeded(e=""){return e===x.END_NODE?(this.startEndCount++,`${x.END_TYPE}${this.startEndCount}`):e}endTypeIfNeeded(e="",s=W){return e===x.END_NODE?x.END_TYPE:s}addRelationObjs(e,s,o=""){let r=this.startIdIfNeeded(e.id.trim()),d=this.startTypeIfNeeded(e.id.trim(),e.type),u=this.startIdIfNeeded(s.id.trim()),f=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(r,d,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.addState(u,f,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:r,id2:u,relationTitle:O.sanitizeText(o,C())})}addRelation(e,s,o){if(typeof e=="object"&&typeof s=="object")this.addRelationObjs(e,s,o);else if(typeof e=="string"&&typeof s=="string"){let r=this.startIdIfNeeded(e.trim()),d=this.startTypeIfNeeded(e),u=this.endIdIfNeeded(s.trim()),f=this.endTypeIfNeeded(s);this.addState(r,d),this.addState(u,f),this.currentDocument.relations.push({id1:r,id2:u,relationTitle:o?O.sanitizeText(o,C()):void 0})}}addDescription(e,s){let o=this.currentDocument.states.get(e),r=s.startsWith(":")?s.replace(":","").trim():s;o?.descriptions?.push(O.sanitizeText(r,C()))}cleanupLabel(e){return e.startsWith(":")?e.slice(2).trim():e.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(e,s=""){this.classes.has(e)||this.classes.set(e,{id:e,styles:[],textStyles:[]});let o=this.classes.get(e);s&&o&&s.split(x.STYLECLASS_SEP).forEach(r=>{let d=r.replace(/([^;]*);/,"$1").trim();if(RegExp(x.COLOR_KEYWORD).exec(r)){let f=d.replace(x.FILL_KEYWORD,x.BG_FILL).replace(x.COLOR_KEYWORD,x.FILL_KEYWORD);o.textStyles.push(f)}o.styles.push(d)})}getClasses(){return this.classes}setCssClass(e,s){e.split(",").forEach(o=>{let r=this.getState(o);if(!r){let d=o.trim();this.addState(d),r=this.getState(d)}r?.classes?.push(s)})}setStyle(e,s){this.getState(e)?.styles?.push(s)}setTextStyle(e,s){this.getState(e)?.textStyles?.push(s)}getDirectionStatement(){return this.rootDoc.find(e=>e.stmt===It)}getDirection(){return this.getDirectionStatement()?.value??ie}setDirection(e){let s=this.getDirectionStatement();s?s.value=e:this.rootDoc.unshift({stmt:It,value:e})}trimColon(e){return e.startsWith(":")?e.slice(1).trim():e.trim()}getData(){let e=C();return{nodes:this.nodes,edges:this.edges,other:{},config:e,direction:Ft(this.getRootDocV2())}}getConfig(){return C().state}};l(Et,"StateDB"),Et.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3};var be=Et;var $e=l(t=>`
defs #statediagram-barbEnd {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}
`,"getStyles"),gs=$e;export{Be as a,qe as b,be as c,gs as d};
