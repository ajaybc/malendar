<?php
$dayData = file_get_contents('2015.json');
$days = json_decode($dayData, true);
$handle = fopen("specialties-2015", "r");
if ($handle) {
	$parsedData = [];
    while (($line = fgets($handle)) !== false) {
        $data = explode('-', $line);
        if (count($data) == 3) {
        	//No holiday
        	$parsedData[$data[0].'/'.$data[1].'/2015'] = array (
        		'special' => $data[2]
        	);
        } else {
        	$parsedData[$data[0].'/'.$data[1].'/2015'] = array (
        		'holiday' => intval($data[3]),
        		'bankHoliday' => intval($data[4]),
        		'special' => $data[2],
        	);
        }
    }
} else {
    // error opening the file.
} 
fclose($handle);

//print_r($parsedData);

$parsedDays = [];
foreach ($days as $key => $value) {
    $date = date_create_from_format('j/n/Y', $key);
    $dayOfWeek = date_format($date, 'w');

    $secondSaturday = date('d', strtotime('second sat of '.date_format($date, 'M').' 2015'));
    if ($parsedData[$key]) {
        $parsedDays[$key] = array_merge($value, $parsedData[$key], array('dayOfWeek' => intval($dayOfWeek)));
    } else {
        $parsedDays[$key] = array_merge($value, array('dayOfWeek' => intval($dayOfWeek)));
    }

    if ($secondSaturday == date_format($date, 'd')) {
        $parsedDays[$key] = array_merge($parsedDays[$key], array('holiday' => 1));
    } else if ($dayOfWeek == 0) {
        $parsedDays[$key] = array_merge($parsedDays[$key], array('holiday' => 1));
    }
    unset($parsedDays[$key]['Speciality']);
    echo strtotime(str_replace('/', '-', $key)).'<br/>';
}

echo '<pre>';
print_r($parsedDays);

file_put_contents('2015.json', json_encode($parsedDays));