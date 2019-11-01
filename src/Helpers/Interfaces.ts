export interface GlobalEnv {
  WIDTH: number,
  HEIGHT: number,
  SCORE: number,
  LEVEL: number,
  LIFE: number,
  COLOR: string[],
  COS: number[],
  SIN: number[],
  CONFIG: any,
  PLAYER: any,
  NPCs: any[],
  BaseMap: any,
  BeanMap: any
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
