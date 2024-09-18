export async function verifySessionCookies({
    accessCookie,
    refetchCookie,
}: {
    accessCookie?: string;
    refetchCookie?: string;
}) {
    // TODO: check session validity
    // TODO: If acess token is expired get new one with
    // TODO:
    return {
        userId: 'ulid',
    };
}
