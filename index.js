/** Class representing a color. */
class Color {
  /** List of valid color spaces */
  static validTypes = ['rgb', 'hex', 'hsl', 'xyz', 'lab', 'lchab'];

  /** d65 standard illuminant in XYZ */
  static d65 = [95.05, 100, 108.9];

  /**
  * Create a color
  * @param {Object} config - Data for color and display preferences
  * @param {string|number[]} [config.color=[0,0,0]] - Color tuple or hexcode
  * @param {string} [type='rgb'] - Color space
  * @param {boolean} [capitalize=true] - Flag for output capitalization
  */
  constructor({
    color = [0, 0, 0],
    type = 'rgb',
    precision = 3,
    capitalize = true,
  } = {color: [0, 0, 0], type: 'rgb', precision: 3, capitalize: true}) {
    this.updateColor(color, type);
    this.precision = precision;
    this.capitalize = capitalize;
  }

  /**
  * Update conversions for color
  * @param {string|number[]} color - Color tuple or hexcode
  * @param {string} [type='rgb'] - Color space
  * @throws Will throw an error if type is not a string or not a supported type
  */
  updateColor(color, type = 'rgb') {
    let rgb;
    if (typeof type !== 'string') {
      throw new TypeError('Parameter 2 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)) {
      throw new TypeError(`Parameter 2 '${type}' is not a valid type.`);
    }
    switch (type) {
      case 'hsl':
        rgb = Color.hslToRgb(color);
        break;
      case 'hex':
        rgb = Color.hexToRgb(color);
        break;
      case 'xyz':
        rgb = Color.xyzToRgb(color);
        break;
      case 'lab':
        rgb = Color.xyzToRgb(Color.labToXyz(color));
        break;
      case 'lchab':
        rgb = Color.xyzToRgb(Color.labToXyz(Color.lchABToLab(color)));
        break;
      case 'rgb':
      // falls through
      case 'default':
        color = color.map((x) => Math.min(255, x));
        color = color.map((x) => Math.max(0, x));
        color = color.map(Math.round);
        this._rgb = color;
        this._hsl = Color.rgbToHsl(this._rgb);
        this._hex = Color.rgbToHex(this._rgb);
        this._xyz = Color.rgbToXyz(this._rgb);
        this._lab = Color.xyzToLab(this._xyz);
        this._lchab = Color.labToLCHab(this._lab);
        break;
    }
    if (type !== 'rgb') {
      this.updateColor(rgb, 'rgb');
    }
  }

  /**
  * Get the underlying srgb tuple
  * @return {number[]} The srgb tule
  */
  get rgb() {
    return this._rgb;
  }

  /**
  * Set the underlying srgb tuple
  * @param {number[]} rgb - 3 element srgb tuple
  */
  set rgb(rgb) {
    this.updateColor(rgb, 'rgb');
  }

  /**
  * Get the formatted rgb string
  * @return {string} The rgb string
  */
  get rgbString() {
    const str = 'RGB(' + this.rgb.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }

  /**
  * Get the underlying hsl tuple
  * @return {number[]} The hsl tule
  */
  get hsl() {
    return this._hsl;
  }

  /**
  * Set the underlying hsl tuple
  * @param {number[]} hsl - 3 element hsl tuple
  */
  set hsl(hsl) {
    this.updateColor(hsl, 'hsl');
  }

  /**
  * Get the formatted hsl string
  * @return {string} The hsl string
  */
  get hslString() {
    const truncHSL = this.hsl.map((x) => x.toFixed(this.precision));
    const str = 'HSL(' + truncHSL.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }

  /**
  * Get the underlying hex code
  * @return {string} The hexcode
  */
  get hex() {
    return this._hex;
  }

  /**
  * Set the underlying hex code
  * @param {string} hex - 3 or 6 digit hexcode
  */
  set hex(hex) {
    this.updateColor(hex, 'hex');
  }

  /**
  * Get the formatted hex string
  * @return {string} The hex string
  */
  get hexString() {
    const str = this._hex;
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }

  /**
  * Get the underlying xyz tuple
  * @return {number[]} The xyz tule
  */
  get xyz() {
    return this._xyz;
  }

  /**
  * Set the underlying xyz tuple
  * @param {number[]} xyz - 3 element xyz tuple
  */
  set xyz(xyz) {
    this.updateColor(xyz, 'xyz');
  }

  /**
  * Get the formatted xyz string
  * @return {string} The xyz string
  */
  get xyzString() {
    const truncXYZ = this.xyz.map((x) => x.toFixed(this.precision));
    const str = 'XYZ(' + truncXYZ.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }

  /**
  * Get the underlying lab tuple
  * @return {number[]} The lab tule
  */
  get lab() {
    return this._lab;
  }

  /**
  * Set the underlying lab tuple
  * @param {number[]} lab - 3 element lab tuple
  */
  set lab(lab) {
    this.updateColor(lab, 'lab');
  }

  /**
  * Get the formatted lab string
  * @return {string} The lab string
  */
  get labString() {
    const truncLAB = this.lab.map((x) => x.toFixed(this.precision));
    const str = 'LAB(' + truncLAB.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }

  /**
  * Get the underlying lchab tuple
  * @return {number[]} The lchab tule
  */
  get lchab() {
    return this._lchab;
  }

  /**
  * Set the underlying lchab tuple
  * @param {number[]} lchab - 3 element lchab tuple
  */
  set lchab(lchab) {
    this.updateColor(lchab, 'lchab');
  }

  /**
  * Get the formatted lchAB string
  * @return {string} The lchAB string
  */
  get lchabString() {
    const truncLCHAB = this.lchab.map((x) => x.toFixed(this.precision));
    return (this.capitalize) ?
      'LCHab(' + truncLCHAB.join(', ') + ')' :
      'lchAB(' + truncLCHAB.join(', ') + ')';
  }

  /**
  * Convert a 3 element srgb tuple to a 3 element hsl tuple.
  * @param {number[]} rgb - The srgb tuple
  * @return {number[]} The hsl tuple
  */
  static rgbToHsl(rgb) {
    // Normalize rgb tuple to [0,1]
    const r1 = rgb[0] / 255;
    const g1 = rgb[1] / 255;
    const b1 = rgb[2] / 255;
    // Lightness is average of max and min normalized rgb values
    const maxColor = Math.max(r1, g1, b1);
    const minColor = Math.min(r1, g1, b1);
    let L = (maxColor + minColor) / 2;
    // Hue and saturation are only non zero if color is grey
    // A color is grey if all r,g,b are all the same (maxColor===minColor)
    let S = 0;
    let H = 0;
    if (maxColor !== minColor) {
      if (L < 0.5) {
        S = (maxColor - minColor) / (maxColor + minColor);
      } else {
        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
      }
      if (r1 === maxColor) {
        H = (g1 - b1) / (maxColor - minColor);
      } else if (g1 === maxColor) {
        H = 2.0 + (b1 - r1) / (maxColor - minColor);
      } else {
        H = 4.0 + (r1 - g1) / (maxColor - minColor);
      }
    }
    // Scale up to [0,100] for Lightnexx and saturation, [0,360) for Hue
    L = L * 100;
    S = S * 100;
    H = H * 60;
    // Hue has a period of 360deg, if hue is negative, get positive hue
    // by scaling h to (-360,0) and adding 360
    H = (H < 0) ? H % 360 + 360 : H;
    return [H, S, L];
  }

  /**
  * Convert a 3 element hsl tuple to a 3 element srgb tuple.
  * @param {number[]} hsl - The hsl tuple
  * @return {number[]} The srgb tuple
  */
  static hslToRgb(hsl) {
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];
    // Any nonfinite hsl is reset to 0
    if (!isFinite(h)) {
      h = 0;
    }
    if (!isFinite(s)) {
      s = 0;
    }
    if (!isFinite(l)) {
      l = 0;
    }
    // Hue has a period of 360deg, if hue is negative, get positive hue
    // by scaling h to (-360,0) and adding 360
    h = (h < 0) ? h % 360 + 360 : h;
    // Normalize saturation and lightness to [0,1], hue [0,6)
    l /= 100;
    s /= 100;
    h /= 60;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(h % 2 - 1));
    const m = l - c / 2;
    let rgb1;
    if (h < 1) {
      rgb1 = [c, x, 0];
    } else if (h < 2) {
      rgb1 = [x, c, 0];
    } else if (h < 3) {
      rgb1 = [0, c, x];
    } else if (h < 4) {
      rgb1 = [0, x, c];
    } else if (h < 5) {
      rgb1 = [x, 0, c];
    } else {
      rgb1 = [c, 0, x];
    }
    const rgb = rgb1.map((val) => Math.round((val + m) * 255));
    return rgb;
  }

  /**
  * Convert a 3 element srgb tuple to a six digit hexcode
  * @param {number[]} rgb - The srgb tuple
  * @return {string} The hexcode
  */
  static rgbToHex(rgb) {
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    // Use built-in toString to convert to hexadecimal
    // Prepend single digit conversion with '0'
    const hexChar = function hexChar(c) {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + hexChar(r) + hexChar(g) + hexChar(b);
  }

  /**
  * Convert a three or six digit hexcode to srgb
  * @param {string} hex - The hexcode
  * @return {number[]} The srgb tuple
  */
  static hexToRgb(hex) {
    // If 3 digit hexcode then double each digit 6 digit
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
    // Use built-in base16 parser to convert to rgb
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // Cant use map since first element of result is the whole matched string
    return result ?
      [parseInt(result[1], 16), parseInt(result[2], 16),
        parseInt(result[3], 16)] :
      null;
  }

  /**
  * Convert a 3 element srgb tuple to a 3 element xyz tuple.
  * @param {number[]} rgb - The srgb tuple
  * @return {number[]} The xyz tuple
  */
  static rgbToXyz(rgb) {
    // Normalise rgb to [0,1]
    const cR = rgb[0] / 255;
    const cG = rgb[1] / 255;
    const cB = rgb[2] / 255;
    // sRGB is a gamma corrected format (a method of adjusting color
    // to match non linear human perception of light) gamma correction
    // must undone. The inverse function is linear below a corrected
    // value of 0.04045 since gamma correction is linear at 0.0031308
    const invCompand = (c) => (c <= 0.04045) ?
      c / 12.92 :
      Math.pow((c + 0.055) / 1.055, 2.4);
    const invR = invCompand(cR);
    const invG = invCompand(cG);
    const invB = invCompand(cB);
    // Linear rgb is then undergoes a forward transformation to xyz
    const x = 0.4124 * invR + 0.3576 * invG + 0.1805 * invB;
    const y = 0.2126 * invR + 0.7152 * invG + 0.0722 * invB;
    const z = 0.0193 * invR + 0.1192 * invG + 0.9505 * invB;
    // xyz scaled to [0,100]
    return [x * 100, y * 100, z * 100];
  }

  /**
  * Convert a 3 element xyz tuple to a 3 element srgb tuple.
  * @param {number[]} xyz - The xyz tuple
  * @return {number[]} The srgb tuple
  */
  static xyzToRgb(xyz) {
    // xyz is normalized to [0,1]
    const x = xyz[0] / 100;
    const y = xyz[1] / 100;
    const z = xyz[2] / 100;
    // xyz is multiplied by the reverse transformation matrix to linear rgb
    const invR = 3.2406254773200533 * x - 1.5372079722103187 * y -
      0.4986285986982479 * z;
    const invG = -0.9689307147293197 * x + 1.8757560608852415 * y +
      0.041517523842953964 * z;
    const invB = 0.055710120445510616 * x + -0.2040210505984867 * y +
      1.0569959422543882 * z;
    // Linear rgb must be gamma corrected to normalized srgb. Gamma correction
    // is linear for values <= 0.0031308 to avoid infinite log slope near zero
    const compand = (c) => c <= 0.0031308 ?
      12.92 * c :
      1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    const cR = compand(invR);
    const cG = compand(invG);
    const cB = compand(invB);
    // srgb is scaled to [0,255]
    return [Math.round(cR * 255), Math.round(cG * 255), Math.round(cB * 255)];
  }

  /**
  * Convert a 3 element xyz tuple to a 3 element lab tuple.
  * @param {number[]} xyz - The xyz tuple
  * @return {number[]} The lab tuple
  */
  static xyzToLab(xyz) {
    const xR = xyz[0] / Color.d65[0];
    const yR = xyz[1] / Color.d65[1];
    const zR = xyz[2] / Color.d65[2];
    const eps = 216 / 24389;
    const kap = 24389 / 27;
    const fwdTrans = (c) => c > eps ? Math.pow(c, 1 / 3) : (kap * c + 16) / 116;
    const fX = fwdTrans(xR);
    const fY = fwdTrans(yR);
    const fZ = fwdTrans(zR);
    const L = 116 * fY - 16;
    const a = 500 * (fX - fY);
    const b = 200 * (fY - fZ);
    return [L, a, b];
  }

  /**
  * Convert a 3 element lab tuple to a 3 element xyz tuple.
  * @param {number[]} lab - The lab tuple
  * @return {number[]} The xyz tuple
  */
  static labToXyz(lab) {
    const L = lab[0];
    const a = lab[1];
    const b = lab[2];
    const eps = 216 / 24389;
    const kap = 24389 / 27;
    const fY = (L + 16) / 116;
    const fZ = (fY - b / 200);
    const fX = a / 500 + fY;
    const xR = Math.pow(fX, 3) > eps ? Math.pow(fX, 3) : (116 * fX - 16) / kap;
    const yR = L > kap * eps ? Math.pow((L + 16) / 116, 3) : L / kap;
    const zR = Math.pow(fZ, 3) > eps ? Math.pow(fZ, 3) : (116 * fZ - 16) / kap;
    return [xR * Color.d65[0], yR * Color.d65[1], zR * Color.d65[2]];
  }

  /**
  * Convert a 3 element lab tuple to a 3 element lchab tuple.
  * @param {number[]} lab - The lab tuple
  * @return {number[]} The lchab tuple
  */
  static labToLCHab(lab) {
    const a = lab[1];
    const b = lab[2];
    const c = Math.sqrt(a * a + b * b);
    const h = Math.atan2(b, a) >= 0 ?
      Math.atan2(b, a) / Math.PI * 180 :
      Math.atan2(b, a) / Math.PI * 180 + 360;
    return [lab[0], c, h];
  }

  /**
  * Convert a 3 element lchab tuple to a 3 element lab tuple.
  * @param {number[]} lchAB - The lchAB tuple
  * @return {number[]} The lab tuple
  */
  static lchABToLab(lchAB) {
    const c = lchAB[1];
    const h = lchAB[2];
    const a = c * Math.cos(h / 180 * Math.PI);
    const b = c * Math.sin(h / 180 * Math.PI);
    return [lchAB[0], a, b];
  }

  /**
  * Computes luminance of a 3 element tuple or hexcode
  * @param {number[]|string} color - The color tuple or hexcode
  * @param {string} [type='rgb'] - The color space
  * @return {number} The luminance of the color
  * @throws Will throw an error if type is not a string or not a supported type
  */
  static luminance(color, type = 'rgb') {
    if (typeof type !== 'string') {
      throw new TypeError('Parameter 2 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)) {
      throw new TypeError(`Parameter 2 '${type}' is not a valid type.`);
    }
    // Convert any non-rgb color to rgb
    if (type !== 'rgb') {
      color = (new Color({color, type})).rgb;
    }
    // Converts color to luminance as denoted by y from the rgb to xyz
    // conversions above
    for (let i = 0; i < color.length; i++) {
      color[i] /= 255;
      if (color[i] < 0.03928) {
        color[i] /= 12.92;
      } else {
        color[i] = Math.pow((((color[i]) + 0.055) / 1.055), 2.4);
      }
    }
    const r = color[0];
    const g = color[1];
    const b = color[2];

    const l = ((0.2126 * r) + (0.7152 * g) + (0.0722 * b));
    return l;
  }

  /**
  * Returns a random new Color instance
  * @return {Color} The new Color instance
  */
  static random() {
    return new Color({color: [255, 255, 255].map((n) => n * Math.random())});
  }

  /**
  * Returns a random new Color tuple or hexcode
  * @param {string} [type='rgb'] - The color space
  * @return {number[]|string} The 3 element color tuple or hexcode
  * @throws Will throw an error if type is not a string or not a supported type
  */
  static randomOfType(type = 'rgb') {
    if (typeof type !== 'string') {
      throw new TypeError('Parameter 1 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)) {
      throw new TypeError(`Parameter 1 '${type}' is not a valid type.`);
    }
    const randColor = Color.random();
    return randColor[type];
  }

  /**
  * Returns a random color's formatted string
  * @param {string} [type='rgb'] - The color space
  * @param {boolean} [capitalize=true] - Flag for output capitalization
  * @param {number} [precision=3] - Number of decimals in output string
  * @return {string} The formatted color string of the random color
  * @throws Will throw an error if type is not a string or not a supported type
  */
  static randomOfTypeFormatted(type = 'rgb', capitalize = true, precision = 3) {
    if (typeof type !== 'string') {
      throw new TypeError('Parameter 1 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)) {
      throw new TypeError(`Parameter 1 '${type}' is not a valid type.`);
    }
    const randColor = Color.random();
    randColor.capitalize = capitalize;
    randColor.precision = precision;
    return randColor[type + 'String'];
  }

  /**
  * Returns white or black dependent on which has a greater contrast with the
  * given color
  * @param {number[]|string} color - The color tuple or hexcode
  * @param {string} [type='rgb'] - The color space
  * @return {string} The hexcode for white or black
  * @throws Will throw an error if type is not a string or not a supported type
  */
  static contrastTextColor(color, type = 'rgb') {
    if (typeof type !== 'string') {
      throw new TypeError('Parameter 2 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)) {
      throw new TypeError(`Parameter 2 '${type}' is not a valid type.`);
    }
    const contrastWhite = Color.contrastRatio(new Color({
      color: [255, 255, 255],
    }),
    new Color({color, type}));
    const contrastBlack = Color.contrastRatio(new Color({
      color: [0, 0, 0],
    }),
    new Color({color, type}));
    if (contrastWhite > contrastBlack) {
      return '#FFFFFF';
    } else {
      return '#000000';
    }
  }

  /**
  * Computes the contrast ratio between two colors
  * @param {Color} color1 - The first color
  * @param {Color} color2 - The second color
  * @return {number} The contrast ratio between the given colors
  * @throws Will throw an error if either parameter is not a color instance
  */
  static contrastRatio(color1, color2) {
    if (!(color1 instanceof Color)) {
      throw new TypeError('Parameter 1 must be of type Color.');
    }
    if (!(color2 instanceof Color)) {
      throw new TypeError('Parameter 2 must be of type Color.');
    }
    const luminance1 = Color.luminance(color1.rgb) + 0.05;
    const luminance2 = Color.luminance(color2.rgb) + 0.05;
    return luminance2 > luminance1 ?
      luminance2 / luminance1 :
      luminance1 / luminance2;
  }
}
module.exports = Color;
