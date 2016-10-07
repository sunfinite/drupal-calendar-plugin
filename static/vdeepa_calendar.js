//$Id$;
/*Implementation of the initialDelay property*/

Drupal.behaviors.initialDelay=function () {	
		temp=$('#footer');
		$('#footer').remove();
		div_selected=null;
		calendar=$('#calendar');
		calwidth=parseInt(calendar.css('width'))
		width=parseInt($('#wrapper').css('width'))-calwidth;		
		stoppos=width*0.5;
		calendar.css('left',stoppos);
		$('.time_slot').mouseover(function() { if(!$(this).html()){ $(this).css('background','#808080')}});
		$('.time_slot').mouseout(function() {$(this).css('background','')});
		curpos=-calwidth;	 
/* The tip div had to be placed in the template for the popups-which are loaded during page load-*/
		temp=$('#tip');
		$('#tip').remove();
		$('body').prepend(temp);/*The removal and prepend is because the css gets messed up if its a part of the template*/
		offset=0;
		sendajaxrequest('load');	
		$('#right,#left').click(function() { buttoneffect(this); });
	//	setTimeout(function() { slidein('left'); },300);

}

function buttoneffect(element) {
	$(element).css('width',50);
	$(element).css('height',80);
	setTimeout(function() { $(element).css('width',60);
				$(element).css('height',90);
				 },100);
	element.id=='right' ? offset+=1 : offset-=1;
	sendajaxrequest();
//	setTimeout(function() {  element.id=='left' ? slideout('left') : slideout('right'); },300); 
		
}	

function slidein(direction) {
	if(curpos<=stoppos)
	{		
		add1=(stoppos-curpos)/5;
		if(add1>0.042) {
			curpos+=add1;
			direction=='left' ? calendar.css('left',curpos) : calendar.css('left',width-curpos);
			setTimeout(function() { slidein(direction); },1);
		}
		else { 
			curpos-=add1*24;
			setTimeout(function() { direction=='left' ? calendar.css('left',curpos) : calendar.css('left',width-curpos) },1);
		}
	}
}

function slideout(direction) {			
	curpos+=150;
	if(curpos<width+calwidth)
	{
		direction=='right' ? calendar.css('left',curpos) : calendar.css('left',width-curpos);
		setTimeout(function() { slideout(direction) },1);
	}
	else {	
		curpos=-calwidth;
		direction=='right' ? slidein('left') : slidein('right');
	}
}


function sendajaxrequest(load) {
	load=load||'';
	xhr=new XMLHttpRequest();
	url=Drupal.settings.basePath+'user/'+owner+'/ajaxhandler';
	xhr.open("GET",url+"?o="+offset+"&"+load,true);
	xhr.send();
	xhr.onreadystatechange=callback;
}
	

function callback() {
	if(xhr.readyState==4) { 
		alert(xhr.responseText);
		$('.marker').remove();
		//the response is a string which is converted to a JSON object 
		response=JSON.parse(xhr.responseText);
		//alert(JSON.stringify(response));
		$('#month_year').html(response['month_year']);
		for(i=1;i<=7;i++) {
			$('#date'+i).html(response['dates'][i]);
		}
		try {
		var markers=response['stuff'];
		for(var i=0;i<markers.length;i++) {
			var each_day=markers[i];
			for(var j=0;j<each_day.length;j++) {	
				var single_event=each_day[j]; 				
				var offset=single_event['offset'];				
				var display=single_event['display'];				
				var fromtime=single_event['time'];
				var hour=parseInt(fromtime.split(':')[0],10);
				var startpos=hour*2;
				var diff=1;			
				var min=parseInt(fromtime.split(':')[1],10);
				if(min>=30) 
					startpos+=1;
				if(totime=single_event['totime']) {
					hour=parseInt(totime.split(':')[0],10);
					var endpos=hour*2;
					min=parseInt(totime.split(':')[1],10);
					if(min>=30)
						endpos+=1;
					diff=endpos-startpos+1;
				}
				else totime='';
				var position=$('#'+offset+'-'+startpos).offset();
				var id=offset+'-'+startpos+'-'+single_event['nid'];
				var str="<div class='marker' id="+id+">";
				str+=display;
				str+="</div>";
				/*TODO:refactor*/
				$('body').append(str);
				var div=$('#'+id);				
				//alert($('.time_slot').height());-->This is off by 1 for some strange reason
				div.attr('repeat_offset',single_event['repeat_offset']);
				//alert(div.attr('repeat_offset'));
				div.height(30*diff);
				div.width($('.time_slot').width());
				div.css('left',position.left);
				div.css('top',position.top);
				div.addClass(single_event['type']);
				if(single_event['status']) 
					div.addClass(single_event['status']);
				}
			}
		}//end try
		finally {
		var cssclass='.time_slot';	
			if(owner!=viewer) {
				tip="<a href='javascript:placerequest()' id='place_request'>Place Request</a>";
				$("#tip").html(tip);
				cssclass='.marker:not(.requested)'; 
			}
		//alert(cssclass);
		$(cssclass).unbind("click").click(
			function() {
			var offset=$(this).offset();
			var tipleft=(offset.left)+'px';
			var tiptop=(offset.top-90)+'px';
			var $tip=$('#tip');
			div_selected=this;
			builddate(this);
			$tip.css({'top': tiptop, 'left': tipleft});
			$tip.animate({'top': '+=20px','opacity': 'toggle'},100);	
			}
			);				  		
		$('a').click(function(){ $('#tip').hide()});

		}//end finally	
	}
}

function builddate(obj) {
	var day_time=$(obj).attr('id').split('-');
	var date=response['year']+'-'+response['month']+'-'+response['dates'][day_time[0]];
	var time=parseInt(day_time[1]/2,10);
	day_time[1]%2? time+=':30' : time+=':00';
	$('.createnode').each( function() { $obj=$(this);
					    $obj.attr('href',Drupal.settings.basePath+'node/add/'+$obj.attr('type')+'?date='+date+' '+time)
			  		}	
			     );	
}
	
function placerequest() {
	Popups.open(
		new Popups.Popup(),
		Drupal.t('Are you sure?'),
		Drupal.t('<p>Message: </p><input id="request_message" type="text">'),
		{
		  'popup_confirm' : {
			title: Drupal.t('Confirm'),
			func: function() {
					var message= $('#request_message').attr('value'); 
					var nid=$(div_selected).attr('id').split('-').pop();
					var repeat_offset=$(div_selected).attr('repeat_offset');
					alert(repeat_offset);
					url=Drupal.settings.basePath+'user/'+owner+'/requesthandler';
					query='?nid='+nid+'&message='+message+'&repeat='+repeat_offset;
					xhr.open("GET",url+query,true);
					xhr.send();
					xhr.onreadystatechange=function() { 
				       				if(xhr.readyState==4) {
							         if(xhr.status==200) {
									if(parseInt(xhr.responseText)==1) {
								                Popups.close();	
										Popups.message("Request Sent","Keep your fingers crossed(x).");
									}
									else 	
										Popups.message("Oops","Ho Ho Ho! Dolphins on the server, try again");
								}
								 else 
								 	Popups.message("Oops","Ho Ho Ho! Dolphins on the server, try again")
								 }
								 };	
		  		}
		},
		  
		  'popup_cancel' : {
			title: Drupal.t('Cancel'),
			func: function() { Popups.close() } 
		  }
		}
	);
}

