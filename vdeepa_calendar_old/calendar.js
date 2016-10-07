window.onload=initialdelay;	

function initialdelay() {
	curpos=-500;	 
	obj=null;
	width=window.innerWidth-parseInt(document.getElementById('calendar').style.width);		
	stoppos=width*0.5;
	offset=0;
	sendajaxrequest();	
	setTimeout(function() { slidein('left'); },300);
}



function buttoneffect(element) {
	element.style.width=90;
	element.style.height=90;
	setTimeout(function() { element.style.width=100; element.style.height=100; },100);
	element.id=='left' ? slideout('left') : slideout('right'); 
}	

function setobj() {
	obj=document.getElementById('calendar');
}


function slidein(direction) {
	setobj();	
	if(curpos<=stoppos)
	{		
		add1=(stoppos-curpos)/15;
		if(add1>0.042) {
			curpos+=add1;
			direction=='left' ? obj.style.left=curpos : obj.style.left=width-curpos;
			setTimeout(function() { slidein(direction); },1);
		}
		else { 	
			curpos-=add1*24;
			setTimeout(function() { direction=='left' ? obj.style.left=curpos : obj.style.left=width-curpos; },1);
		}
	}
}

function slideout(direction) {
	setobj();
	curpos+=50;
	if(curpos<width+300)
	{
		direction=='right' ? obj.style.left=curpos : obj.style.left=width-curpos;
		setTimeout(function() { slideout(direction) },1);
	}
	else {
		direction=='right' ? offset+=1 : offset-=1;
		sendajaxrequest();
		curpos=-500;
		direction=='right' ? slidein('left') : slidein('right');
	}
}


function sendajaxrequest() {
	xhr=new XMLHttpRequest();
	xhr.open("GET","ajaxhandler?o="+offset,true);
	xhr.send();
	xhr.onreadystatechange=callback;
}
	

function callback() {
	if(xhr.readyState==4) { 
		response=JSON.parse(xhr.responseText);//the response is a string which is converted to a JSON object
		document.getElementById('month_year').innerHTML=response['month_year'];
		for(i=1;i<=7;i++) {
			document.getElementById('date'+i).innerHTML=response['dates'][i];
		}
	}
}




