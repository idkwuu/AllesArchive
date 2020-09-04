// Input: Direction, Speed
// Output: Change in x, Change in y

module.exports = (d, s) => ({
    x: (Math.cos((d - 90)*(Math.PI/180)) * s),
    y: (Math.sin((d - 90)*(Math.PI/180)) * s)
});