import { VoxelParticle } from "./VoxelParticle"
import { VoxelRenderingGeometry } from "./VoxelRenderingGeometry"
import { vec3 } from "gl-matrix"

export class VoxelParticleSet {
  verticesBuffer: WebGLBuffer
  normalsBuffer: WebGLBuffer
  textureCoordinatesBuffer: WebGLBuffer
  indicesBuffer: WebGLBuffer
  startingPositionBuffer: WebGLBuffer
  vertexCount: number

  // TODO: eventually we'll separate the below from the above so that we can reuse starting models and animate them
  // in different ways
  startingVelocityBuffer: WebGLBuffer
  startingColorBuffer: WebGLBuffer
  endingColorBuffer: WebGLBuffer
  lifeBuffer: WebGLBuffer

  // These are handled as uniforms
  elapsedTime: number
  position: vec3
  readonly numberOfParticles: number

  constructor(gl: WebGL2RenderingContext, particles: VoxelParticle[], position:vec3) {
    const startingPositions: number[] = []
    const startingColors: number[] = []
    const vertices : number[] = VoxelRenderingGeometry.baseVertices.flatMap(v => [v[0], v[1], v[2]])
    const indices : number[] = VoxelRenderingGeometry.baseIndices.map(i => i + 24)
    const normals : number[] = VoxelRenderingGeometry.baseNormals.flatMap(n => [n[0], n[1], n[2]])
    const textureCoordinates : number[] = VoxelRenderingGeometry.baseTextureCoordinates.flatMap(tc => [tc[0], tc[1]])
    const lives: number[] = particles.map(p => p.life)
    const startingVelocities: number[] = []
    const endingColors: number[] = []

    particles.forEach(particle => {
      startingPositions.push(particle.startingPosition[0])
      startingPositions.push(particle.startingPosition[1])
      startingPositions.push(particle.startingPosition[2])
      startingVelocities.push(particle.startingVelocity[0])
      startingVelocities.push(particle.startingVelocity[1])
      startingVelocities.push(particle.startingVelocity[2])
      startingColors.push(particle.startingColor[0])
      startingColors.push(particle.startingColor[1])
      startingColors.push(particle.startingColor[2])
      startingColors.push(particle.startingColor[3])
      endingColors.push(particle.endingColor[0])
      endingColors.push(particle.endingColor[1])
      endingColors.push(particle.endingColor[2])
      endingColors.push(particle.endingColor[3])
    })

    this.verticesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    this.normalsBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)

    this.textureCoordinatesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    this.indicesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    this.startingPositionBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.startingPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startingPositions), gl.STATIC_DRAW)

    this.startingVelocityBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.startingVelocityBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startingVelocities), gl.STATIC_DRAW)

    this.startingColorBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.startingColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startingColors), gl.STATIC_DRAW)

    this.endingColorBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.endingColorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endingColors), gl.STATIC_DRAW)

    this.lifeBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lifeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lives), gl.STATIC_DRAW)

    this.vertexCount = indices.length
    this.elapsedTime = 0
    this.position = position
    this.numberOfParticles = particles.length
  }
}
