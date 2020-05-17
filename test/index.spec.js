const process = require("process");
const assert = require("chai").assert;
const Color = require("../index.js");
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
        })
    })
})