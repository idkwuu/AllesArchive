module.exports = ({time, content}) => {
    if (typeof time !== "undefined") {
        if (typeof time !== "number") return;
        if (time < 10) return;
        if (time > 60 * 60 * 24 * 7) return;
        if (Math.floor(time) !== time) return;

        if (typeof content !== "undefined") {
            if (typeof content !== "string") return;
            if (content.trim() !== content) return;
            if (!content.length) return;
            if (content.length > 100) return;
        }
    } else if (typeof content !== "undefined") return;

    return true;
};