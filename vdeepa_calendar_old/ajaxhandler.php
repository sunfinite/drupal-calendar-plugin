<?php
 	isset($_GET['o'])?$offset=$_GET['o']:$offset=0;
	$timestamp=strtotime($offset."week");
	$month_year=date("F/Y",$timestamp);
	$daynum=date("N",$timestamp);//the cardinal number of today ( or the same day offset weeks later)
	$displaydates=array();
	$displaydates[0]=date("W",$timestamp);//the cardinal number of the week ( no use..array filler)	
	for($i=1;$i<=7;$i++) {
		
		$displaydates[$i]=date("j",strtotime($i-$daynum."day",$timestamp));
	}
	$return=array (
		'month_year' => $month_year,
		'dates' => $displaydates,
		);
	print_r(json_encode($return));
?>
