const API_BASE_URL = 'https://emp25-backend.hackathon.varram.me';

export interface Beacon {
  id: string;
  title: string;
  description: string;
  location: string;
  votes?: number;
  image: string;
  wheelchairAccessible: boolean;
  audioAccessible: boolean;
  visionAccessible: boolean;
  _id: string;
}

export async function getAllBeacons(): Promise<Beacon[]> {
  const response = await fetch(`${API_BASE_URL}/beacons`);
  if (!response.ok) {
    throw new Error(`Failed to fetch beacons: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createBeacon(beaconData: any): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/beacons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(beaconData),
  });
  if (!response.ok) {
    throw new Error('Failed to create beacon');
  }
}

export async function deleteBeacon(beaconId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/ansel/${beaconId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete beacon');
  }
}

export async function upvoteBeacon(beaconId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/beacons/${beaconId}/upvote`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to upvote beacon');
  }
}

export async function downvoteBeacon(beaconId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/beacons/${beaconId}/downvote`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to downvote beacon');
  }
}
