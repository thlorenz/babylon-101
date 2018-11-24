import * as B from 'babylonjs'

export default class CoordinateSystem {
  constructor(scene, {
      localSize = 2
    , globalSize = 8
    , textStyle = 'bold 36px Arial'
  } = {}) {
    this._scene = scene
    this._localSize = localSize
    this._globalSize = globalSize
    this._textStyle = textStyle
  }

  get localCoordsVisible() {
    return this._pilot != null && this._pilot.isVisible
  }

  get globalCoordsVisible() {
    return this._globalAxis != null && this._globalAxis[0].isVisible
  }

  get hasLocalCoords() {
    return this._pilot != null
  }

  render(globalOnly = true) {
    this._createGlobalAxis()
    if (globalOnly) return

    this
      ._createLocalOrigin()
      ._createPilot()
      ._createLocalAxis()
  }

  showLocalCoordinates() {
    this.toggleLocalCoordinates(true)
  }

  hideLocalCoordinates() {
    this.toggleLocalCoordinates(false)
  }

  showGlobalCoordinates() {
    this.toggleGlobalCoordinates(true)
  }

  hideGlobalCoordinates() {
    this.toggleGlobalCoordinates(false)
  }

  toggleLocalCoordinates(force = null) {
    const visible = force != null ? !this.localCoordsVisible : force
    this._pilot.isVisible = visible
    this._setVisibilityAll(this._localAsix, visible)
  }

  toggleGlobalCoordinates(force = null) {
    const visible = force != null ? !this.globalCoordsVisible : force
    this._setVisibilityAll(this._globalAxis, visible)
  }

  _createLocalOrigin() {
    this._localOrigin = B.MeshBuilder.CreateBox('local-origin', {
      size: 1
    }, this._scene)
    this._localOrigin.isVisible = false
    return this
  }

  _createPilot() {
    const body = B.MeshBuilder.CreateCylinder('body', {
        height: 0.75
      , diameterTop: 0.2
      , diameterBottom: 0.5
      , tessellation: 6
      , subdivisions: 1
    }, this._scene)

    const arm = B.MeshBuilder.CreateBox('arm', {
        height: 0.75
      , width: 0.3
      , depth: 0.1875
    }, this._scene)
    arm.position.x = 0.125

    this._pilot = B.Mesh.MergeMeshes([ body, arm ], true)
    this._localOrigin.parent = this._pilot
    this._localOrigin.rotation.y = Math.PI / 4

    this._pilot.position = new B.Vector3(1, 1, 1)
    this._pilot.rotation.y = -(Math.PI / 4)
    return this
  }

  _createLocalAxis() {
    const size = this._localSize
    const width = size * 0.95
    const height = size * 0.05
    const prefix = 'local'
    const x = this._createAxisX(size, width, height, prefix)
    const y = this._createAxisY(size, width, height, prefix)
    const z = this._createAxisZ(size, width, height, prefix)
    x.parent = this._localOrigin
    y.parent = this._localOrigin
    z.parent = this._localOrigin
    this._localAxis = [ x, y, z ]

    return this
  }

  _createGlobalAxis() {
    const size = this._globalSize
    const width = size * 0.95
    const height = size * 0.05
    const prefix = 'global'
    const x = this._createAxisX(size, width, height, prefix)
    const y = this._createAxisY(size, width, height, prefix)
    const z = this._createAxisZ(size, width, height, prefix)

    const labelX = this._createTextPlane('X', 'red', size / 10)
    labelX.position = new B.Vector3(width, height * 2, 0)

    const labelY = this._createTextPlane('Y', 'lightgreen', size / 10)
    labelY.position = new B.Vector3(0, width,  height)

    const labelZ = this._createTextPlane('Z', 'blue', size / 10)
    labelZ.position = new B.Vector3(0, height * 2, width)

    this._globalAxis = [ x, y, z, labelX, labelY, labelZ ]

    return this
  }

  //
  // Helpers
  //
  _lines(name, color, points) {
    // Babylon requires as many color definitions as points or it crashes
    const colors = points.map(x => color)
    return B.MeshBuilder.CreateLines(name, { points, colors }, this._scene)
  }

  _createAxisX(size, width, height, prefix) {
    return this._lines(`${prefix}-axis-x`, new B.Color4(1, 0, 0, 1), [
        B.Vector3.Zero()
      , new B.Vector3(size, 0, 0)
      , new B.Vector3(width, height, 0)
      , new B.Vector3(size, 0, 0)
      , new B.Vector3(width, -height, 0)
    ])
  }

  _createAxisY(size, width, height, prefix) {
    return this._lines(`${prefix}-axis-y`, new B.Color4(0, 1, 0, 1), [
        new B.Vector3.Zero()
      , new B.Vector3(0, size, 0)
      , new B.Vector3(-height, width, 0)
      , new B.Vector3(0, size, 0)
      , new B.Vector3(height, width, 0)
    ])
  }

  _createAxisZ(size, width, height, prefix) {
    return this._lines(`${prefix}-axis-z`, new B.Color4(0, 0, 1, 1), [
        new B.Vector3.Zero()
      , new B.Vector3(0, 0, size)
      , new B.Vector3(0, -height, width)
      , new B.Vector3(0, 0, size)
      , new B.Vector3(0, height, width)
    ])
  }

  _createTextPlane(text, color, size) {
    const dynamicTexture =
      new B.DynamicTexture('dynamic-texture', 50, this._scene, true)
    dynamicTexture.hasAlpha = true
    dynamicTexture
      .drawText(text, 5, 40, this._textStyle, color, 'transparent', true)

    const plane = new B.Mesh.CreatePlane('text-plane', size, this._scene, true)
    plane.material = new B.StandardMaterial('TextPlaneMaterial', this._scene)
    plane.material.backFaceCulling = false
    plane.material.specularColor = new B.Color3(0, 0, 0)
    plane.material.diffuseTexture = dynamicTexture
    return plane
  }

  _setVisibilityAll(els, val) {
    els.forEach(x => (x.isVisible = val))
  }
}
