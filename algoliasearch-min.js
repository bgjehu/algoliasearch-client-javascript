var AlgoliaSearch=function(d,c,b,e){this.applicationID=d;this.apiKey=c;for(var a=0;a<b.length;++a){if(Math.random()>0.5){this.hosts.reverse()}if(!_.isUndefined(e)&&(e==="https"||e==="HTTPS")){this.hosts.push("https://"+b[a])}else{this.hosts.push("http://"+b[a])}}if(Math.random()>0.5){this.hosts.reverse()}};AlgoliaSearch.prototype={deleteIndex:function(b,c){var a=this;this._jsonRequest({method:"DELETE",url:"/1/indexes/"+encodeURIComponent(b),callback:function(f,e,d){if(!_.isUndefined(c)){c(f,d)}}})},listIndexes:function(b){var a=this;this._jsonRequest({method:"GET",url:"/1/indexes/",callback:function(e,d,c){if(!_.isUndefined(b)){b(e,c)}}})},initIndex:function(a){return new this.Index(this,a)},listUserKeys:function(b){var a=this;this._jsonRequest({method:"GET",url:"/1/keys",callback:function(e,d,c){if(!_.isUndefined(b)){b(e,c)}}})},getUserKeyACL:function(a,c){var b=this;this._jsonRequest({method:"GET",url:"/1/keys/"+a,callback:function(f,e,d){if(!_.isUndefined(c)){c(f,d)}}})},deleteUserKey:function(a,c){var b=this;this._jsonRequest({method:"DELETE",url:"/1/keys/"+a,callback:function(f,e,d){if(!_.isUndefined(c)){c(f,d)}}})},addUserKey:function(c,d){var b=this;var a=new Object();a.acl=c;this._jsonRequest({method:"POST",url:"/1/keys",body:a,callback:function(g,f,e){if(!_.isUndefined(d)){d(g,e)}}})},startQueriesBatch:function(){this.batch=[]},addQueryInBatch:function(d,b,a){var c="query="+b;if(!_.isUndefined(a)&&a!=null){c=this._getSearchParams(a,c)}this.batch.push({indexName:d,params:c})},sendQueriesBatch:function(g,c,b){var a=this;var f={requests:[],apiKey:this.apiKey,appID:this.applicationID};for(var d=0;d<a.batch.length;++d){f.requests.push(a.batch[d])}window.clearTimeout(a.onDelayTrigger);if(!_.isUndefined(c)&&c!=null&&c>0){var e=window.setTimeout(function(){this._sendQueriesBatch(a,f,g,b)},c);a.onDelayTrigger=e}else{this._sendQueriesBatch(a,f,g,b)}},Index:function(a,b){this.indexName=b;this.as=a},_sendQueriesBatch:function(a,c,d,b){a._jsonRequest({cache:a.cache,method:"POST",url:"/1/indexes/*/queries",body:c,callback:function(l,h,e){if(l&&!_.isUndefined(b)&&b!=null){for(var g in e.results){for(var f in e.results[g].hits){var k=new b();_.extend(k,e.results[g].hits[f]);e.results[g].hits[f]=k}}}if(!_.isUndefined(d)){d(l,e)}}})},_jsonRequest:function(d){var c=this;var f=d.callback;var b=null;var e=d.url;if(!_.isUndefined(d.body)){e=d.url+"_body_"+JSON.stringify(d.body)}if(!_.isUndefined(d.cache)){b=d.cache;if(!_.isUndefined(b[e])){f(true,b[e],b[e]);return}}var a=function(h){var g=0;if(!_.isUndefined(h)){g=h}if(c.hosts.length<=g){f(false,null,{message:"Cannot contact server"});return}d.callback=function(k,j,i){if(!_.isUndefined(d.cache)){b[e]=i}if(!k&&(g+1)<c.hosts.length){a(g+1)}else{f(k,j,i)}};d.hostname=c.hosts[g];c._jsonRequestByHost(d)};a()},_jsonRequestByHost:function(d){var a=null;if(!_.isUndefined(d.body)){a=JSON.stringify(d.body)}var c=d.hostname+d.url;var b=null;b=new XMLHttpRequest();if("withCredentials" in b){b.open(d.method,c,true);b.setRequestHeader("X-Algolia-API-Key",this.apiKey);b.setRequestHeader("X-Algolia-Application-Id",this.applicationID);if(a!=null){b.setRequestHeader("Content-type","application/json")}}else{if(typeof XDomainRequest!="undefined"){b=new XDomainRequest();b.open(d.method,c)}else{console.log("your browser is too old to support CORS requests")}}b.send(a);b.onload=function(e){if(!_.isUndefined(e)){var f=(e.target.status===200||e.target.status===201);d.callback(f,e.target,e.target.response!=null?JSON.parse(e.target.response):null)}else{d.callback(true,e,JSON.parse(b.responseText))}}},_getSearchParams:function(a,c){if(_.isUndefined(a)||a==null){return c}for(var b in a){if(b!=null&&a.hasOwnProperty(b)){c+=(c.length==0)?"?":"&";c+=b+"="+encodeURIComponent(a[b])}}return c},applicationID:null,apiKey:null,hosts:[],cache:{}};AlgoliaSearch.prototype.Index.prototype={addObject:function(b,d,c){var a=this;if(_.isUndefined(c)){this.as._jsonRequest({action:"addObject",url:"/1/indexes/"+encodeURIComponent(a.indexName),body:b,callback:function(g,f,e){if(!_.isUndefined(d)){d(g,e)}}})}else{this.as._jsonRequest({method:"PUT",url:"/1/indexes/"+encodeURIComponent(a.indexName)+"/"+c,body:b,callback:function(g,f,e){if(!_.isUndefined(d)){d(g,e)}}})}},addObjects:function(e,f){var d=this;var a={requests:[]};for(var b=0;b<e.length;++b){var c={action:"addObject",body:e[b]};a.requests.push(c)}this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(d.indexName)+"/batch",body:a,callback:function(i,h,g){if(!_.isUndefined(f)){f(i,g)}}})},getObject:function(g,f,a,b){var d=this;var e="";if(!_.isUndefined(a)){e="?attributes=";for(var c=0;c<a.length;++c){if(c!=0){e+=","}e+=a[c]}}this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(d.indexName)+"/"+encodeURIComponent(g)+e,callback:function(k,i,h){if(!_.isUndefined(b)&&b!=null){var j=new b();_.extend(j,h);h=j}if(!_.isUndefined(f)){f(k,h)}}})},partialUpdateObject:function(c,b){var a=this;this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(a.indexName)+"/"+encodeURIComponent(c.objectID)+"/partial",body:c,callback:function(f,e,d){if(!_.isUndefined(b)){b(f,d)}}})},saveObject:function(a,c){var b=this;this.as._jsonRequest({method:"PUT",url:"/1/indexes/"+encodeURIComponent(b.indexName)+"/"+encodeURIComponent(a.objectID),body:a,callback:function(f,e,d){if(!_.isUndefined(c)){c(f,d)}}})},saveObjects:function(e,f){var d=this;var a={requests:[]};for(var b=0;b<e.length;++b){var c={action:"updateObject",objectID:encodeURIComponent(e[b].objectID),body:e[b]};a.requests.push(c)}this.as._jsonRequest({method:"POST",url:"/1/indexes/"+encodeURIComponent(d.indexName)+"/batch",body:a,callback:function(i,h,g){if(!_.isUndefined(f)){f(i,g)}}})},deleteObject:function(c,b){var a=this;this.as._jsonRequest({method:"DELETE",url:"/1/indexes/"+encodeURIComponent(a.indexName)+"/"+encodeURIComponent(c),callback:function(f,e,d){if(!_.isUndefined(b)){b(f,d)}}})},search:function(f,h,c,b,a){var e=this;var g="query="+encodeURIComponent(f);if(!_.isUndefined(c)&&c!=null){g=this.as._getSearchParams(c,g)}window.clearTimeout(e.onDelayTrigger);if(!_.isUndefined(b)&&b!=null&&b>0){var d=window.setTimeout(function(){this._search(e,g,h,a)},b);e.onDelayTrigger=d}else{this._search(e,g,h,a)}},waitTask:function(a,c){var b=this;this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(b.indexName)+"/task/"+a,callback:function(f,e,d){if(f&&d.status==="published"){c(true,d)}else{if(f&&d.pendingTask){return b.waitTask(a,c)}else{c(false,d)}}}})},getSettings:function(b){var a=this;this.as._jsonRequest({method:"GET",url:"/1/indexes/"+encodeURIComponent(a.indexName)+"/settings",callback:function(e,d,c){if(!_.isUndefined(b)){b(e,c)}}})},setSettings:function(a,c){var b=this;this.as._jsonRequest({method:"PUT",url:"/1/indexes/"+encodeURIComponent(b.indexName)+"/settings",body:a,callback:function(f,e,d){if(!_.isUndefined(c)){c(f,d)}}})},_search:function(b,c,d,a){b.as._jsonRequest({cache:b.cache,method:"POST",url:"/1/indexes/"+encodeURIComponent(b.indexName)+"/query",body:{params:c,apiKey:b.as.apiKey,appID:b.as.applicationID},callback:function(j,g,e){if(j&&!_.isUndefined(a)&&a!=null){for(var f in e.hits){var h=new a();_.extend(h,e.hits[f]);e.hits[f]=h}}if(!_.isUndefined(d)){d(j,e)}}})},as:null,indexName:null,cache:{},emptyConstructor:function(){}};(function(){var ai=this,ac=ai._,ae={},ar=Array.prototype,ab=Object.prototype,an=Function.prototype,aw=ar.push,ah=ar.slice,au=ar.concat,ak=ab.toString,aq=ab.hasOwnProperty,ad=ar.forEach,ag=ar.map,ao=ar.reduce,aa=ar.reduceRight,at=ar.filter,ap=ar.every,aj=ar.some,X=ar.indexOf,av=ar.lastIndexOf,Y=Array.isArray,ax=Object.keys,am=an.bind,Z=function(a){return a instanceof Z?a:this instanceof Z?(this._wrapped=a,void 0):new Z(a)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=Z),exports._=Z):ai._=Z,Z.VERSION="1.4.4";var W=Z.each=Z.forEach=function(h,f,g){if(null!=h){if(ad&&h.forEach===ad){h.forEach(f,g)}else{if(h.length===+h.length){for(var c=0,d=h.length;d>c;c++){if(f.call(g,h[c],c,h)===ae){return}}}else{for(var b in h){if(Z.has(h,b)&&f.call(g,h[b],b,h)===ae){return}}}}}};Z.map=Z.collect=function(d,a,b){var c=[];return null==d?c:ag&&d.map===ag?d.map(a,b):(W(d,function(g,e,f){c[c.length]=a.call(b,g,e,f)}),c)};var H="Reduce of empty array with no initial value";Z.reduce=Z.foldl=Z.inject=function(f,b,c,d){var a=arguments.length>2;if(null==f&&(f=[]),ao&&f.reduce===ao){return d&&(b=Z.bind(b,d)),a?f.reduce(b,c):f.reduce(b)}if(W(f,function(h,g,e){a?c=b.call(d,c,h,g,e):(c=h,a=!0)}),!a){throw new TypeError(H)}return c},Z.reduceRight=Z.foldr=function(j,f,g,h){var c=arguments.length>2;if(null==j&&(j=[]),aa&&j.reduceRight===aa){return h&&(f=Z.bind(f,h)),c?j.reduceRight(f,g):j.reduceRight(f)}var d=j.length;if(d!==+d){var b=Z.keys(j);d=b.length}if(W(j,function(e,i,a){i=b?b[--d]:--d,c?g=f.call(h,g,j[i],i,a):(g=j[i],c=!0)}),!c){throw new TypeError(H)}return g},Z.find=Z.detect=function(d,a,b){var c;return Q(d,function(g,e,f){return a.call(b,g,e,f)?(c=g,!0):void 0}),c},Z.filter=Z.select=function(d,a,b){var c=[];return null==d?c:at&&d.filter===at?d.filter(a,b):(W(d,function(g,e,f){a.call(b,g,e,f)&&(c[c.length]=g)}),c)},Z.reject=function(c,a,b){return Z.filter(c,function(g,f,d){return !a.call(b,g,f,d)},b)},Z.every=Z.all=function(d,b,c){b||(b=Z.identity);var a=!0;return null==d?a:ap&&d.every===ap?d.every(b,c):(W(d,function(g,f,e){return(a=a&&b.call(c,g,f,e))?void 0:ae}),!!a)};var Q=Z.some=Z.any=function(d,b,c){b||(b=Z.identity);var a=!1;return null==d?a:aj&&d.some===aj?d.some(b,c):(W(d,function(g,f,e){return a||(a=b.call(c,g,f,e))?ae:void 0}),!!a)};Z.contains=Z.include=function(b,a){return null==b?!1:X&&b.indexOf===X?b.indexOf(a)!=-1:Q(b,function(c){return c===a})},Z.invoke=function(d,a){var b=ah.call(arguments,2),c=Z.isFunction(a);return Z.map(d,function(e){return(c?a:e[a]).apply(e,b)})},Z.pluck=function(b,a){return Z.map(b,function(c){return c[a]})},Z.where=function(c,a,b){return Z.isEmpty(a)?b?null:[]:Z[b?"find":"filter"](c,function(e){for(var d in a){if(a[d]!==e[d]){return !1}}return !0})},Z.findWhere=function(b,a){return Z.where(b,a,!0)},Z.max=function(d,a,b){if(!a&&Z.isArray(d)&&d[0]===+d[0]&&65535>d.length){return Math.max.apply(Math,d)}if(!a&&Z.isEmpty(d)){return -1/0}var c={computed:-1/0,value:-1/0};return W(d,function(h,f,g){var e=a?a.call(b,h,f,g):h;e>=c.computed&&(c={value:h,computed:e})}),c.value},Z.min=function(d,a,b){if(!a&&Z.isArray(d)&&d[0]===+d[0]&&65535>d.length){return Math.min.apply(Math,d)}if(!a&&Z.isEmpty(d)){return 1/0}var c={computed:1/0,value:1/0};return W(d,function(h,f,g){var e=a?a.call(b,h,f,g):h;c.computed>e&&(c={value:h,computed:e})}),c.value},Z.shuffle=function(d){var a,b=0,c=[];return W(d,function(e){a=Z.random(b++),c[b-1]=c[a],c[a]=e}),c};var al=function(a){return Z.isFunction(a)?a:function(b){return b[a]}};Z.sortBy=function(d,a,b){var c=al(a);return Z.pluck(Z.map(d,function(g,f,e){return{value:g,index:f,criteria:c.call(b,g,f,e)}}).sort(function(i,f){var g=i.criteria,h=f.criteria;if(g!==h){if(g>h||g===void 0){return 1}if(h>g||h===void 0){return -1}}return i.index<f.index?-1:1}),"value")};var P=function(g,c,d,f){var a={},b=al(c||Z.identity);return W(g,function(h,e){var i=b.call(d,h,e,g);f(a,i,h)}),a};Z.groupBy=function(c,a,b){return P(c,a,b,function(f,d,e){(Z.has(f,d)?f[d]:f[d]=[]).push(e)})},Z.countBy=function(c,a,b){return P(c,a,b,function(e,d){Z.has(e,d)||(e[d]=0),e[d]++})},Z.sortedIndex=function(k,f,g,h){g=null==g?Z.identity:al(g);for(var c=g.call(h,f),d=0,b=k.length;b>d;){var j=d+b>>>1;c>g.call(h,k[j])?d=j+1:b=j}return d},Z.toArray=function(a){return a?Z.isArray(a)?ah.call(a):a.length===+a.length?Z.map(a,Z.identity):Z.values(a):[]},Z.size=function(a){return null==a?0:a.length===+a.length?a.length:Z.keys(a).length},Z.first=Z.head=Z.take=function(c,a,b){return null==c?void 0:null==a||b?c[0]:ah.call(c,0,a)},Z.initial=function(c,a,b){return ah.call(c,0,c.length-(null==a||b?1:a))},Z.last=function(c,a,b){return null==c?void 0:null==a||b?c[c.length-1]:ah.call(c,Math.max(c.length-a,0))},Z.rest=Z.tail=Z.drop=function(c,a,b){return ah.call(c,null==a||b?1:a)},Z.compact=function(a){return Z.filter(a,Z.identity)};var G=function(c,a,b){return W(c,function(d){Z.isArray(d)?a?aw.apply(b,d):G(d,a,b):b.push(d)}),b};Z.flatten=function(b,a){return G(b,a,[])},Z.without=function(a){return Z.difference(a,ah.call(arguments,1))},Z.uniq=Z.unique=function(j,f,g,h){Z.isFunction(f)&&(h=g,g=f,f=!1);var c=g?Z.map(j,g,h):j,d=[],b=[];return W(c,function(a,i){(f?i&&b[b.length-1]===a:Z.contains(b,a))||(b.push(a),d.push(j[i]))}),d},Z.union=function(){return Z.uniq(au.apply(ar,arguments))},Z.intersection=function(b){var a=ah.call(arguments,1);return Z.filter(Z.uniq(b),function(c){return Z.every(a,function(d){return Z.indexOf(d,c)>=0})})},Z.difference=function(b){var a=au.apply(ar,ah.call(arguments,1));return Z.filter(b,function(c){return !Z.contains(a,c)})},Z.zip=function(){for(var d=ah.call(arguments),a=Z.max(Z.pluck(d,"length")),b=Array(a),c=0;a>c;c++){b[c]=Z.pluck(d,""+c)}return b},Z.object=function(f,b){if(null==f){return{}}for(var c={},d=0,a=f.length;a>d;d++){b?c[f[d]]=b[d]:c[f[d][0]]=f[d][1]}return c},Z.indexOf=function(f,b,c){if(null==f){return -1}var d=0,a=f.length;if(c){if("number"!=typeof c){return d=Z.sortedIndex(f,b),f[d]===b?d:-1}d=0>c?Math.max(0,a+c):c}if(X&&f.indexOf===X){return f.indexOf(b,c)}for(;a>d;d++){if(f[d]===b){return d}}return -1},Z.lastIndexOf=function(f,b,c){if(null==f){return -1}var d=null!=c;if(av&&f.lastIndexOf===av){return d?f.lastIndexOf(b,c):f.lastIndexOf(b)}for(var a=d?c:f.length;a--;){if(f[a]===b){return a}}return -1},Z.range=function(g,c,d){1>=arguments.length&&(c=g||0,g=0),d=arguments[2]||1;for(var f=Math.max(Math.ceil((c-g)/d),0),a=0,b=Array(f);f>a;){b[a++]=g,g+=d}return b},Z.bind=function(c,a){if(c.bind===am&&am){return am.apply(c,ah.call(arguments,1))}var b=ah.call(arguments,2);return function(){return c.apply(a,b.concat(ah.call(arguments)))}},Z.partial=function(b){var a=ah.call(arguments,1);return function(){return b.apply(this,a.concat(ah.call(arguments)))}},Z.bindAll=function(b){var a=ah.call(arguments,1);return 0===a.length&&(a=Z.functions(b)),W(a,function(c){b[c]=Z.bind(b[c],b)}),b},Z.memoize=function(c,a){var b={};return a||(a=Z.identity),function(){var d=a.apply(this,arguments);return Z.has(b,d)?b[d]:b[d]=c.apply(this,arguments)}},Z.delay=function(c,a){var b=ah.call(arguments,2);return setTimeout(function(){return c.apply(null,b)},a)},Z.defer=function(a){return Z.delay.apply(Z,[a,1].concat(ah.call(arguments,1)))},Z.throttle=function(k,f){var g,h,c,d,b=0,j=function(){b=new Date,c=null,d=k.apply(g,h)};return function(){var e=new Date,a=f-(e-b);return g=this,h=arguments,0>=a?(clearTimeout(c),c=null,b=e,d=k.apply(g,h)):c||(c=setTimeout(j,a)),d}},Z.debounce=function(f,b,c){var d,a;return function(){var g=this,e=arguments,h=function(){d=null,c||(a=f.apply(g,e))},j=c&&!d;return clearTimeout(d),d=setTimeout(h,b),j&&(a=f.apply(g,e)),a}},Z.once=function(c){var a,b=!1;return function(){return b?a:(b=!0,a=c.apply(this,arguments),c=null,a)}},Z.wrap=function(b,a){return function(){var c=[b];return aw.apply(c,arguments),a.apply(this,c)}},Z.compose=function(){var a=arguments;return function(){for(var b=arguments,c=a.length-1;c>=0;c--){b=[a[c].apply(this,b)]}return b[0]}},Z.after=function(b,a){return 0>=b?a():function(){return 1>--b?a.apply(this,arguments):void 0}},Z.keys=ax||function(c){if(c!==Object(c)){throw new TypeError("Invalid object")}var a=[];for(var b in c){Z.has(c,b)&&(a[a.length]=b)}return a},Z.values=function(c){var a=[];for(var b in c){Z.has(c,b)&&a.push(c[b])}return a},Z.pairs=function(c){var a=[];for(var b in c){Z.has(c,b)&&a.push([b,c[b]])}return a},Z.invert=function(c){var a={};for(var b in c){Z.has(c,b)&&(a[c[b]]=b)}return a},Z.functions=Z.methods=function(c){var a=[];for(var b in c){Z.isFunction(c[b])&&a.push(b)}return a.sort()},Z.extend=function(a){return W(ah.call(arguments,1),function(b){if(b){for(var c in b){a[c]=b[c]}}}),a},Z.pick=function(c){var a={},b=au.apply(ar,ah.call(arguments,1));return W(b,function(d){d in c&&(a[d]=c[d])}),a},Z.omit=function(d){var b={},c=au.apply(ar,ah.call(arguments,1));for(var a in d){Z.contains(c,a)||(b[a]=d[a])}return b},Z.defaults=function(a){return W(ah.call(arguments,1),function(b){if(b){for(var c in b){null==a[c]&&(a[c]=b[c])}}}),a},Z.clone=function(a){return Z.isObject(a)?Z.isArray(a)?a.slice():Z.extend({},a):a},Z.tap=function(b,a){return a(b),b};var L=function(g,q,b,k){if(g===q){return 0!==g||1/g==1/q}if(null==g||null==q){return g===q}g instanceof Z&&(g=g._wrapped),q instanceof Z&&(q=q._wrapped);var p=ak.call(g);if(p!=ak.call(q)){return !1}switch(p){case"[object String]":return g==q+"";case"[object Number]":return g!=+g?q!=+q:0==g?1/g==1/q:g==+q;case"[object Date]":case"[object Boolean]":return +g==+q;case"[object RegExp]":return g.source==q.source&&g.global==q.global&&g.multiline==q.multiline&&g.ignoreCase==q.ignoreCase}if("object"!=typeof g||"object"!=typeof q){return !1}for(var h=b.length;h--;){if(b[h]==g){return k[h]==q}}b.push(g),k.push(q);var m=0,d=!0;if("[object Array]"==p){if(m=g.length,d=m==q.length){for(;m--&&(d=L(g[m],q[m],b,k));){}}}else{var l=g.constructor,j=q.constructor;if(l!==j&&!(Z.isFunction(l)&&l instanceof l&&Z.isFunction(j)&&j instanceof j)){return !1}for(var v in g){if(Z.has(g,v)&&(m++,!(d=Z.has(q,v)&&L(g[v],q[v],b,k)))){break}}if(d){for(v in q){if(Z.has(q,v)&&!m--){break}}d=!m}}return b.pop(),k.pop(),d};Z.isEqual=function(b,a){return L(b,a,[],[])},Z.isEmpty=function(b){if(null==b){return !0}if(Z.isArray(b)||Z.isString(b)){return 0===b.length}for(var a in b){if(Z.has(b,a)){return !1}}return !0},Z.isElement=function(a){return !(!a||1!==a.nodeType)},Z.isArray=Y||function(a){return"[object Array]"==ak.call(a)},Z.isObject=function(a){return a===Object(a)},W(["Arguments","Function","String","Number","Date","RegExp"],function(a){Z["is"+a]=function(b){return ak.call(b)=="[object "+a+"]"}}),Z.isArguments(arguments)||(Z.isArguments=function(a){return !(!a||!Z.has(a,"callee"))}),"function"!=typeof/./&&(Z.isFunction=function(a){return"function"==typeof a}),Z.isFinite=function(a){return isFinite(a)&&!isNaN(parseFloat(a))},Z.isNaN=function(a){return Z.isNumber(a)&&a!=+a},Z.isBoolean=function(a){return a===!0||a===!1||"[object Boolean]"==ak.call(a)},Z.isNull=function(a){return null===a},Z.isUndefined=function(a){return a===void 0},Z.has=function(b,a){return aq.call(b,a)},Z.noConflict=function(){return ai._=ac,this},Z.identity=function(a){return a},Z.times=function(f,b,c){for(var d=Array(f),a=0;f>a;a++){d[a]=b.call(c,a)}return d},Z.random=function(b,a){return null==a&&(a=b,b=0),b+Math.floor(Math.random()*(a-b+1))};var K={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};K.unescape=Z.invert(K.escape);var C={escape:RegExp("["+Z.keys(K.escape).join("")+"]","g"),unescape:RegExp("("+Z.keys(K.unescape).join("|")+")","g")};Z.each(["escape","unescape"],function(a){Z[a]=function(b){return null==b?"":(""+b).replace(C[a],function(c){return K[a][c]})}}),Z.result=function(c,a){if(null==c){return null}var b=c[a];return Z.isFunction(b)?b.call(c):b},Z.mixin=function(a){W(Z.functions(a),function(b){var c=Z[b]=a[b];Z.prototype[b]=function(){var d=[this._wrapped];return aw.apply(d,arguments),U.call(this,c.apply(Z,d))}})};var J=0;Z.uniqueId=function(b){var a=++J+"";return b?b+a:a},Z.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var z=/(.)^/,af={"'":"'","\\":"\\","\r":"r","\n":"n","    ":"t","\u2028":"u2028","\u2029":"u2029"},V=/\\|'|\r|\n|\t|\u2028|\u2029/g;Z.template=function(f,m,b){var h;b=Z.defaults({},b,Z.templateSettings);var l=RegExp([(b.escape||z).source,(b.interpolate||z).source,(b.evaluate||z).source].join("|")+"|$","g"),g=0,k="__p+='";f.replace(l,function(c,i,n,a,p){return k+=f.slice(g,p).replace(V,function(e){return"\\"+af[e]}),i&&(k+="'+\n((__t=("+i+"))==null?'':_.escape(__t))+\n'"),n&&(k+="'+\n((__t=("+n+"))==null?'':__t)+\n'"),a&&(k+="';\n"+a+"\n__p+='"),g=p+c.length,c}),k+="';\n",b.variable||(k="with(obj||{}){\n"+k+"}\n"),k="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+k+"return __p;\n";try{h=Function(b.variable||"obj","_",k)}catch(d){throw d.source=k,d}if(m){return h(m,Z)}var j=function(a){return h.call(this,a,Z)};return j.source="function("+(b.variable||"obj")+"){\n"+k+"}",j},Z.chain=function(a){return Z(a).chain()};var U=function(a){return this._chain?Z(a).chain():a};Z.mixin(Z),W(["pop","push","reverse","shift","sort","splice","unshift"],function(b){var a=ar[b];Z.prototype[b]=function(){var c=this._wrapped;return a.apply(c,arguments),"shift"!=b&&"splice"!=b||0!==c.length||delete c[0],U.call(this,c)}}),W(["concat","join","slice"],function(b){var a=ar[b];Z.prototype[b]=function(){return U.call(this,a.apply(this._wrapped,arguments))}}),Z.extend(Z.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
