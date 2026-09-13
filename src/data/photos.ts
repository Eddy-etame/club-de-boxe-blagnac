/**
 * Photo registry: what each photo shows, where it was taken, who took it.
 *
 * Every photograph on this site comes from another club of the Boxing Center
 * network — none shows the Blagnac room. Captions say so; alts describe the
 * scene only. A photographer is credited only on evidence: the EXIF artist
 * field or the visible watermark (.research/photo-curation/rights-metadata.json
 * and a frame-by-frame check, 2026-09-13). `shotAt` is set only when the
 * source file names the room (PHOTOS PUB BOXING CENTER JEUDI PORTET_*, the
 * TMBC commission); otherwise the caption stays with "un club du réseau".
 *
 * `sharedWith` records sibling sites that serve the same frame (perceptual
 * hash distance 0): kept for the owner's decision on duplicates across the
 * network, never shown.
 */

export type Room = 'portet' | 'tmbc' | null;

export type PhotoEntry = {
  file: string;
  inventoryId: string | null;
  credit: 'Axel Derewiany' | 'Cécile Domenech';
  evidence: 'exif' | 'watermark';
  shotAt: Room;
  sharedWith: string[];
  /** What is visible, in a few words. Never a place. */
  scene: string;
};

const ROOM: Record<Exclude<Room, null>, string> = {
  portet: 'Boxing Center Portet',
  tmbc: 'Toulouse Minimes Boxing Club'
};

export const PHOTOS: PhotoEntry[] = [
  { file: 'garde-boxeuse', inventoryId: 'BC-078', credit: 'Axel Derewiany', evidence: 'exif', shotAt: null, sharedWith: ['bc-st-cyprien'], scene: 'Boxeuse en garde, gants levés' },
  { file: 'cours-collectif-sacs', inventoryId: 'BC-063', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: ['bc-st-cyprien'], scene: 'Cours collectif entre les sacs de frappe' },
  { file: 'sacs-de-frappe', inventoryId: 'BC-023', credit: 'Cécile Domenech', evidence: 'exif', shotAt: 'tmbc', sharedWith: [], scene: 'Boxeuse en garde face au sac' },
  { file: 'shadow-boxing', inventoryId: 'BC-079', credit: 'Axel Derewiany', evidence: 'exif', shotAt: null, sharedWith: ['bc-st-cyprien'], scene: 'Shadow boxing, sans partenaire' },
  { file: 'travail-aux-pattes', inventoryId: 'BC-075', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: [], scene: 'Exercice à deux, l’un frappe, l’autre garde' },
  { file: 'salle-de-boxe', inventoryId: 'BC-028', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: 'portet', sharedWith: [], scene: 'Ring, sacs et tapis d’une salle de boxe' },
  { file: 'frappe-au-sac', inventoryId: 'BC-064', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: ['bc-st-cyprien'], scene: 'Boxeuse au sac de frappe' },
  { file: 'boxeuse-sac', inventoryId: 'BC-062', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: ['bc-st-cyprien'], scene: 'Direct au sac de frappe' },
  { file: 'renforcement-groupe', inventoryId: 'BC-067', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: [], scene: 'Gainage au sol, en groupe' },
  { file: 'cours-debout-groupe', inventoryId: 'BC-072', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: [], scene: 'Renforcement debout, kettlebells et haltères' },
  { file: 'coaching-individuel', inventoryId: 'BC-071', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: [], scene: 'Renforcement aux haltères' },
  { file: 'coin-de-ring', inventoryId: 'BC-076', credit: 'Axel Derewiany', evidence: 'exif', shotAt: null, sharedWith: ['bc-minimes'], scene: 'Consigne d’entraîneur sur le ring' },
  { file: 'ring-encadrement', inventoryId: 'BC-077', credit: 'Axel Derewiany', evidence: 'exif', shotAt: null, sharedWith: ['bc-minimes'], scene: 'Travail encadré sur le ring' },
  { file: 'accueil-club', inventoryId: 'BC-030', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: 'portet', sharedWith: [], scene: 'Accueil d’une salle de boxe' },
  { file: 'espace-renforcement', inventoryId: 'BC-069', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: [], scene: 'Appareils de renforcement musculaire' },
  { file: 'sparring-ring', inventoryId: 'BC-034', credit: 'Axel Derewiany', evidence: 'watermark', shotAt: 'portet', sharedWith: [], scene: 'Échange encadré sur le ring' },
  { file: 'cours-enfants', inventoryId: 'BC-021', credit: 'Cécile Domenech', evidence: 'exif', shotAt: 'tmbc', sharedWith: [], scene: 'Échauffement collectif, plots au sol' },
  { file: 'conseil-coach', inventoryId: 'BC-080', credit: 'Axel Derewiany', evidence: 'exif', shotAt: null, sharedWith: [], scene: 'Un entraîneur tient le sac et corrige' },
  { file: 'boxe-detail', inventoryId: null, credit: 'Axel Derewiany', evidence: 'watermark', shotAt: 'portet', sharedWith: [], scene: 'Garde haute, bandes aux mains' },
  { file: 'boxe-corner', inventoryId: null, credit: 'Axel Derewiany', evidence: 'watermark', shotAt: null, sharedWith: [], scene: 'Échange technique entre deux boxeuses' }
];

const byFile = new Map(PHOTOS.map((p) => [p.file, p]));

export function photo(file: string): PhotoEntry {
  const entry = byFile.get(file);
  if (!entry) throw new Error(`photos.ts: unknown photo "${file}"`);
  return entry;
}

/** "Photo prise au Boxing Center Portet · © Axel Derewiany" */
export function photoRoom(file: string): string {
  const p = photo(file);
  const where = p.shotAt ? `Photo prise au ${ROOM[p.shotAt]}` : 'Photo prise dans un club du réseau Boxing Center';
  return `${where} · © ${p.credit}`;
}

/** Scene, then room and credit: the full caption. */
export function photoCaption(file: string): string {
  return `${photo(file).scene}. ${photoRoom(file)}`;
}

export const PHOTOGRAPHERS = [...new Set(PHOTOS.map((p) => p.credit))];
