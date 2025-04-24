const db = require("../db");

exports.addPoints = async (userId, points) => {
    const userRef = db.ref(`users/${userId}/points`);
    const userSnapshot = await userRef.once('value');
    const currentPoints = userSnapshot.val() || 0;
    const newPoints = currentPoints + points;
    await userRef.set(newPoints);
    return newPoints;
};

exports.addLevel = async (userId, level) => {
    const levelRef = db.ref(`users/${userId}/level`);
    await levelRef.set(level);
};

exports.addChallenges = async (userId, challenges) => {
    const challengesRef = db.ref(`users/${userId}/challenges`);
    await challengesRef.set(challenges);
};
