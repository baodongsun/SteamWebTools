// ==UserScript==
// @include http://store.steampowered.com/cart*
// @include https://store.steampowered.com/cart*
// ==/UserScript==

(function(){
  
var langNo, steamLanguage = document.cookie.match(/(^|\s)Steam_Language=([^;]*)(;|$)/)[2];
// [en,ru,cn][langNo]
switch(steamLanguage){
    case 'russian' : langNo = 1; break;
    case 'schinese' : langNo = 2; break;
    case 'tchinese' : langNo = 2; break;
    default : langNo = 0;
}

function init() {
	var $ = window.jQuery, el = document.querySelector('.page_content > .rightcol');

	links = [
		{href:'javascript:document.cookie=\'shoppingCartGID=0; path=/\';location.href=\'/cart/\';', text:['Empty Cart','Очистить Корзину','清空购物车'][langNo]},
		{href:'https://store.steampowered.com/checkout/?purchasetype=gift#fastbuy',blank:1, text:['Fastbuy with Steam wallet','Быстро купить в инвентарь со Steam Wallet','快速用steam钱包购买'][langNo]},
	];

	el && el.insertAdjacentHTML('afterBegin', createBlock('Steam Web Tools', links));

	$('#addtocartsubids').bind('submit',function(){
		var t = $(this);
		var subids = t.find('input[name="subids"]').val();
		subids = subids.split(',');
		for (var i=0; i < subids.length; i++) {
			t.append('<input type="hidden" name="subid[]" value="'+subids[i].trim()+'"/>')
		}
	})
}



// block
function createBlock(title, links){
	var out='<div class="block">\
<div class="block_header"><h4>'+title+'</h4></div>\
<div class="block_content"><div class="block_content_inner">';

	var link;
	for (var i=0; i < links.length; i++) {
		link = links[i];
		out+='<a class="linkbar" href="'+link.href+'"'+(link.blank ? ' target="_blank"':'')+'><div class="rightblock">\
</div>'+link.text+'</a><br />'
	}

	out += ['Add SubID to cart','Добавить SubID\'ы в корзину','添加SubID到购物车'][langNo] + ': <form id="addtocartsubids" method="post"><input type="hidden" name="sessionid" value="'+decodeURIComponent(document.cookie.match(/(^|\s)sessionid=([^;]*)(;|$)/)[2])+'"><input type="hidden" name="action" value="add_to_cart"><input type="text" name="subids" placeholder="1, 2, 3"/><input type="submit" value="' + ['Add','Добавить','添加'][langNo] + '"></form></div></div></div>';

	return out;
}

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);
})();
