import { ResourceSpecification } from "./models/ResourceSpecification"
import { Scene } from "./Scene"
import { Resources } from "./Resources"

require("../extensions.ts")

export async function mount<TModelType, TWorldObjectType>(resourceSpecification: ResourceSpecification<TModelType>, initialSceneFactory:(gl:WebGL2RenderingContext,resources:Resources<TModelType>)=>Scene<TModelType, TWorldObjectType>) {
  const viewCanvas = document.getElementById("canvas") as HTMLCanvasElement

  function setSize() {
    viewCanvas.width = viewCanvas.clientWidth
    viewCanvas.height = viewCanvas.clientHeight
  }
  const gl = viewCanvas.getContext("webgl2", { antialias: true, depth: true })
  if (gl === null) {
    console.error("Your browser doesn't support WebGL 2")
    return
  }

  var depthBits = gl.getParameter(gl.DEPTH_BITS);
  console.log("Depth buffer precision: " + depthBits + " bits");

  const resources : Resources<TModelType> = await Resources.load(gl, resourceSpecification)
  setSize()
  let scene = initialSceneFactory(gl, resources)

  let resizeDebounce: ReturnType<typeof setTimeout> | undefined = undefined
  window.addEventListener("resize", () => {
    clearTimeout(resizeDebounce)
    resizeDebounce = setTimeout(() => {
      setSize()
      scene.resize()
    }, 100)
  })
  const renderer = scene.createRenderer(gl, resources, resources)

  function render(now: number) {
    scene = scene.update(now) ?? scene
    renderer.render(gl!, scene)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}


