module.exports = xp => {
    let level = 1;
    let levelMaxXp = 1000;
    let remainingXp = xp;
    while (remainingXp >= levelMaxXp) {
        level++;
        remainingXp -= levelMaxXp;
        levelMaxXp += 100;
    }
    return {
        level,
        levelMaxXp,
        remainingXp
    };
};