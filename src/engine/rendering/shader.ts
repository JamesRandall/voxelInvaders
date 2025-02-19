export interface ShaderSource {
  frag: string
  vert: string
}

export function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function compileShaderProgram(gl: WebGL2RenderingContext, source: ShaderSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, source.vert)!
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, source.frag)!

  const shaderProgram = gl.createProgram()!
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
    return null
  }
  return shaderProgram
}
