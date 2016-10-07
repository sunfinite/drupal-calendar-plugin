<?php
/*
 * Template for the calendar
 */
?>
<div id='tip'>
	<a href=<?php print base_path()."node/add/event"  ?> id='create_event' type="event" class="createnode">Create Event</a>
	&nbsp;|&nbsp;
	<a href=<?php print base_path()."node/add/appointment" ?>  id='create_appointment' type="appointment" class="createnode">Free Slot</a>
</div>
<div id="month_year"></div>
<table  id="days">
	<th>Monday</th>
	<th>Tuesday</th>
	<th>Wednesday</th>
	<th>Thursday</th>
	<th>Friday</th>
	<th>Saturday</th>
	<th>Sunday</th>
</table>

<table id="calendar">
	<tr>
	<?php 
	for($i=1;$i<=7;$i++) {
		?>	
			<td class="dates" id=<?php echo "date".$i?>></td>
		<?php } ?>
	</tr>
		<?php 
	for($i=0;$i<=47;$i++) {
	?>
	<tr>
		<?php	
		for($j=1;$j<=7;$j++) {
			if($i%2) {
		?>
			<td class="time_slot hour" id=<?php echo $j.'-'.$i?>></td>
		<?php
			}
		else {
		?>			
			<td class="time_slot" id=<?php echo $j.'-'.$i?>></td>
		<?php }} ?>
	</tr>
		<?php } ?> 										
</table>

<img id="left"  src=<?php print base_path().drupal_get_path("module","vdeepa_calendar")."/"."left.gif";?>>
<img id="right" src=<?php print base_path().drupal_get_path("module","vdeepa_calendar")."/"."right.gif"?>>
	
