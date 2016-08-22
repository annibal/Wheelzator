# Wheelzator
Stylish alternative to combobox selection using wheel-like popup buttons

[See the Demo](https://annibal.github.io/Wheelzator/demo.html) <br />
[See the Event Demo](https://annibal.github.io/Wheelzator/event-demo.html) <br>
[Docs i Made](https://annibal.github.io/Wheelzator/)<br>

## Usage:
`wheelzator("#my-wheel-container", optionsArray, configurationsAndEventsObject);`

## Options Array
An array of objects with these properties:
- **icon**: A string, font awesome's icon name
- **value**: Option's value
- **title**: Actual `title=""` attribute. Use bootstrap's `.tooltip()` for better visual design

## Configurations Object:
##### The properties of this Wheel:
- **minDistance**: [Default: 20] Least distance from center to consider a "Select" event
- **maxDistance**: [Default: 90] Maximum distance from center to consider a "Select" event. Also represents `.wheel-inner` size.
- **optionDistance**: [Default: 60] Distance from options to center
- **offsetAngle**: [Default: 90] Amount of degrees to rotate the options (Counter Clockwise)
- **offsetCalcAngle**: [Default: -15] Degrees compensation angle

**Obs.:** Clicking inside `minDistance` or outside `maxDistance` triggers `onDeselect()`

##### The events of this Wheel:
- **onOpen()**: Function called when wheel is Open.
- **onDeselect()**: Function called when the outer world is selected
- **onSelect( data )**: Function called when an object is selected.
- - **data.index**: Index (in option array) of selected option
- - **data.value**: Value assigned to this option
- - **data.target**: HTML Obj of option selected
- - **data.wheelContainer**: HTML Obj of Wheel Container
- - **data.originObject**: HTML Obj of Wheel Container's Parent

Wheelzator comes with some [Presets](https://annibal.github.io/Wheelzator/index.html#presets)<br>
Uses CSS selector for color, style and animation.