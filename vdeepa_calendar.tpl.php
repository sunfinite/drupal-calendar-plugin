<?php
	global $user;
	$title = drupal_get_title();
	module_load_include('inc','node','node.pages');	
	echo "<div id='tip'>";
	echo "<span id='event-link'>Event</span> | <span id='appointment-link'>Appointment Slot </span> | <span id='close-tip'>Close</span>";
	echo "<div id='tip-event' class='tip'>".node_add('event')."</div>";	
	echo "<div id='tip-appointment' class='tip'>".node_add('appointment')."</div>";
	echo "</div>";
	drupal_set_title($title);
	if($user->notify_unseen) 
		echo "<div id='notify-unseen'>You have new requests for appointments, please visit your requests page to see them.</div>";
	if($accepted = $user->notify_accepted) {
		foreach($accepted as $slot) 
			echo "<div class='notify-accepted'>".$slot['name']." has accepted your appointment request on ".$slot['time']."</div>"; 
	}

?>
<div id='calendar'></div>
<div id="placerequest"> Are you sure? <br/><br/> <label>Message:</label>  <input type="text" id="request_message" value=" "></div>

