<html>
	<head>	
		<meta charset="utf-8">
		<title>Calendar | vdeepa.com</title>

		<script type="text/javascript" src="calendar.js">
		</script>

		<link rel="stylesheet" href="style.css" />
	
	</head>
	<body>
	
		<div  class="constant" align="center" id="month_year"></div>
		<br />
		<table cellspacing=0 align="center" class="constant header">
			<th>Monday</th>
			<th>Tuesday</th>
			<th>Wednesday</th>
			<th>Thursday</th>
			<th>Friday</th>
			<th>Saturday</th>
			<th>Sunday</th>
		</table>
		<br />
		<div id="calendar"  style="width : 700px;" align="center">
			<table cellspacing=0>
				<tr>
					<?php 
					for($i=1;$i<=7;$i++) {
					?>	
					<td class="dates" id=<?php echo "date".$i?>></td>
					<?php } ?>
				</tr>
				<?php 
				for($i=1;$i<=24;$i++) {
				?>
					<tr>
					<?php	
						for($j=1;$j<=7;$j++) {
					?>
						<td class="events" id=<?php echo $j.'-'.$i?>></td>
					<?php } ?>
					</tr>
				<?php } ?> 										
			</table>
		</div>	
		<img id="left"  src="left.gif"  onclick="buttoneffect(this);">
		<img id="right"  src="right.gif" onclick="buttoneffect(this);">
	</body>
</html>		
