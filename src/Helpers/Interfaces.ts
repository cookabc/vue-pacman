export interface GlobalEnv {
  COLOR: string[],
  COS: number[],
  SIN: number[],
  SCORE: number,
  LEVEL: number,
  LIFE: number
}

export interface Coord {
  x: number,
  y: number,
  offset: number
}

export interface Vector {
  x: number,
  y: number,
  change?: number
}
