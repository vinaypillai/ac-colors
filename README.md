# ac-colors
ac-colors is a reactive JavaScript color library that can freely convert between RGB, HSL, HEX, XYZ, LAB, and LCHab, as well as handle random color generation and contrast ratio calculation. A live color picker running on ac-colors can be found at [http://colors.acutecomponents.com/](http://colors.acutecomponents.com/).

* [Installation](#Installation)
    * [Node.js](#node.js)
    * [Browser](#browser)
* [Making a Color object](#making-a-color-object)
    * [color](#color)
    * [type](#type)
    * [precision](#precision)
    * [capitalize](#capitalize)
    * [Color object reactivity](#color-object-reactivity)
* [Color class API](#color-class-api)
    * [Object properties](#properties)
        * [rgb](#rgb)
        * [rgbString](#rgbString)
        * [hex](#hex)
        * [hexString](#hexString)
        * [hsl](#hsl)
        * [hslString](#hslString)
        * [xyz](#xyz)
        * [xyzString](xyzString)
        * [lab](#lab)
        * [labString](labString)
        * [lchab](#lchab)
        * [lchabString](lchabString)
        * [precision](#precision-1)
        * [capitalize](#capitalize-1)
    * [Static methods](#static-methods)
        * [Color.rgbToHsl](#color.rgbtohsl)
        * [Color.hslToRgb](#color.hsltorgb)
        * [Color.rgbToHex](#color.rgbtohex)
        * [Color.hexToRgb](#color.hextorgb)
        * [Color.rgbToXyz](#color.rgbtoxyz)
        * [Color.xyzToRgb](#color.xyztorgb)
        * [Color.xyzToLab](#color.xyztolab)
        * [Color.labToXyz](#color.labtoxyz)
        * [Color.labToLCHab](#color.labtolchab)
        * [Color.lchABToLab](#color.lchabtolab)
        * [Color.luminance](#color.luminance)
        * [Color.random](#color.random)
        * [Color.randomOfType](#color.randomoftype)
        * [Color.randomOfTypeFormatted](#color.randomoftypeformatted)
        * [Color.contrastTextColor](#color.contrasttextcolor)
        * [Color.contrastRatio](#color.contrastratio)
* [Acknowledgements](#acknowledgements)
* [License](#license)

## Installation
### Node.js
``` bash
npm install --save ac-colors
```
### Browser
Download the minified [ac-colors.min.js](https://raw.githubusercontent.com/vinaypillai/ac-colors/master/dist/ac-colors.min.js) and include it in a `<script>` tag
``` html
<script src="ac-colors.min.js"></script>
```
## Making a Color object
The easiest way to get started with color conversion in ac-colors is by creating a Color object. The constructor takes  an object with up to four deconstructed properties which help determine how to convert and format color output:
* `color`: An array (or string if `type` is hex) containing the three numbers for the color (ex.[r,g,b]). Defaults to `[0,0,0]`.
* `type`: The format for the color being inputted. A full list of types can be found [below](#type). Defaults to `"rgb"`.
* `precision`: The number of decimals to be outputted from the string output methods. Defaults to `3`.
* `capitalize`: A boolean flag for whether or not to capitalize the string output. Defaults to `true`.

```javascript
// Node.js users will need to import the module
const Color = require("ac-colors");
let black = new Color();
console.log(black.hex); // #000000
```
### `color`
The `color` property is usually a three element array containing the three RGB, HSL, LAB, XYZ, or LCHab digits, but can also be a string containing a 3 or 6 digit hexcode. The default color, `[0,0,0,]` evaluates to black when used with the default type of `"rgb"`.
```javascript
let red = new Color({"color":[255,0,0]});
console.log(red.rgbString); // RGB(255, 0, 0)
```
Hex colors can be specified with 3 or six digits and with or without the leading '#'.
```javascript
let grey = new Color({"color":"#333","type":"hex"});
console.log(grey.hsl); // [0, 0, 20]
```
### `type`
The `type` property is a string with the following possible values:
* `"rgb"` (Default)
* `"hex"`
* `"hsl"`
* `"xyz"`
* `"lab"`
* `"lchab"`

The type merely specifies the format of the incoming color. Once the type is specified, all of the below [properties](#color-object-properties) will be set.
```javascript
let blue = new Color({"color":"#0000FF","type":"hex"});
console.log(blue.rgb); // [0,0,255]
```
### `precision`
The `precision` property specifies how many decimal places to return in the string format of the color in representations where decimals are allowed, and defaults to 3 places.
```javascript
let green = new Color({"color":"#00FF00","type":"hex", "precision":1});
// The hslString property allows for decimal values
console.log(green.hslString); // HSL(120.0, 100.0, 50.0)
// The rgbString property does not
console.log(green.rgbString); // RGB(0, 255, 0)
```
### `capitalize`
The `capitalize` property specifies whether or not to capitalize the string of the returned by the output functions.
```javascript
// capitalize: true
let yellowCaps = new Color({"color":[53.418,96.735,48.039],"type":"hsl", "precision":1, "capitalize":true});
// capitalize: false
let yellowNoCaps = new Color({"color":[53.418,96.735,48.039],"type":"hsl", "precision":1, "capitalize":false});

console.log(yellowCaps.hexString); // #F1D704
console.log(yellowNoCaps.hexString); // #f1d704
```
### Color object reactivity
Each Color objects six [reactive color members](#object-properties),  and two reactive formatting members, `precision` and `capitalize`. This means that setting the value of any of the properties will automatically trigger updates of all the other values, so conversion between all the possible types is done simultaneously.
```javascript
const green = new Color({"color":"#00FF00","type":"hex"});
console.log(green.rgbString); // RGB(0,255,0)
green.rgb = [255,0,0]
console.log(green.hslString); // HSL(0.000, 100.000, 50.000)
green.capitalize = false;
console.log(green.hexString); // #ff0000
green.lab = [32.297, 79.194, -107.859];
green.precision = 5;
console.log(green.lchabString); // lchAB(32.29701, 133.81132, 306.28752)
```

## Color class API
The color object contains two main sets of data members which can be used for color conversion. There are the reactive properties which can be accessed from each Color instance, but there are also static methods which can be used for general color conversion without creating a Color object.
### Object properties 
There are 12 primary instance properties, as well as two formatting properties (`precision` and `capitalize`) in each Color object that can be used for color conversion. The 12 main conversion properties can be divided into two categories: Reactive members and their complementary formatted string outputs.
| Reactive members | Formatted string outputs |
|:--:|:--:|
| rgb | rgbString |
| hex | hexString |
| hsl | hslString |
| xyz | xyzString |
| lab | labString |
| lchab | lchabString |

#### `rgb` 
The `rgb` property is a reactive getter and setter for the three element array representing the colors [r,g,b] values.
```javascript
let black = new Color();
console.log(black.rgb); // [0,0,0]
black.rgb = [255,255,255];
console.log(black.hex); // #ffffff
```
#### `rgbString` 
The `rgbString` property is a formatted string output for the rgb color. It is not impacted by the Color object's `precision`, but is affected by its `capitalize` value.
```javascript
let black = new Color();
console.log(black.rgbString); // RGB(0, 0, 0)
black.capitalize = false;
console.log(black.rgbString); // rgb(0, 0, 0)
```

#### `hex` 
The `hex` property is a reactive getter and setter for the string representing the colors three or six digit hex code.
```javascript
let black = new Color();
console.log(black.hex); // #000000
black.hex = "#FFF";
console.log(black.rgbString); // RGB(255, 255, 255)
```
#### `hexString` 
The `hexString` property is a formatted string output for the hex color. It is not impacted by the Color object's `precision`, but is affected by its `capitalize` value.
```javascript
let white = new Color({"color":[255,255,255]});
console.log(white.hexString) // #FFFFFF
white.capitalize = false;
console.log(white.hexString) // #ffffff
```
#### `hsl` 
The `hsl` property is a reactive getter and setter for the three element array representing the colors [h,s,l] values.
```javascript
let black = new Color();
console.log(black.hsl); // [0,0,0]
black.hsl = [240,20.863,27.255];
console.log(black.rgbString); // RGB(55, 55, 84)
```
#### `hslString` 
The `hslString` property is a formatted string output for the hsl color. It is  impacted by the Color object's `precision` and `capitalize` values.
```javascript
let white = new Color({"color":[255,255,255]});
console.log(white.hslString) // HSL(0.000, 0.000, 100.000)
white.capitalize = false;
console.log(white.hslString) // hsl(0.000, 0.000, 100.000)
```
#### `xyz` 
The `xyz` property is a reactive getter and setter for the three element array representing the colors [x,y,z] values.
```javascript
let black = new Color();
console.log(black.xyz); // [0,0,0]
black.xyz = [4.542,4.185,8.954];
console.log(black.rgbString); // RGB(55, 55, 84)
```
#### `xyzString` 
The `xyzString` property is a formatted string output for the xyz color. It is  impacted by the Color object's `precision` and `capitalize` values.
```javascript
let white = new Color({"color":[255,255,255]});
console.log(white.xyzString) // XYZ(95.047, 100.000, 100.000)
white.capitalize = false;
console.log(white.xyzString) // xyz(95.047, 100.000, 100.000)
```
#### `lab` 
The `lab` property is a reactive getter and setter for the three element array representing the colors [l,a,b] values.
```javascript
let black = new Color();
console.log(black.lab); // [0,0,0]
black.kab = [24.272,7.853,-17.538];
console.log(black.rgbString); // RGB(55, 55, 84)
```
#### `labString` 
The `labString` property is a formatted string output for the lab color. It is  impacted by the Color object's `precision` and `capitalize` values.
```javascript
let white = new Color({"color":[255,255,255]});
console.log(white.labString) // LAB(100.000, 0.012, 0.001)
white.capitalize = false;
console.log(white.labString) // lab(100.000, 0.012, 0.001)
```
#### `lchab` 
The `lchab` property is a reactive getter and setter for the three element array representing the colors [l,c,h] values.
```javascript
let black = new Color();
console.log(black.lchab); // [0,0,0]
black.lchab = [24.272,7.853,294.121];
console.log(black.rgbString); // RGB(55, 55, 84)
```
#### `lchabString` 
The `lchabString` property is a formatted string output for the lab color. It is  impacted by the Color object's `precision` and `capitalize` values. However, the capitalization is inverted for the subscripted 'ab'.
```javascript
let white = new Color({"color":[255,255,255]});
console.log(white.lchabString) // LCHab(100.000, 0.012,2.890)
white.capitalize = false;
console.log(white.lchabString) // lchAB(100.000, 0.012,2.890)
```
#### `precision` 
The `precision` property is a reactive formatting property that controls the number of decimal places outputted from a formatted string property. It is set during object initialization, but can be updated at any time.
```javascript
let white = new Color({"color":[255,255,255],"precision":3});
console.log(white.lchabString) // LCHab(100.000, 0.012,2.890)
white.precision = 1;
console.log(white.lchabString) // LCHab(100.0, 0.0,2.9))
```

#### `capitalize` 
The `capitalize` property is a reactive formatting property that controls the capitalization of a formatted string property. It is set during object initialization, but can be updated at any time.
```javascript
let white = new Color({"color":[255,255,255], "capitalize":false});
console.log(white.lchabString) // lchAB(100.000, 0.012,2.890)
white.capitalize = true;
console.log(white.lchabString) // LCHab(100.000, 0.012,2.890)
```
### Static Methods
Although it is easier to handle color conversion by creating Color objects and making use of the automatic type conversion, ac-colors supports manual color conversion using the underlying static methods. In addition, static methods are provided for handling random color generation and color contrast ratio checking.

#### `Color.rgbToHsl`
This method takes in a three element array `[r,g,b]` representing a color's rgb values, and returns a three element array `[h,s,l]` representing the color's hsl values
```javascript
// Color.rgbToHex(hex)
console.log(Color.rgbToHsl([85,46,58])); // [341.538,29.771,25.686]
```
#### `Color.hslToRgb`
This method takes in a three element array `[h,s,l]` representing a color's hsl values, and returns a three element array `[r,g,b]` representing the color's rgb values
```javascript
// Color.hslToRgb(hsl)
console.log(Color.hslToRgb([341.538,29.771,25.686])); // [85,46,58]
```
#### `Color.rgbToHex`
This method takes in a three element array `[r,g,b]` representing a color's rgb values, and returns a string representing the color's hex code.
```javascript
// Color.rgbToHex(rgb)
console.log(Color.rgbToHex([85,46,58])); // #552e3a
```
#### `Color.hexToRgb`
This method takes in a three or six digit hexcode and returns a three element array `[r,g,b]` representing a color's rgb values.
```javascript
// Color.hexToRgb(hex)
console.log(Color.hexToRgb("#552e3a")); // [85,46,58]
```
#### `Color.rgbToXyz`
This method takes in a three element array `[r,g,b]` representing a color's rgb values, and returns a three element array `[x,y,z]` representing the color's xyz values
```javascript
// Color.rgbToXyz(rgb)
console.log(Color.rgbToXyz([85,46,58])); // [5.487,4.191,4.522]
```
#### `Color.xyzToRgb`
This method takes in a three element array `[x,y,z]` representing the color's xyz values and returns a three element array `[r,g,b]` representing a color's rgb values.
```javascript
// Color.xyzToRgb(xyz)
console.log(Color.xyzToRgb([5.487,4.191,4.522])); // [85,46,58]
```
#### `Color.xyzToLab`
This method takes in a three element array `[x,y,z]` representing the color's xyz values and returns a three element array `[l,a,b]` representing a color's lab values.
```javascript
// Color.xyzToLab(xyz)
console.log(Color.xyzToLab([5.487,4.191,4.522])); // [24.294,19.570,0.211]
```
#### `Color.labToXyz`
This method takes in a three element array `[l,a,b]` representing a color's lab values. and returns a three element array `[x,y,z]` representing the color's xyz values.
```javascript
// Color.labToXyz(lab)
console.log(Color.labToXyz([24.294,19.570,0.211])); // [5.487,4.191,4.522]
```
#### `Color.labToLCHab`
This method takes in a three element array `[l,a,b]` representing a color's lab values. and returns a three element array `[l,c,h]` representing the color's LCHab values.
```javascript
// Color.labToLCHab(lab)
console.log(Color.labToLCHab([24.294,19.570,0.211])); // [24.294,19.571,0.617]
```
#### `Color.lchABToLab`
This method takes in a three element array `[l,c,h]` representing a color's LCHab values. and returns a three element array `[l,a,b]` representing the color's lab values.
```javascript
// Color.lchABToLab(lchAB)
console.log(Color.lchABToLab([24.294,19.571,0.617])); // [24.294,19.570,0.211]
```
#### `Color.luminance`
This method takes in a three element array and a string representing its type and returns its [relative luminance](https://www.w3.org/TR/WCAG20/#relativeluminancedef). Default type is `"rgb"`.
```javascript
// Color.luminance(color,type)
console.log(Color.luminance([0,255,0])); // 0.7152
console.log(Color.luminance("#ff0000","hex")); // 0.2126
```
#### `Color.random`
This method returns a new Color instance with a random color selected.
```javascript
// Color.random()
console.log(Color.random()); // Color {_rgb: Array(3), _hsl: Array(3), _hex: "#b3eeb6", _xyz: Array(3), _lab: Array(3), …}
console.log(Color.random()); // Color {_rgb: Array(3), _hsl: Array(3), _hex: "#85dd60", _xyz: Array(3), _lab: Array(3), …}
```
#### `Color.randomOfType`
This method takes in a type and returns a new three element array of the type selected, or six digit hex code if type is `"hex"`. Default type is `"rgb"`.
```javascript
// Color.randomOfType(type)
console.log(Color.randomOfType()); // [24, 60, 77]
console.log(Color.randomOfType("hex")); // #4c4f92
```
#### `Color.randomOfTypeFormatted`
This method takes in a type, a `capitalize` flag, and a `precision` and returns a formatted string for the type specified. The `capitalize` flag determines whether or not the returned string will capitalized, and defaults to true. The `precision` flag determines how many decimal places to round the values returned, if applicable, and defaults to 3. Default type is `"rgb"`.
```javascript
// Color.randomOfTypeFormatted(type,capitalize,precision)
console.log(Color.randomOfTypeFormatted()); // RGB(237, 216, 88)
console.log(Color.randomOfTypeFormatted("hex")); // #FD3741
console.log(Color.randomOfTypeFormatted("rgb",false)); // rgb(120, 156, 72)
console.log(Color.randomOfTypeFormatted("hsl",true,1)); // HSL(296.9, 90.6, 79.2)
```
#### `Color.contrastTextColor`
This method takes in a three element array or string representing a color, and the type of the color, and return `#FFFFFF` or `#000000` depending on which one has a higher [contrast ratio](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef) with the color provided.
```javascript
// Color.contrastTextColor(color,type)
console.log(Color.contrastTextColor([10,20,30])); // #FFFFFF
console.log(Color.contrastTextColor("#e8e9ea","hex")); // #000000
```
#### `Color.contrastRatio`
This method takes in two Color instances and returns the [contrast ratio](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef) between the two. 
```javascript
// Color.contrastRatio(color1,color2)
const red = new Color({"color":"#ff0000","type":"hex"});
const blue = new Color({"color":[255,255,255]})
console.log(Color.contrastRatio(red,blue)); // 3.9984767707539985

```
## Acknowledgements
Thanks to Jonas Jacek for providing some of the  [sample data](https://jonasjacek.github.io/colors/) used for testing the color conversion.
## License
Copyright 2020 Vinay Pillai

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.