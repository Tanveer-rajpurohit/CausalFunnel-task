const SESSION_COOKIE = 'cf_session';

const readCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match?.[2] ?? null;
};

const writeCookie = (name: string, value: string): void => {
    document.cookie = `${name}=${value}; path=/; SameSite=Strict`;
};


const getSessionId = (): string => {
    const existing = readCookie(SESSION_COOKIE);
    if (existing) return existing;

    const id = crypto.randomUUID();
    writeCookie(SESSION_COOKIE, id);
    return id;
};

export default getSessionId;