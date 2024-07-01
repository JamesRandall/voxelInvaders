export interface Scene {
  resize: () => void
  update: (now: number) => Scene | null
}

//export type RendererFunc = (projectionMatrix: mat4, game: Game, timeDelta: number) => void
