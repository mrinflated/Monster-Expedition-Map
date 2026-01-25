export const BASE_PATH = '/Monster-Expedition-Map';

export function getAssetPath(path: string): string {
    // If path implies absolute (starts with /), prepend base path
    if (path.startsWith('/')) {
        return `${BASE_PATH}${path}`;
    }
    return `${BASE_PATH}/${path}`;
}
