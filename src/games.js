/*
  GAMES REGISTRY
  ==============
  This file defines all the game The vault supports.
  
  To add a new game:
  1. Add an entry to the GAMES array below
  2. Add a matching logo image to src/assets/games/
  3. That's it — the UI picks it up automatically

  imageKey: must match the filename in src/assets/games/ (without extension)
  color:    used for the card's accent glow — pick a colour from the game's branding
  
 
*/

export const GAMES = [
  {
    id:       'league',
    name:     'League of Legends',
    imageKey: 'League',
    color:    '#C89B3C',  // LoL gold
    platform: 'Riot Games',
  },
  {
    id:       'valorant',
    name:     'Valorant',
    imageKey: 'valorant',
    color:    '#FF4655',  // Valorant red
    platform: 'Riot Games',
  },
  {
    id:       'overwatch',
    name:     'Overwatch 2',
    imageKey: 'overwatch',
    color:    '#F99E1A',  // Overwatch orange
    platform: 'Battle.net',
  },
  {
    id:       'steam',
    name:     'Steam',
    imageKey: 'steam',
    color:    '#1b9fe3',  // Steam blue
    platform: 'Steam',
  },
  {
    id:       'other',
    name:     'Other',
    imageKey: 'other',
    color:    '#6366f1',
    platform: 'Custom',
  },
]

// Lookup a game by its id — used when loading entries from Firestore
export const getGameById = (id) =>
  GAMES.find((g) => g.id === id) ?? GAMES.find((g) => g.id === 'other')