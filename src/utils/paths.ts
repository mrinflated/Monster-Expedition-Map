export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function getAssetPath(path: string): string {
    // If path implies absolute (starts with /), prepend base path
    if (path.startsWith('/')) {
        return `${BASE_PATH}${path}`;
    }
    return `${BASE_PATH}/${path}`;
}
