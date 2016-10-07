window.onload=initialdelay;	


function initialdelay() {
	val1=-500;	 
	obj1=0;
	width=window.innerWidth-parseInt(document.getElementById('calendar').style.width);		
	width1=width*0.5;
	offset=0;
	sendajaxrequest();	
	setTimeout("bringinleft()",300);
}



function buttoneffect(element) {
	element.style.width=90;
	element.style.height=90;
	setTimeout( function() {
		element.style.width=100;
		element.style.height=100; },100);
	element.id=='left' ? takeoutleft() : takeoutright(); 
}	



function setobj() {
	obj1=document.getElementById('calendar');
}


function bringinleft() {
	setobj();	
	if(val1<=width1)
	{		
		add1=(width1-val1)/15;
		if(add1>0.042) {
			val1+=add1;
			obj1.style.left=val1;
			setTimeout(function() { bringinleft(); },1);
		}
		else { 	
			val1-=add1*24;
			setTimeout(function() { obj1.style.left=val1; },1);
		}
	}
}



function bringinright() {
	setobj();	
	if(val1<=width1)
	{		
		add1=(width1-val1)/15;
		if(add1>0.042){
			val1+=add1;
			obj1.style.left=width-val1;
			setTimeout(function() { bringinright(); },1);
		}
		else { 	
			val1-=add1*24;
			setTimeout(function() {obj1.style.left=width-val1;},1);
		}
	}
}



function takeoutright() {
	setobj();
	val1+=50;
	if(val1<width+300)
	{
		obj1.style.left=val1;
		setTimeout(function() { takeoutright() },1);
	}
	else {
		offset+=1;
		sendajaxrequest();
		val1=-500;
		bringinleft();
	}
}



function takeoutleft() {
	setobj();
	val1+=50;
	if(val1<width1+300)
	{
		obj1.style.left=width-val1;
		setTimeout(function() { takeoutleft() },1);
	}
	else {
		offset-=1;
		sendajaxrequest();
		val1=-500;
		bringinright();
	}
}

function sendajaxrequest() {
	xhr=new XMLHttpRequest();
	xhr.open("GET","ajaxhandler.php?o="+offset,true);
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




