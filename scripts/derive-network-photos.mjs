/**
 * Derives web assets from photos the Boxing Center network publishes on
 * boxingcenter.fr — the children's and teenagers' courses, which the audited
 * archive (derive-photos.mjs) does not cover.
 *
 * Sources live in .research/photo-curation/network/ (never in Git); each is
 * listed with the network page it was taken from in src/data/photos.ts. They
 * carry no photographer EXIF and no watermark, so the network is credited as
 * the source. The derivatives are resized only, and each one carries XMP that
 * names the Blagnac course it illustrates, the credit, the rights and the page
 * that states them — never GPS, and never a place the photo was not taken.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = '.research/photo-curation/network';
const OUT = 'public/images';
const SITE = (process.env.PUBLIC_SITE_URL || 'https://www.club-boxe-blagnac.fr').replace(/\/$/, '');

const WANTED = [
  {
    source: 'boxing-center-tournoi-boxing-trophy-youth-boxe-educative.webp',
    name: 'boxe-educative-blagnac',
    widths: [480, 960, 1600],
    title: 'Boxe éducative, de 7 à 12 ans — Club de Boxe Blagnac',
    description:
      'Illustration du cours de boxe éducative du Club de Boxe Blagnac (réseau Boxing Center) : assaut en touche légère entre deux enfants casqués, sous le regard des juges. Photo de la photothèque Boxing Center, prise lors d’un tournoi de boxe éducative.'
  },
  {
    source: 'valentin-tapia-mitaines-jeune-toulouse.jpeg',
    name: 'boxe-ados-blagnac',
    widths: [480, 960, 1600],
    title: 'Boxe ados, de 13 à 17 ans — Club de Boxe Blagnac',
    description:
      'Illustration du cours de boxe ados du Club de Boxe Blagnac (réseau Boxing Center) : un entraîneur tient les pattes d’ours, un jeune boxeur enchaîne. Photo de la photothèque Boxing Center, prise dans un club du réseau.'
  },
  {
    source: 'pole-boxe-educative-boxing-center-web.webp',
    name: 'boxe-enfant-blagnac',
    widths: [480, 700],
    title: 'Boxe enfant — Club de Boxe Blagnac',
    description:
      'Illustration des cours enfants du Club de Boxe Blagnac (réseau Boxing Center) : un jeune boxeur casqué, garde haute face à son partenaire. Photo de la photothèque Boxing Center, prise dans un club du réseau.'
  }
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const alt = (s) => `<rdf:Alt><rdf:li xml:lang="x-default">${esc(s)}</rdf:li></rdf:Alt>`;

function xmp({ title, description }) {
  return [
    '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">',
    '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    '<rdf:Description rdf:about=""',
    ' xmlns:dc="http://purl.org/dc/elements/1.1/"',
    ' xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"',
    ' xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"',
    ' photoshop:Credit="Boxing Center"',
    ` xmpRights:WebStatement="${SITE}/mentions-legales/#photographies">`,
    `<dc:title>${alt(title)}</dc:title>`,
    `<dc:description>${alt(description)}</dc:description>`,
    '<dc:creator><rdf:Seq><rdf:li>Boxing Center</rdf:li></rdf:Seq></dc:creator>',
    `<dc:rights>${alt('© Boxing Center')}</dc:rights>`,
    '</rdf:Description>',
    '</rdf:RDF>',
    '</x:xmpmeta>',
    '<?xpacket end="w"?>'
  ].join('');
}

mkdirSync(OUT, { recursive: true });
let made = 0;

for (const photo of WANTED) {
  const src = join(SRC, photo.source);
  const packet = xmp(photo);
  const largest = Math.max(...photo.widths);
  const meta = await sharp(src).metadata();

  for (const width of photo.widths) {
    await sharp(src).resize({ width, withoutEnlargement: true }).withXmp(packet).webp({ quality: 82 }).toFile(join(OUT, `${photo.name}-${width}.webp`));
    made += 1;
  }
  await sharp(src).resize({ width: largest, withoutEnlargement: true }).withXmp(packet).jpeg({ quality: 84, mozjpeg: true }).toFile(join(OUT, `${photo.name}-${largest}.jpg`));
  made += 1;

  const height = Math.round((meta.height / meta.width) * Math.min(largest, meta.width));
  console.log(`  ${photo.source} -> ${photo.name} (${Math.min(largest, meta.width)}x${height}) ${photo.widths.join('/')} webp + jpg`);
}

console.log(`\nDerived ${made} files into ${OUT}.`);
