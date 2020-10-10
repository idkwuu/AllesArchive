module.exports = ({time, content, icon}) => {
    if (typeof time !== "undefined") {
        if (typeof time !== "number") return;
        if (time < 10) return;
        if (time > 60 * 60 * 24 * 7) return;
        if (Math.floor(time) !== time) return;

        if (typeof content !== "undefined") {
            if (typeof content !== "string") return;
            if (content.trim() !== content) return;
            if (content.length < 3) return;
            if (content.length > 100) return;

            if (typeof icon !== "undefined") {
                if (typeof icon !== "string") return;
                if (icon.trim().toLowerCase() !== icon) return;
                if (icon.length < 5) return;
                if (icon.length > 25) return;
            }
        } else if (typeof icon !== "undefined") return;
    } else {
        if (typeof content !== "undefined") return;
        if (typeof icon !== "undefined") return;
    }

    return true;
};