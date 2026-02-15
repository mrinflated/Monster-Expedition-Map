export interface MapMarker {
    id: string;
    type: 'exhibit' | 'friend' | 'solution' | 'mailbox';
    position: [number, number]; // [lat, lng]
    title?: string;
    description?: string;
    solution_text?: string;
    images?: string[];
}

// Import coordinates
import landmarkData from './LM_coordinates.json';
import friendData from './friend_coordinates.json';
import solutionData from './solutions.json';
import mailboxData from './mailbox_coordinates.json';

// Transform landmarks to MapMarker format
// Map coordinates: position is [lat, lng] where lat = z + 200 (offset), lng = x + 200 (offset)
const landmarks: MapMarker[] = landmarkData.landmarks
    .filter((lm): lm is typeof lm & { x: number; z: number } =>
        typeof lm.x === 'number' && typeof lm.z === 'number'
    )
    .map((landmark) => ({
        id: landmark.name,
        type: 'exhibit' as const,
        position: [landmark.z + 200, landmark.x + 200] as [number, number],
        title: landmark.title ?? '',
        description: landmark.description ?? '',
    }));

const friends: MapMarker[] = friendData.friends
    .map((friend) => ({
        id: friend.name,
        type: 'friend' as const,
        position: [friend.z, friend.x] as [number, number],
    }));

const solutions: MapMarker[] = solutionData.map((sol, idx) => ({
    id: `solution_${sol.coordinates.x}_${sol.coordinates.z}_${idx}`,
    type: 'solution' as const,
    position: [sol.coordinates.z, sol.coordinates.x] as [number, number],
    solution_text: sol.solution_text,
    images: sol.images,
}));

const mailboxes: MapMarker[] = mailboxData.mailboxes
    .map((mailbox) => ({
        id: mailbox.name,
        type: 'mailbox' as const,
        position: [mailbox.z, mailbox.x] as [number, number],
    }));

export const initialMarkers: MapMarker[] = [...landmarks, ...friends, ...solutions, ...mailboxes];
