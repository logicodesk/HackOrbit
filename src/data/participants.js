// Seed participant data — used as initial state
export const SEED_PARTICIPANTS = [
  { id: 1,  name: 'Aisha Patel',      team: 'NeuralNinjas',   track: 'AI/ML',             score: 9840, joinedAt: Date.now() - 86400000 * 5 },
  { id: 2,  name: 'Marcus Chen',      team: 'ChainBreakers',  track: 'Web3 & Blockchain',  score: 9610, joinedAt: Date.now() - 86400000 * 4 },
  { id: 3,  name: 'Sofia Reyes',      team: 'GreenByte',      track: 'Sustainability',     score: 9480, joinedAt: Date.now() - 86400000 * 4 },
  { id: 4,  name: 'Liam O\'Brien',    team: 'MedHackers',     track: 'Healthcare Tech',    score: 9200, joinedAt: Date.now() - 86400000 * 3 },
  { id: 5,  name: 'Priya Sharma',     team: 'NeuralNinjas',   track: 'AI/ML',             score: 9050, joinedAt: Date.now() - 86400000 * 3 },
  { id: 6,  name: 'Ethan Brooks',     team: 'ChainBreakers',  track: 'Web3 & Blockchain',  score: 8870, joinedAt: Date.now() - 86400000 * 2 },
  { id: 7,  name: 'Yuki Tanaka',      team: 'PixelPulse',     track: 'AI/ML',             score: 8640, joinedAt: Date.now() - 86400000 * 2 },
  { id: 8,  name: 'Amara Diallo',     team: 'GreenByte',      track: 'Sustainability',     score: 8420, joinedAt: Date.now() - 86400000 * 1 },
  { id: 9,  name: 'Carlos Mendez',    team: 'MedHackers',     track: 'Healthcare Tech',    score: 8190, joinedAt: Date.now() - 86400000 * 1 },
  { id: 10, name: 'Zara Ahmed',       team: 'PixelPulse',     track: 'AI/ML',             score: 7980, joinedAt: Date.now() - 3600000 * 6  },
  { id: 11, name: 'Noah Williams',    team: 'ByteForce',      track: 'Web3 & Blockchain',  score: 7750, joinedAt: Date.now() - 3600000 * 5  },
  { id: 12, name: 'Fatima Hassan',    team: 'EcoSpark',       track: 'Sustainability',     score: 7530, joinedAt: Date.now() - 3600000 * 4  },
];

export const FAKE_NAMES = [
  'Alex Kim','Jordan Lee','Sam Rivera','Taylor Swift','Morgan Blake',
  'Casey Quinn','Riley Park','Drew Santos','Jamie Cruz','Avery Hall',
  'Blake Torres','Cameron Ross','Dana White','Elliot Gray','Finley Moore',
  'Harper Stone','Indira Nair','Jesse Patel','Kai Nakamura','Luna Vega',
  'Milo Chen','Nadia Osei','Omar Farooq','Petra Novak','Quinn Adler',
  'Ravi Gupta','Sasha Ivanov','Tara Singh','Uma Johansson','Victor Lam',
];

export const FAKE_TEAMS = [
  'NeuralNinjas','ChainBreakers','GreenByte','MedHackers','PixelPulse',
  'ByteForce','EcoSpark','QuantumLeap','DataDrifters','CodeCraft',
  'NeonStack','VoidRunners','AlphaBuilders','ZeroDay','HackPack',
];

export const TRACKS = ['AI/ML','Web3 & Blockchain','Healthcare Tech','Sustainability'];

// Avatar gradient palettes — one per letter bucket
export const AVATAR_GRADIENTS = [
  ['#8b5cf6','#6d28d9'],['#06b6d4','#0284c7'],['#ec4899','#be185d'],
  ['#f59e0b','#d97706'],['#10b981','#059669'],['#f97316','#ea580c'],
  ['#6366f1','#4338ca'],['#14b8a6','#0d9488'],['#e879f9','#c026d3'],
  ['#84cc16','#65a30d'],
];

export function getGradient(name) {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

export function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}
