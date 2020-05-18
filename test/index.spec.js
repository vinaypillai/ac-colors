const process = require("process");
const assert = require("chai").assert;
const Color = require("../index.min.js");
const testColors = require("./256colors.js")

describe("Color",function(){
    describe("#constructor",function(){
        let c;
        testColors.forEach((color,i)=>{
            const rgbArray = Object.values(color.rgb);
            context(`Input:"${rgbArray} ID:${color.colorId}"`,function(){
                it("should convert rgb array to rgb array",function(){
                    c = new Color({"color":rgbArray});
                    assert.deepEqual(c.rgb,Object.values(color.rgb));
                })
                it("should convert rgb to hex string",function(){
                    c = new Color({"color":rgbArray});
                    assert.strictEqual(c.hex,color.hexString);
                })
                it("should convert rgb to hsl array",function(){
                    c = new Color({"color":rgbArray});
                    // Dataset truncates to 2 decimal places
                    assert.deepEqual(c.hsl.map((n)=>Math.round(n*100)/100),Object.values(color.hsl));
                })
            })
            const hslArray = Object.values(color.hsl);
            context(`Input:"${hslArray} ID:${color.colorId}"`,function(){
                it("should convert hsl array to rgb array",function(){
                    c = new Color({"color":hslArray,"type":"hsl"});
                    assert.deepEqual(c.rgb,Object.values(color.rgb));
                })
                it("should convert hsl to hex string",function(){
                    c = new Color({"color":hslArray,"type":"hsl"});
                    assert.strictEqual(c.hex,color.hexString);
                })
                it("should convert hsl to hsl array",function(){
                    c = new Color({"color":hslArray,"type":"hsl"});
                    // Dataset truncates to nearest int
                    assert.deepEqual(c.hsl.map((n)=>Math.round(n*100)/100),Object.values(color.hsl));
                })
            })
            const hexString = color.hexString;
            context(`Input:"${hexString} ID:${color.colorId}"`,function(){
                it("should convert hex array to rgb array",function(){
                    c = new Color({"color":hexString,"type":"hex"});
                    assert.deepEqual(c.rgb,Object.values(color.rgb));
                })
                it("should convert hex to hex string",function(){
                    c = new Color({"color":hexString,"type":"hex"});
                    assert.strictEqual(c.hex,color.hexString);
                })
                it("should convert hex to hsl array",function(){
                    c = new Color({"color":hexString,"type":"hex"});
                    // Dataset truncates to nearest int
                    assert.deepEqual(c.hsl.map((n)=>Math.round(n*100)/100),Object.values(color.hsl));
                })
            })
            // Test conversion to format
            context(`Input:"${rgbArray} ID:${color.colorId}"`,function(){
                it("should convert rgb array to rgb string",function(){
                    c = new Color({"color":rgbArray});
                    assert.strictEqual(c.rgbString,`RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
                })
                it("should convert rgb to hex string",function(){
                    c = new Color({"color":rgbArray});
                    assert.strictEqual(c.hexString,color.hexString.toUpperCase());
                })
                it("should convert rgb to hsl string",function(){
                    c = new Color({"color":rgbArray});
                    // Dataset truncates to 2 decimal places
                    assert.strictEqual(c.hslString,`HSL(${c.hsl[0].toFixed(3)}, ${c.hsl[1].toFixed(3)}, ${c.hsl[2].toFixed(3)})`);
                })
            })
            // Test precision parameter
            context(`Input:"${rgbArray} ID:${color.colorId}"`,function(){
                it("should convert rgb array to rgb string",function(){
                    c = new Color({"color":rgbArray,"precision":2});
                    assert.strictEqual(c.rgbString,`RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
                })
                it("should convert rgb to hex string",function(){
                    c = new Color({"color":rgbArray,"precision":2});
                    assert.strictEqual(c.hexString,color.hexString.toUpperCase());
                })
                it("should convert rgb to hsl string",function(){
                    c = new Color({"color":rgbArray,"precision":2});
                    // Dataset truncates to 2 decimal places
                    assert.strictEqual(c.hslString,`HSL(${c.hsl[0].toFixed(2)}, ${c.hsl[1].toFixed(2)}, ${c.hsl[2].toFixed(2)})`);
                })
            })
            // Test capitalize parameter
            context(`Input:"${rgbArray} ID:${color.colorId}"`,function(){
                it("should convert rgb array to rgb string",function(){
                    c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    assert.strictEqual(c.rgbString,`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
                })
                it("should convert rgb to hex string",function(){
                    c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    assert.strictEqual(c.hexString,color.hexString.toLowerCase());
                })
                it("should convert rgb to hsl string",function(){
                    c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    // Dataset truncates to 2 decimal places
                    assert.strictEqual(c.hslString,`hsl(${c.hsl[0].toFixed(2)}, ${c.hsl[1].toFixed(2)}, ${c.hsl[2].toFixed(2)})`);
                })
            })            
            // Test reactivity
            context(`Input:"${hexString} ID:${color.colorId}"`,function(){
                it("should convert hex array to rgb array",function(){
                    c = new Color({"color":hexString,"type":"hex"});
                    assert.deepEqual(c.rgb,Object.values(color.rgb));
                    c.hex="#000000";
                    assert.deepEqual(c.rgb,[0,0,0]);
                })
                it("should convert hex to hex string",function(){
                    c = new Color({"color":hexString,"type":"hex"});
                    assert.strictEqual(c.hex,color.hexString);
                    c.hex="#000000";
                    assert.deepEqual(c.hex,"#000000");
                })
                it("should convert hex to hsl array",function(){
                    c = new Color({"color":hexString,"type":"hex"});
                    // Dataset truncates to nearest int
                    assert.deepEqual(c.hsl.map((n)=>Math.round(n*100)/100),Object.values(color.hsl));
                    c.hex="#000000";
                    assert.deepEqual(c.hsl,[0,0,0]);
                })
            })
            // Test capitalize parameter
            context(`Input:"${rgbArray} ID:${color.colorId}"`,function(){
                it("should convert rgb array to rgb string",function(){
                    c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    c2 = new Color({"color":c.lab,"type":"lab","precision":2,"capitalize":false});
                    assert.strictEqual(c.rgbString,c2.rgbString);
                })
                it("should convert rgb to hex string",function(){
                     c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    c2 = new Color({"color":c.lchab,"type":"lchab","precision":2,"capitalize":false});
                    assert.strictEqual(c.rgbString,c2.rgbString);
                })
                it("should convert rgb to hsl string",function(){
                    c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    c2 = new Color({"color":c.xyz,"type":"xyz","precision":2,"capitalize":false});
                    assert.strictEqual(c.rgbString,c2.rgbString);
                })
            })
             context(`Input:various constructor parameters ID:${color.colorId}"`,function(){
                it("should convert create a color object",function(){
                    c = new Color();
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"color":rgbArray});
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"precision":2});
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"capitalize":false});
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"color":rgbArray,"precision":2});
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"color":rgbArray,"capitalize":false});
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"precision":2,"capitalize":false});
                    assert.instanceOf(c, Color);
                })
                it("should convert create a color object",function(){
                    c = new Color({"color":rgbArray,"precision":2,"capitalize":false});
                    assert.instanceOf(c, Color);
                })
            })
            context(`Should throw error for type`,function(){
                context(`throw error for type"`,function(){
                    it("should returns #000000",function(){
                        assert.throws(()=>{new Color({"color":[0,0,0],"type":null})},TypeError,"Parameter 2 must be of type string");
                    })
                    it("should returns #000000",function(){
                        assert.throws(()=>{new Color({"color":[0,0,0],"type":"asd"})},TypeError,"Parameter 2 'asd' is not a valid type");
                    })
                })
            })  
        })
    })
    describe("#updateColor",function(){
        context(`Input:"${[85,46,58]}`,function(){
            it("should returns update Colors value`",function(){
                const green = new Color({"color":[0,255,0]});
                green.updateColor([0,0,0]);
                assert.deepEqual(green.hexString,"#000000");
            })
        })
    })
    describe("#rgbToHsl",function(){
        context(`Input:"${[85,46,58]}`,function(){
            it("should returns a three element array `[h,s,l]`",function(){
                assert.deepEqual(Color.rgbToHsl([85,46,58]),[341.53846153846155,29.770992366412212,25.68627450980392]);
            })
        })
    })
    describe("#hslToRgb",function(){
        context(`Input:"${[341.538,29.771,25.686]}`,function(){
            it("should returns a three element array `[r,g,b]`",function(){
                assert.deepEqual(Color.hslToRgb([341.538,29.771,25.686]),[85,46,58]);
            })
        })
        context(`Input:Measure non finite and negative inputs`,function(){
            it("should returns a three element array `[r,g,b]`",function(){
                assert.deepEqual(Color.hslToRgb([341.538,1/0,25.686]),Color.hslToRgb([341.538,0,25.686]));
            })
            it("should returns a three element array `[r,g,b]`",function(){
                assert.deepEqual(Color.hslToRgb([1/0,1/0,25.686]),Color.hslToRgb([0,0,25.686]));
            })
            it("should returns a three element array `[r,g,b]`",function(){
                assert.deepEqual(Color.hslToRgb([1/0,1/0,1/0]),Color.hslToRgb([0,0,0]));
            })
            it("should returns a three element array `[r,g,b]`",function(){
                assert.deepEqual(Color.hslToRgb([-90,90,90]),Color.hslToRgb([270,90,90]));
            })
        })
    })
    describe("#rgbToHex",function(){
        context(`Input:"${[85,46,58]}`,function(){
            it("should returns the color's hex code.`",function(){
                assert.strictEqual(Color.rgbToHex([85,46,58]),"#552e3a");
            })
        })
    })
    describe("#hexToRgb",function(){
        context(`Input:#552e3a`,function(){
            it("should returns a three element array `[r,g,b]`.`",function(){
                assert.deepEqual(Color.hexToRgb("#552e3a"),[85,46,58]);
            })
        })
        context(`Input:#333`,function(){
            it("should returns a three element array `[r,g,b]`.`",function(){
                assert.deepEqual(Color.hexToRgb("#333"),[51,51,51]);
            })
        })
        context(`Input:#dfgdasd`,function(){
            it("should returns a three element array `[r,g,b]`.`",function(){
                assert.isNull(Color.hexToRgb("#asdasdasd"));
            })
        })
    })
    describe("#rgbToXyz",function(){
        context(`Input:"${[85,46,58]}`,function(){
            it("should returns a three element array `[x,y,z]`",function(){
                assert.deepEqual(Color.rgbToXyz([85,46,58]),[5.487210819926342,4.191199198154069,4.522146326583249]);
            })
        })
    })
    describe("#xyzToRgb",function(){
        context(`Input:"${[5.487,4.191,4.522]}`,function(){
            it("should returns a three element array `[r,g,b]`",function(){
                assert.deepEqual(Color.xyzToRgb([5.487,4.191,4.522]),[85,46,58]);
            })
        })
    })
    describe("#xyzToLab",function(){
        context(`Input:"${[5.487,4.191,4.522]}`,function(){
            it("should returns a three element array `[l,a,b]`",function(){
                assert.deepEqual(Color.xyzToLab([5.487,4.191,4.522]),[24.293087120125165,19.569939475918424, 0.21036055335774684]);
            })
        })
    })
    describe("#labToXyz",function(){
        context(`Input:"${[24.294,19.570,0.211]}`,function(){
            it("should returns a three element array `[x,y,z]`",function(){
                assert.deepEqual(Color.labToXyz([24.294,19.570,0.211]),[5.487340335536105,4.191284860245909,4.5221830392095095]);
            })
        })
    })
    describe("#labToLCHab",function(){
        context(`Input:"${[24.294,19.570,0.211]}`,function(){
            it("should returns a three element array `[l,c,h]`",function(){
                assert.deepEqual(Color.labToLCHab([24.294,19.570,0.211]),[24.294,19.57113744778264,0.617728209288702]);
            })
        })
    })
    describe("#lchABToLab",function(){
        context(`Input:"${[24.294,19.570,0.211]}`,function(){
            it("should returns a three element array `[l,a,b]`",function(){
                assert.deepEqual(Color.lchABToLab([24.294,19.571,0.617]),[24.294, 19.56986524034229,0.21074979203493507]);
            })
        })
    })
    describe("#luminance",function(){
        context(`Input:"${[0,255,0]}`,function(){
            it("should returns a decimal luminance",function(){
                assert.strictEqual(Color.luminance([0,255,0]),0.7152);
            })
        })
        context(`Input:"#ff0000","hex"`,function(){
            it("should returns a decimal luminance",function(){
                assert.strictEqual(Color.luminance("#ff0000","hex"),0.2126);
            })
        })
        context(`throw error for type"`,function(){
            it("should returns #000000",function(){
                assert.throws(()=>{Color.luminance([0,0,0],null)},TypeError,"Parameter 2 must be of type string");
            })
            it("should returns #000000",function(){
                assert.throws(()=>{Color.luminance([0,0,0],"asd")},TypeError,"Parameter 2 'asd' is not a valid type");
            })
        })
    })
    describe("#random",function(){
        context(`Input:none`,function(){
            it("should returns a new Color instance",function(){
                assert.instanceOf(Color.random(),Color);
            })
        })
    })
    describe("#randomOfType",function(){
        context(`Input:none`,function(){
            it("should returns a new color array",function(){
                const testColor = Color.randomOfType();
                assert.isArray(testColor);
                assert.strictEqual(testColor.length,3);
            })
        })
        context(`Input:hex`,function(){
            it("should returns a new hexcode",function(){
                const testColor = Color.randomOfType("hex");
                assert.isString(testColor);
                assert.strictEqual(testColor.length,7);
            })
        })
        context(`throw error for type"`,function(){
            it("should returns #000000",function(){
                assert.throws(()=>{Color.randomOfType(null)},TypeError,"Parameter 1 must be of type string");
            })
            it("should returns #000000",function(){
                assert.throws(()=>{Color.randomOfType("asd")},TypeError,"Parameter 1 'asd' is not a valid type");
            })
        })
    })
    describe("#randomOfTypeFormatted",function(){
        context(`Input:none`,function(){
            it("should returns a new rgbString",function(){
                const testColor = Color.randomOfTypeFormatted();
                assert.isString(testColor);
                assert.strictEqual(testColor.substr(0,3),"RGB");
            })
        })
        context(`Input:hsl`,function(){
            it("should returns a new hslString",function(){
                const testColor = Color.randomOfTypeFormatted("hsl");
                assert.isString(testColor);
                assert.strictEqual(testColor.substr(0,3),"HSL");
            })
        })
        context(`Input:hsl,false`,function(){
            it("should returns a new loweracase hslString",function(){
                const testColor = Color.randomOfTypeFormatted("hsl",false);
                assert.isString(testColor);
                assert.strictEqual(testColor.substr(0,3),"hsl");
            })
        })
        context(`throw error for type"`,function(){
            it("should returns #000000",function(){
                assert.throws(()=>{Color.randomOfTypeFormatted(null)},TypeError,"Parameter 1 must be of type string");
            })
            it("should returns #000000",function(){
                assert.throws(()=>{Color.randomOfTypeFormatted("asd")},TypeError,"Parameter 1 'asd' is not a valid type");
            })
        })
    })
    describe("#contrastTextColor",function(){
        context(`Input:${[10,20,30]}`,function(){
            it("should returns #FFFFFF",function(){
                assert.strictEqual(Color.contrastTextColor([10,20,30]),"#FFFFFF");
            })
        })
        context(`Input:"#e8e9ea","hex"`,function(){
            it("should returns #000000",function(){
                assert.strictEqual(Color.contrastTextColor("#e8e9ea","hex"),"#000000");
            })
        })
        context(`throw error for type"`,function(){
            it("should returns #000000",function(){
                assert.throws(()=>{Color.contrastTextColor("#e8e9ea",null)},TypeError,"Parameter 2 must be of type string");
            })
            it("should returns #000000",function(){
                assert.throws(()=>{Color.contrastTextColor("#e8e9ea","asd")},TypeError,"Parameter 2 'asd' is not a valid type");
            })
        })
    })
    describe("#contrastRatio",function(){
        context(`Input:red and blue color objects`,function(){
            it("should returns #FFFFFF",function(){
                const red = new Color({"color":"#ff0000","type":"hex"});
                const blue = new Color({"color":[255,255,255]})
                assert.approximately(Color.contrastRatio(red,blue),3.9984767707539985,0.001);
            })
            it("should returns throw an error for color 1",function(){
                const red = new Color({"color":"#ff0000","type":"hex"});
                const blue = new Color({"color":[255,255,255]})
                assert.throws(()=>{Color.contrastRatio(null,blue)},TypeError,"Parameter 1 must be of type Color");
            })
            it("should returns throw an error for color 2",function(){
                const red = new Color({"color":"#ff0000","type":"hex"});
                const blue = new Color({"color":[255,255,255]})
                assert.throws(()=>{Color.contrastRatio(red,null)},TypeError,"Parameter 2 must be of type Color");
            })
        })
    })
    describe("Reacitivity tests",function(){
        context("Initial color: green color object",async function(){
            it("should return a rgbString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                assert.strictEqual(green.rgbString,"RGB(0, 255, 0)")
            })
            it("should return a hslString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.rgb = [255,0,0]
                assert.strictEqual(green.hslString,"HSL(0.000, 100.000, 50.000)")
            })
            it("should return a lowercase hexString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
            })
            it("should return a lowercase 5 precision lchabString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
                assert.strictEqual(green.lchabString,"lchAB(32.29701, 133.81132, 306.28752)")
            })
            it("should return a uppercase 5 precision lchabString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
                green.capitalize = true; 
                assert.strictEqual(green.lchabString,"LCHab(32.29701, 133.81132, 306.28752)")
            })
            it("should return a lowercase 5 precision xyzString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
                assert.strictEqual(green.xyzString,"xyz(18.04375, 7.21750, 95.03041)")
            })
            it("should return a uppercase 5 precision xyzString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
                green.capitalize = true; 
                assert.strictEqual(green.xyzString,"XYZ(18.04375, 7.21750, 95.03041)")
            })
            it("should return a lowercase 5 precision labString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
                assert.strictEqual(green.labString,"lab(32.29701, 79.19457, -107.85958)")
            })
            it("should return a uppercase 5 precision labString",function(){
                const green = new Color({"color":"#00FF00","type":"hex"});
                green.capitalize = false;
                green.rgb = [255,0,0]
                assert.strictEqual(green.hexString,"#ff0000")
                green.lab = [32.297, 79.194, -107.859];
                green.precision = 5;
                green.capitalize = true; 
                assert.strictEqual(green.labString,"LAB(32.29701, 79.19457, -107.85958)")
            })
        })
        context("Supply color from random and test cloning",function(){
            const color = Color.random();
            it("should set same color",function(){
                const rgb = new Color();
                rgb.rgb = color.rgb;
                assert.deepEqual(rgb,color);
            })
            it("should set same color",function(){
                const hex = new Color();
                hex.hex = color.hex;
                assert.deepEqual(hex,color);
            })
            it("should set same color",function(){
                const hsl = new Color();
                hsl.hsl = color.hsl;
                assert.deepEqual(hsl,color);
            })
            it("should set same color",function(){
                const xyz = new Color();
                xyz.xyz = color.xyz;
                assert.deepEqual(xyz,color);
            })
            it("should set same color",function(){
                const lab = new Color();
                lab.lab = color.lab;
                assert.deepEqual(lab,color);
            })
            it("should set same color",function(){
                const lchab = new Color();
                lchab.lchab = color.lchab;
                assert.deepEqual(lchab,color);
            })
        })
    })
})