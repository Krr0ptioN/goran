const nxPreset = require('@nx/jest/preset').default;

module.exports = {
    passWithNoTests: true,
    ...nxPreset
};
