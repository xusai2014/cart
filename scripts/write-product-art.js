const fs = require('fs')
const path = require('path')

const dir = path.join('apps', 'web', 'public', 'products')
fs.mkdirSync(dir, { recursive: true })

const items = [
  ['stoneware-pour-over', '#E7D7C8', '#6B4636', 'carafe'],
  ['linen-seat-cushion', '#E6E0D4', '#C8B79A', 'cushion'],
  ['oak-task-lamp', '#E4D3BC', '#8A5A32', 'lamp'],
  ['merino-travel-throw', '#D9E0DC', '#315C56', 'throw'],
  ['canvas-weekender', '#E5D8C4', '#6E5844', 'bag'],
  ['glass-bedside-carafe', '#E4EEF0', '#7FA8B0', 'glass'],
  ['beeswax-pillar', '#F3E6C4', '#C9892D', 'candle'],
  ['wool-house-slippers', '#E8D9CC', '#7A5344', 'slipper'],
  ['steel-day-flask', '#E3E6E4', '#3E4744', 'flask'],
  ['cotton-gauze-robe', '#F6F1EA', '#D7CBBE', 'robe'],
  ['ceramic-dinner-plate', '#F4EFE8', '#E7D3C0', 'plate'],
  ['walnut-serving-board', '#E8D2B8', '#6B452C', 'board'],
]

function shape(kind, ink) {
  switch (kind) {
    case 'carafe':
      return `<path d="M330 250h140l-20 90H350z" fill="${ink}"/><rect x="345" y="340" width="110" height="250" rx="40" fill="${ink}" opacity="0.9"/><rect x="360" y="210" width="80" height="40" rx="8" fill="${ink}"/>`
    case 'cushion':
      return `<rect x="210" y="300" width="380" height="380" rx="48" fill="${ink}"/><path d="M250 340h300" stroke="#F7F4EF" stroke-width="8" opacity="0.5"/>`
    case 'lamp':
      return `<polygon points="260,360 540,360 490,180 310,180" fill="${ink}"/><rect x="382" y="360" width="36" height="250" rx="8" fill="${ink}"/><rect x="330" y="600" width="140" height="18" rx="8" fill="${ink}"/>`
    case 'throw':
      return `<path d="M220 320h360v280H280z" fill="${ink}"/><path d="M250 360h300M250 410h280M250 460h260" stroke="#F7F4EF" stroke-width="10" opacity="0.45"/>`
    case 'bag':
      return `<path d="M300 340c0-70 40-110 100-110s100 40 100 110" fill="none" stroke="${ink}" stroke-width="18"/><rect x="230" y="340" width="340" height="280" rx="28" fill="${ink}"/>`
    case 'glass':
      return `<rect x="350" y="230" width="100" height="40" rx="8" fill="${ink}"/><path d="M360 270h80l20 300c4 40-16 70-60 70s-64-30-60-70z" fill="${ink}" opacity="0.85"/>`
    case 'candle':
      return `<rect x="330" y="360" width="140" height="260" rx="12" fill="${ink}"/><path d="M400 360c-20-40 0-70 0-110 30 30 40 70 20 110z" fill="#F4E2A8"/>`
    case 'slipper':
      return `<ellipse cx="330" cy="520" rx="110" ry="70" fill="${ink}"/><ellipse cx="490" cy="500" rx="110" ry="70" fill="${ink}" opacity="0.85"/>`
    case 'flask':
      return `<rect x="330" y="220" width="140" height="36" rx="8" fill="${ink}"/><rect x="350" y="256" width="100" height="360" rx="40" fill="${ink}"/>`
    case 'robe':
      return `<path d="M300 250h200l40 80-50 20v360H310V350l-50-20z" fill="${ink}"/><path d="M400 250v180" stroke="#1C2B27" stroke-width="6" opacity="0.25"/>`
    case 'plate':
      return `<ellipse cx="400" cy="500" rx="220" ry="160" fill="${ink}"/><ellipse cx="400" cy="500" rx="140" ry="90" fill="#F7F4EF" opacity="0.7"/>`
    default:
      return `<rect x="180" y="390" width="440" height="180" rx="24" fill="${ink}"/><circle cx="560" cy="480" r="16" fill="#F7F4EF"/>`
  }
}

for (const [slug, bg, ink, kind] of items) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="${bg}"/>
  <rect x="80" y="80" width="640" height="840" rx="56" fill="#fff" fill-opacity="0.28"/>
  ${shape(kind, ink)}
</svg>
`
  fs.writeFileSync(path.join(dir, `${slug}.svg`), svg)
}

console.log(`wrote ${items.length} svgs`)
