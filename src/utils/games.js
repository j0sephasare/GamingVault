export const GAMES = [
  {
    id:       'League',
    name:     'League of Legends',
    imageKey: 'League',     // exact filename 
    ext:      'png',
    color:    '#C89B3C',
    platform: 'Riot Games',
  },
  {
    id:       'valorant',
    name:     'Valorant',
    imageKey: 'valorant',
    ext:      'png',
    color:    '#FF4655',
    platform: 'Riot Games',
  },
  {
    id:       'overwatch',
    name:     'Overwatch 2',
    imageKey: 'overwatch',
    ext:      'png',
    color:    '#F99E1A',
    platform: 'Battle.net',
  },
  {
    id:       'steam',
    name:     'Steam',
    imageKey: 'steam',
    ext:      'png',
    color:    '#1b9fe3',
    platform: 'Steam',
  },
  {
    id:       'other',
    name:     'Other',
    imageKey: 'other',
    ext:      'png',
    color:    '#6366f1',
    platform: 'Custom',
  },
]

/*
  getGameImageSrc — builds the correct public URL for a game's logo.
  
*/
export const getGameImageSrc = (game) =>
  `/games/${game.imageKey}.${game.ext ?? 'png'}`

export const getGameById = (id) =>
  GAMES.find((g) => g.id === id) ?? GAMES.find((g) => g.id === 'other')