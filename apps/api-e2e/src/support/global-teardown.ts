async function globalTeardown() {
    // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
    // Hint: `globalThis` is shared between setup and teardown.
    const teardownMessage = (
        globalThis as typeof globalThis & {
            __TEARDOWN_MESSAGE__?: string;
        }
    ).__TEARDOWN_MESSAGE__;

    console.log(teardownMessage);
}

module.exports = globalTeardown;
