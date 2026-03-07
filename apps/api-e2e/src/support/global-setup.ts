async function globalSetup() {
    // Start services that the app needs to run (e.g. database, docker-compose, etc.).
    console.log('\nSetting up...\n');

    // Hint: Use `globalThis` to pass variables to global teardown.
    (
        globalThis as typeof globalThis & {
            __TEARDOWN_MESSAGE__?: string;
        }
    ).__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
}

module.exports = globalSetup;
