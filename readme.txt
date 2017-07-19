Made additional use of the Google Maps API:
	- Custom marker
	- Animates on page load
	- Title text on hover
	- Clicking toggles bounce animation
	- Clicking displays infowindow with additional weather information from Openweathermaps.

- Checkboxes only appear when the pages load. This uses the same function they trigger on the additional
information tables. Surprisingly tricky! Original solution was a lot more convoluted.

- Default values prevent missing parameters in the Openweathermaps API call.
- Checks to ensure a 'rain' field is present in the JSON and diplays an appropriate message rather than
'undefined'