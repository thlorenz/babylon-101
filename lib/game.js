// import * as B from 'babylonjs/babylon.max'
import * as B from 'babylonjs'
import 'babylonjs-gui'

import CoordinateSystem from './coordinate-system'
import Menu from './menu'

export default class Game {
  constructor(canvas) {
    this._canvas = canvas
    this._engine = new B.Engine(this._canvas, true)

    this._scene = null
    this._coordinateSystem = null
    this._camera = null
    this._light1 = null
    this._light2 = null

    this._initResize()
  }

  createScene() {
    this._scene = new B.Scene(this._engine)
    this._scene.clearColor = new B.Color3(0.5, 0.5, 0.5)

    const coordinateSystem = new CoordinateSystem(this._scene, { globalSize: 15 })
    const menu = new Menu({
        engine: this._engine
      , scene: this._scene
      , coordinateSystem
    })

    const camAlpha = Math.PI / 2
    const camBeta = Math.PI / 2
    const camRadius = 2
    const camTarget = B.Vector3.Zero()
    this._camera = new B.ArcRotateCamera(
        'camera'
      , camAlpha
      , camBeta
      , camRadius
      , camTarget
      , this._scene
    )
    this._camera.setPosition(new B.Vector3(10, 30, -10))
    this._camera.attachControl(this._canvas, true)

    const lightPos1 = new B.Vector3(1, 1, 0)
    this._light1 = new B.HemisphericLight('hemlight', lightPos1, this._scene)
    this._light1.intensity = 0.4
    const lightPos2 = new B.Vector3(0, 1, -1)
    this._light2 = new B.PointLight('pointlight', lightPos2, this._scene)

    coordinateSystem.render(false)
    menu.render()
    return this
  }

  animate() {
    this._engine.runRenderLoop(() => this._scene.render())
    return this
  }

  _initResize() {
    window.addEventListener('resize', () => this._engine.resize())
  }
}
