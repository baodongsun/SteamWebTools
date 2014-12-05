// ==UserScript==
// @include http://store.steampowered.com/checkout/*
// @include https://store.steampowered.com/checkout/*
// ==/UserScript==

(function(){
  
var langNo, steamLanguage = document.cookie.match(/(^|\s)Steam_Language=([^;]*)(;|window.$)/);
// [en,ru,cn][langNo]
switch(steamLanguage && steamLanguage[2]){
    case 'russian' : langNo = 1; break;
    case 'schinese' : langNo = 2; break;
    case 'tchinese' : langNo = 2; break;
    case 'simplified chinese' : langNo = 2; break;
    case 'traditional chinese' : langNo = 2; break; 
    default : langNo = 0;
}

function init() {
	var divs = document.querySelectorAll('.friend_block.disabled');
	if(!divs) return;
	var rbtns = document.querySelectorAll('.friend_block_radio input[disabled]');
	for (var i=0; i < divs.length; i++){
		divs[i].removeClassName('disabled');
		rbtns[i].disabled = false;
	}

	if(window.location.hash && window.location.hash.substr(1,9)=='multisend'){
		var gifts = window.location.hash.substr(11,window.location.hash.lenght);
		gifts = JSON.parse(decodeURIComponent(gifts))
		var el=document.querySelector('.checkout_tab');
		var gids=[], names=[], str='', i=0;
		for(x in gifts){
			gids.push(x);
			names.push(gifts[x]);
			str+='<p>'+gifts[x]+' <span id="giftN'+i+'"></span></p>';
			i++;
		}
		el.innerHTML='<p><b>' + ['the amount of the gifts : ','Гифты для отправки: ','发送的礼物数量: '][langNo] + gids.length+'</b></p>'+str+'';

		window.$('email_input').insertAdjacentHTML("afterEnd",
			'<br/><br/>' + [
				'It is available to input more than one email address, one email per row, if the number of the gifts is not more than the number of email, the gifts will be sent in order, otherwise the extra gifts will be sent to the last email address',
				'Если хотите отправить гифты на разыне Email введите их ниже по одному на строку. Гифты будут отправленны по порядку. Если гифтов больше чем адресов, оставшиеся гифты будут отправлены на последний адрес',
				'可以输入多个邮件地址, 每个一行, 如果要发送的礼物对应邮件地址低于每行一个, 礼物将按顺序被发送, 如果礼物数量超过邮件地址数量，超出的礼物将被发送到最后一个邮件地址.'
			][langNo] + '<br/><textarea id="emails" rows=3></textarea>'
		);

		var curGift = 0, emails=[];
		window.g_gidGift = gids[0];

		var SubmitGiftDeliveryForm_old = window.SubmitGiftDeliveryForm;
		window.SubmitGiftDeliveryForm = function(){
			if (!window.$('send_via_email').checked)
				return SubmitGiftDeliveryForm_old.apply(this, arguments);

			if (!window.$('emails').value)
				return SubmitGiftDeliveryForm_old.apply(this, arguments);

			emails = window.$('emails').value.split(/\r?\n/);

			if(emails.length){
				window.$('email_input').value = emails[0];
			}

			return SubmitGiftDeliveryForm_old.apply(this, arguments);

		}

		var OnSendGiftSuccess_old = window.OnSendGiftSuccess;
		window.OnSendGiftSuccess = function(){

			window.$('giftN'+curGift).innerHTML=['- send','- Отправлен','- 发送'][langNo];

			if(window.g_gidGift = gids[++curGift]){
				if(emails.length>1){
					window.$('email_input').value = emails[Math.min(curGift, (emails.length-1))]
				}

				window.SendGift();
			} else {
				OnSendGiftSuccess_old.apply(this, arguments);
			}
		}
	}

}

var state = window.document.readyState;
if((state == 'interactive')||(state == 'complete'))
	init();
else
	window.addEventListener("DOMContentLoaded", init,false);

})();
