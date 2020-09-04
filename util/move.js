module.exports = (d, s) => {
    /*
    Input: Direction, Speed
    Output: Change in x, Change in y
    This is why I taught myself trigonometry when I was 11 or something
    I basically just copied this code from the original shootydot because I find it very hard to visualise stuff, and I don't know how I figured this out on my own before.
    */

    return {
        x: (Math.cos((d - 90)*(Math.PI/180)) * s),
        y: (Math.sin((d - 90)*(Math.PI/180)) * s)
    };

};