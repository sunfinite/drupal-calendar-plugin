
$(document).ready(function() {
   
   var $calendar = $('#calendar');
   var id = 10;
   var render_callback = null;
   var render_start = null;
   var own_calendar = false;
   var selected_event = true;
   if(Drupal.settings.owner == Drupal.settings.viewer) 
   	own_calendar = true;

   own_calendar ? $('#calendar').prepend('<a href='+Drupal.settings.basePath+'user/'+Drupal.settings.owner+'/calendar/requests>Requests</a>') : $calendar.prepend('<p>Click on a slot to place request</p>');


   $('#edit-preview').hide();
   $('#edit-preview-1').hide();
   
   $('#close-tip').mouseover( function() { $(this).css('color','blue') });
   $('#close-tip').mouseout( function() { $(this).css('color','red') });   
   $('#close-tip').click( function() { $('#tip').hide(); $('#calendar').weekCalendar('removeUnsavedEvents'); });

   $('#appointment-link').mouseover( function() { if(selected_event) $(this).css('color','blue') });   
   $('#appointment-link').mouseout( function() { if(selected_event) $(this).css('color','red') });

   $('#appointment-link').click( function() { 
		   	if(selected_event) { 
				   selected_event = false;
				   $('#tip-event').hide();
				   $(this).css('color','black');
				   $('#event-link').css('color','red');
				   $('#tip-appointment').show();
				   }
		  }); 

   $('#event-link').mouseover( function() { if(!selected_event) $(this).css('color','blue') });   
   $('#event-link').mouseout( function() { if(!selected_event) $(this).css('color','red') });

   $('#event-link').click( function() { 
		   	if(!selected_event) { 
				   selected_event = true;
				   $('#tip-appointment').hide();
				   $(this).css('color','black');
				   $('#appointment-link').css('color','red');
				   $('#tip-event').show();
				   }
		  }); 

      $calendar.weekCalendar({
      timeslotsPerHour : 4,
      allowCalEventOverlap : true,
      overlapEventsSeparate: true,
      firstDayOfWeek : 1,
      businessHours :{start: 0, end: 24, limitDisplay: true },
      daysToShow : 7,
      height : function($calendar) {
         return $(window).height() - $("h1").outerHeight() - 1;
      },
      eventRender : function(calEvent, $event) {
         if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css("backgroundColor", "#aaa");
            $event.find(".wc-time").css({
               "backgroundColor" : "#999",
               "border" : "1px solid #888"
            });
         }
      },
      draggable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },
      resizable : function(calEvent, $event) {
         return calEvent.readOnly != true;
      },

      eventNew : function(calEvent, $event,e) { 	
	
	if(own_calendar) {
         
         var $dialogContent = $("#tip");
	 $dialogContent.css('display','none');
	 $dialogContent.css({'top':e.pageY-140, 'left':e.pageX - 64 });
	 $dialogContent.fadeIn('slow');

	 this.setFields('field_eventdate', $dialogContent, calEvent);
	 this.setFields('field_appointmentdate', $dialogContent, calEvent);
	}
	else $('#calendar').weekCalendar('removeUnsavedEvents');
      },

      setFields : function(fieldName, $dialogContent, calEvent) {      
	//from date 
	 $dialogContent.find("select[name='" + fieldName + "[value][month]']").val(calEvent.start.getMonth()+1);
	 $dialogContent.find("select[name='" + fieldName + "[value2][month]']").val(calEvent.end.getMonth()+1);
	 $dialogContent.find("select[name='" + fieldName + "[value][day]']").val(calEvent.start.getDate());
	 $dialogContent.find("select[name='" + fieldName + "[value2][day]']").val(calEvent.end.getDate());
	 $dialogContent.find("select[name='" + fieldName + "[value][year]']").val(calEvent.start.getFullYear()); 
	 $dialogContent.find("select[name='" + fieldName + "[value2][year]']").val(calEvent.end.getFullYear()); 

	 //to date ..disable...can be done with form_alter
	 $dialogContent.find("select[name='" + fieldName + "[value2][month]']").attr('disabled','disabled');
	 $dialogContent.find("select[name='" + fieldName + "[value2][day]']").attr('disabled','disabled');
	 $dialogContent.find("select[name='" + fieldName + "[value2][year]']").attr('disabled','disabled');

	 this.adjustAndSelect($dialogContent, calEvent.start.getHours(),calEvent.start.getMinutes(),'value', fieldName); 
	 this.adjustAndSelect($dialogContent, calEvent.end.getHours(),calEvent.end.getMinutes(),'value2', fieldName);  
        },

      adjustAndSelect: function($dialogContent, hourValue, minutes, value, fieldName) { 
		$hour = $dialogContent.find("select[name='" + fieldName + "[" + value + "][hour]']");
		if($hour.find("option[value=13]").length)
         	       $hour.val(hourValue);
	        else {
		
		$amPm = $dialogContent.find("select[name='" + fieldName + "[" + value + "][ampm]']");
		$hour.val(hourValue % 12);
		hourValue >= 12 ? $amPm.val("pm") : $amPm.val("am");
		if(hourValue == 12 || hourValue == 0) 
		       	$hour.val('12')  
		 }
		 if(minutes < 10) 
		    minutes = '0'+minutes;
	         $dialogContent.find("select[name='" +fieldName + "[" + value + "][minute]']").val(minutes);
	},

      eventDrop : function(calEvent, $event) {	
		this.saveUpdate(calEvent);
      },

      eventResize : function(calEvent, $event) {
		this.saveUpdate(calEvent);
      },

      saveUpdate : function(calEvent) {

	var date = calEvent.start.getFullYear() + '/' +  (calEvent.start.getMonth() + 1) + '/' + calEvent.start.getDate();
	
//using timestamps will make it simpler...but there seems to be a mismatch between php and javascript representation FIXME

	var data = 'nid=' + calEvent.id + '&repeat=' + calEvent.repeat_offset + '&date=' + date + '&from=' + calEvent.start.getHours() +':' + calEvent.start.getMinutes() + '&to=' + calEvent.end.getHours() + ':' + calEvent.end.getMinutes();
//TODO:write for failed updates.
       	$.ajax({
		type: 'GET',
	        url: Drupal.settings.basePath+'user/'+Drupal.settings.owner+'/updatehandler',
		data: data,	
		});	
		
     },

      eventClick : function(calEvent, $event) {
	
        if(! own_calendar && calEvent.end.getTime() > new Date().getTime()) {
	 	var $dialogContent = $("#placerequest");
         	resetForm($dialogContent);

         	$dialogContent.dialog({
            		modal: true,
            		title: "Place Request",
            		close: function() {
               			$dialogContent.dialog("destroy");
		       $dialogContent.hide();
		       //$('#calendar').weekCalendar("removeUnsavedEvents");
		     },
		    buttons: {
		      "Confirm" : function() {
				var url = Drupal.settings.basePath + 'user/' + Drupal.settings.owner + '/requesthandler';
				var data = 'nid='+ calEvent.id +'&message=' + $('#request_message').attr('value') + '&repeat='+ calEvent.repeat_offset;
				$.ajax({
					url: url,
					data: data,
					success: function() { 
					
					     $dialogContent.dialog("close"); 
					     $('<p> You will be notified when your request is accepted. </p>').dialog({
						      title: "Request Sent",
						      buttons: {
						      "Close" : function() {
							   $(this).dialog('close')
							   }
							}
					}).show();
					},
				      error: function() {	
					     $dialogContent.dialog("close"); 
					     $('<p> Ho,ho,ho! Dolphins on the server..please try again. </p>').dialog({
						      title: "Oops!",
						      buttons: {
						      "Close" : function() {
							   $(this).dialog('close')
							   }
							}
					}).show();
				}
			      });
			},
		       "Close" : function() {
			  $dialogContent.dialog("close");
		       },    
		    }
		 }).show();

	     }
	     else { 
	     	window.location =  Drupal.settings.basePath + '/node/' +  calEvent.id;
	     } 
		 $(window).resize().resize(); //fixes a bug in modal overlay size ??
      },
      eventMouseover : function(calEvent, $event) {
      },
      eventMouseout : function(calEvent, $event) {
      },
      noEvents : function() {
      },
      data : function(start, end, callback) {
	 render_callback = callback;
	 render_start = start;
         getEventData();
     }
   });

   function resetForm($dialogContent) {
      $dialogContent.find("input").val("");
      $dialogContent.find("textarea").val("");
   }

   function getEventData() { 

     var year = render_start.getFullYear();
     var month = render_start.getMonth();
     var day = render_start.getDate();

     var url = Drupal.settings.basePath + "user/" + Drupal.settings.owner + "/ajaxhandler?date=" + year + "/" + (month + 1) + "/" + day; 
	
     $.getJSON(url,function(response) {
		 //response is an array of objects with each object standing for a day
		 alert(JSON.stringify(response));
		 response = response || new Array();
		 var weekEvents = new Array();
		 for(var i = 0; i < response.length; i++) {
			 var date = response[i].date;
			 var events_day = response[i].events_day;

			 //events_day is another array of objects with each object standing for an event on the particular day
			 for(var j=0; j < events_day.length; j++) {
				var obj = new Object();
				
			       	var event = events_day[j]; 
				obj.id = event.nid;
				obj.type = event.type;
				obj.title = event.title;
				var time = event.time.split(":");
				if(obj.type == 'course' || obj.type == 'assignment' || obj.type == 'session' || !own_calendar) 
				       obj.readOnly = true;
				
				if(obj.type == 'course' || obj.type =='assignment') {
				       //giving these events a slot of one hour...can be changed.
				       //seems stupid...find a better way..some of the courses had a time of 23:59
				       obj.start = new Date(date.year, date.month-1, date.day, time[0], time[0] == 23 ? 0 : time[1]);
				       obj.end = new Date(date.year, date.month-1, date.day, time[0], time[0] == 23 ? 60 : time[1]+60);
				}
				else {
					//sticking to single day events as of now
					var totime = event.totime.split(":");
					obj.start = new Date(date.year, date.month-1, date.day, time[0], time[1]);
					obj.end = new Date(date.year, date.month-1, date.day, totime[0], totime[1]);
					obj.repeat_offset = event.repeat_offset;
					obj.status = event.status;
				}

				weekEvents.push(obj);	

			 }
		  }
	     $('.wc-cal-event').remove();
	     render_callback({ events: weekEvents});
        });
       }


   /*
    * Sets up the start and end time fields in the calendar event
    * form for editing based on the calendar event being edited
    */
   function setupStartAndEndTimeFields($startTimeField, $endTimeField, calEvent, timeslotTimes) {

      for (var i = 0; i < timeslotTimes.length; i++) {
         var startTime = timeslotTimes[i].start;
         var endTime = timeslotTimes[i].end;
         var startSelected = "";
         if (startTime.getTime() === calEvent.start.getTime()) {
            startSelected = "selected=\"selected\"";
         }
         var endSelected = "";
         if (endTime.getTime() === calEvent.end.getTime()) {
            endSelected = "selected=\"selected\"";
         }
         $startTimeField.append("<option value=\"" + startTime + "\" " + startSelected + ">" + timeslotTimes[i].startFormatted + "</option>");
         $endTimeField.append("<option value=\"" + endTime + "\" " + endSelected + ">" + timeslotTimes[i].endFormatted + "</option>");

      }
      $endTimeOptions = $endTimeField.find("option");
      $startTimeField.trigger("change");
   }

   var $endTimeField = $("select[name='end']");
   var $endTimeOptions = $endTimeField.find("option");

   //reduces the end time options to be only after the start time options.
   $("select[name='start']").change(function() {
      var startTime = $(this).find(":selected").val();
      var currentEndTime = $endTimeField.find("option:selected").val();
      $endTimeField.html(
            $endTimeOptions.filter(function() {
               return startTime < $(this).val();
            })
            );

      var endTimeSelected = false;
      $endTimeField.find("option").each(function() {
         if ($(this).val() === currentEndTime) {
            $(this).attr("selected", "selected");
            endTimeSelected = true;
            return false;
         }
      });

      if (!endTimeSelected) {
         //automatically select an end date 2 slots away.
         $endTimeField.find("option:eq(1)").attr("selected", "selected");
      }

   }); 
Drupal.Ajax.plugins.weekcalendar = function(hook,args) {
	if (hook == 'scrollFind') 
		return false;
	if (hook == 'complete') {
		$('#tip').css('display','none');
		getEventData();
	}
}
});


