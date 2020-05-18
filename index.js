class Color{
  static validTypes = ['rgb', 'hex', 'hsl', 'xyz', 'lab', 'lchab'];
  constructor({
    color = [0, 0, 0],
    type = 'rgb',
    precision = 3,
    capitalize = true,
  } = {color: [0, 0, 0], type: 'rgb', precision: 3, capitalize: true}){
    this.updateColor(color, type);
    this.precision = precision;
    this.capitalize = capitalize;
  }
  updateColor(color, type = 'rgb'){
    let rgb;
    if (typeof type !== 'string'){
      throw new TypeError('Parameter 2 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)){
      throw new TypeError(`Parameter 2 '${type}' is not a valid type.`);
    }
    switch (type){
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
    if (type !== 'rgb'){
      this.updateColor(rgb, 'rgb');
    }
  }
  // Getters and Setters
  // RGB
  get rgb(){
    return this._rgb;
  }
  get rgbString(){
    const str = 'RGB(' + this.rgb.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }
  set rgb(rgb){
    this.updateColor(rgb, 'rgb');
  }
  // HSL
  get hsl(){
    return this._hsl;
  }
  get hslString(){
    const truncHSL = this.hsl.map((x) => x.toFixed(this.precision));
    const str = 'HSL(' + truncHSL.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }
  set hsl(hsl){
    this.updateColor(hsl, 'hsl');
  }
  // HEX
  get hex(){
    return this._hex;
  }
  get hexString(){
    const str = this._hex;
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }
  set hex(hex){
    this.updateColor(hex, 'hex');
  }
  // XYZ
  get xyz(){
    return this._xyz;
  }
  get xyzString(){
    const truncXYZ = this.xyz.map((x) => x.toFixed(this.precision));
    const str = 'XYZ(' + truncXYZ.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }
  set xyz(xyz){
    this.updateColor(xyz, 'xyz');
  }
  // LAB
  get lab(){
    return this._lab;
  }
  get labString(){
    const truncLAB = this.lab.map((x) => x.toFixed(this.precision));
    const str = 'LAB(' + truncLAB.join(', ') + ')';
    return (this.capitalize) ? str.toUpperCase() : str.toLowerCase();
  }
  set lab(lab){
    this.updateColor(lab, 'lab');
  }
  // LCHAB
  get lchab(){
    return this._lchab;
  }
  get lchabString(){
    let truncLCHAB = this.lchab.map((x) => x.toFixed(this.precision));
    return (this.capitalize) ? 'LCHab(' + truncLCHAB.join(', ') + ')'
      : 'lchAB(' + truncLCHAB.join(', ') + ')';
  }
  set lchab(lchab){
    this.updateColor(lchab, 'lchab');
  }
  // HSL
  static rgbToHsl(rgb){
    const r1 = rgb[0] / 255;
    const g1 = rgb[1] / 255;
    const b1 = rgb[2] / 255;
    const maxColor = Math.max(r1, g1, b1);
    const minColor = Math.min(r1, g1, b1);
    let L = (maxColor + minColor) / 2;
    let S = 0;
    let H = 0;
    if (maxColor !== minColor){
      if (L < 0.5){
        S = (maxColor - minColor) / (maxColor + minColor);
      } else {
        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
      }
      if (r1 === maxColor){
        H = (g1 - b1) / (maxColor - minColor);
      } else if (g1 === maxColor){
        H = 2.0 + (b1 - r1) / (maxColor - minColor);
      } else {
        H = 4.0 + (r1 - g1) / (maxColor - minColor);
      }
    }
    L = L * 100;
    S = S * 100;
    H = H * 60;
    if (H < 0){
      H += 360;
    }
    return [H, S, L];
  }
  static hslToRgb(hsl){
    let h = hsl[0];
    let s = hsl[1];
    let l = hsl[2];
    let r, g, b, m, c, x;

    if (!isFinite(h)){
      h = 0;
    }
    if (!isFinite(s)){
      s = 0;
    }
    if (!isFinite(l)){
      l = 0;
    }
    h /= 60;
    if (h < 0) h = 6 - (-h % 6);
    h %= 6;

    s = Math.max(0, Math.min(1, s / 100));
    l = Math.max(0, Math.min(1, l / 100));

    c = (1 - Math.abs((2 * l) - 1)) * s;
    x = c * (1 - Math.abs((h % 2) - 1));

    if (h < 1) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 2) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 3) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 4) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 5) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    m = l - c / 2;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
  }
  // Hex
  static rgbToHex(rgb){
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    let componentToHex = function componentToHex(c) {
      let hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  static hexToRgb(hex) {
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16),
      parseInt(result[3], 16)] : null;
  }
  // XYZ
  static rgbToXyz(rgb){
    let cR = rgb[0] / 255;
    let cG = rgb[1] / 255;
    let cB = rgb[2] / 255;
    let invCompand = (c) => c <= 0.04045 ? c / 12.92
      : Math.pow((c + 0.055) / 1.055, 2.4);
    let invR = invCompand(cR);
    let invG = invCompand(cG);
    let invB = invCompand(cB);
    let x = 0.4124564 * invR + 0.3575761 * invG + 0.1804375 * invB;
    let y = 0.2126729 * invR + 0.7151522 * invG + 0.0721750 * invB;
    let z = 0.0193339 * invR + 0.1191920 * invG + 0.9503041 * invB;
    return [x * 100, y * 100, z * 100];
  }
  static xyzToRgb(xyz){
    let x = xyz[0] / 100;
    let y = xyz[1] / 100;
    let z = xyz[2] / 100;
    let invR = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    let invG = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
    let invB = 0.0556434 * x + -0.2040259 * y + 1.0572252 * z;
    let compand = (c) => c <= 0.0031308 ? 12.92 * c
      : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    let cR = compand(invR);
    let cG = compand(invG);
    let cB = compand(invB);
    return [Math.round(cR * 255), Math.round(cG * 255), Math.round(cB * 255)];
  }
  // Lab
  static xyzToLab(xyz){
    let d65White = [95.04, 100, 108.8840];
    let xR = xyz[0] / d65White[0];
    let yR = xyz[1] / d65White[1];
    let zR = xyz[2] / d65White[2];
    let eps = 216 / 24389;
    let kap = 24389 / 27;
    let fwdTrans = (c) => c > eps ? Math.pow(c, 1 / 3) : (kap * c + 16) / 116;
    let fX = fwdTrans(xR);
    let fY = fwdTrans(yR);
    let fZ = fwdTrans(zR);
    let L = 116 * fY - 16;
    let a = 500 * (fX - fY);
    let b = 200 * (fY - fZ);
    return [L, a, b];
  }
  static labToXyz(lab){
    let L = lab[0];
    let a = lab[1];
    let b = lab[2];
    let d65White = [95.04, 100, 108.8840];
    let eps = 216 / 24389;
    let kap = 24389 / 27;
    let fY = (L + 16) / 116;
    let fZ = (fY - b / 200);
    let fX = a / 500 + fY;
    let xR = Math.pow(fX, 3) > eps ? Math.pow(fX, 3) : (116 * fX - 16) / kap;
    let yR = L > kap * eps ? Math.pow((L + 16) / 116, 3) : L / kap;
    let zR = Math.pow(fZ, 3) > eps ? Math.pow(fZ, 3) : (116 * fZ - 16) / kap;
    return [xR * d65White[0], yR * d65White[1], zR * d65White[2]];
  }
  // LCHab
  static labToLCHab(lab){
    let a = lab[1];
    let b = lab[2];
    let c = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) >= 0 ? Math.atan2(b, a) / Math.PI * 180 :
      Math.atan2(b, a) / Math.PI * 180 + 360;
    return [lab[0], c, h];
  }
  static lchABToLab(lchAB){
    let c = lchAB[1];
    let h = lchAB[2];
    let a = c * Math.cos(h / 180 * Math.PI);
    let b = c * Math.sin(h / 180 * Math.PI);
    return [lchAB[0], a, b];
  }
  // Misc
  static luminance(color, type = 'rgb'){
    if (typeof type !== 'string'){
      throw new TypeError('Parameter 2 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)){
      throw new TypeError(`Parameter 2 '${type}' is not a valid type.`);
    }
    if (type !== 'rgb'){
      color = (new Color({color, type})).rgb;
    }
    for (let i = 0; i < color.length; i++){
      color[i] /= 255;
      if (color[i] < 0.03928){
        color[i] /= 12.92;
      } else {
        color[i] = Math.pow((((color[i]) + 0.055) / 1.055), 2.4);
      }
    }
    let r = color[0];
    let g = color[1];
    let b = color[2];

    let l = ((0.2126 * r) + (0.7152 * g) + (0.0722 * b));
    return l;
  }
  static random(){
    return new Color({color: [255, 255, 255].map((n) => n * Math.random())});
  }
  static randomOfType(type = 'rgb'){
    if (typeof type !== 'string'){
      throw new TypeError('Parameter 1 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)){
      throw new TypeError(`Parameter 1 '${type}' is not a valid type.`);
    }
    const randColor = Color.random();
    return randColor[type];
  }
  static randomOfTypeFormatted(type = 'rgb', capitalize = true, precision = 3){
    if (typeof type !== 'string'){
      throw new TypeError('Parameter 1 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)){
      throw new TypeError(`Parameter 1 '${type}' is not a valid type.`);
    }
    const randColor = Color.random();
    randColor.capitalize = capitalize;
    randColor.precision = precision;
    return randColor[type + 'String'];
  }
  static contrastTextColor(color, type = 'rgb'){
    if (typeof type !== 'string'){
      throw new TypeError('Parameter 2 must be of type string.');
    }
    type = type.toLowerCase();
    if (!Color.validTypes.includes(type)){
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
    if (contrastWhite > contrastBlack){
      return '#FFFFFF';
    } else {
      return '#000000';
    }
  }
  static contrastRatio(color1, color2){
    if (!(color1 instanceof Color)){
      throw new TypeError('Parameter 1 must be of type Color.');
    }
    if (!(color2 instanceof Color)){
      throw new TypeError('Parameter 2 must be of type Color.');
    }
    const luminance1 = Color.luminance(color1.rgb) + 0.05;
    const luminance2 = Color.luminance(color2.rgb) + 0.05;
    return luminance2 > luminance1 ? luminance2 / luminance1
      : luminance1 / luminance2;
  }
}
module.exports = Color;
