import * as B from 'babylonjs'
import 'babylonjs-inspector'

export default class Menu {
  constructor({ engine, scene, coordinateSystem, inspectorPopup = true }) {
    this._engine = engine
    this._scene = scene
    this._coordinateSystem = coordinateSystem
    this._inspectorPopup = inspectorPopup
    this._panel = null

    this._scene.debugLayer.onPropertyChangedObservable.add(() => engine.resize())
  }

  render() {
    this
      ._createPanel()
      ._createCheckbox(
          'Debug'
        , this._scene.debugLayer.isVisible()
        , on => on
            ? this._scene.debugLayer.show({ popup: this._inspectorPopup })
            : this._scene.debugLayer.hide())
      ._createCheckbox(
          'Coords'
        , this._coordinateSystem.globalCoordsVisible
        , on => this._coordinateSystem.toggleGlobalCoordinates(on))

    if (!this._coordinateSystem.hasLocalCoords) return

    this._createCheckbox(
        'Local Coords'
      , this._coordinateSystem.localCoordsVisible
      , on => this._coordinateSystem.toggleLocalCoordinates(on))
  }

  _createPanel() {
    const advancedTexture = B.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    this._panel = new B.GUI.StackPanel()
    this._panel.width = '500px'
    this._panel.height = '50px'
    this._panel.isVertical = false
    this._panel.horizontalAlignment = B.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this._panel.verticalAlignment = B.GUI.Control.VERTICAL_ALIGNMENT_TOP
    advancedTexture.addControl(this._panel)

    return this
  }

  _createCheckbox(label, checked, onvalueChanged) {
    const checkbox = new B.GUI.Checkbox()
    checkbox.width = '20px'
    checkbox.height = '20px'
    checkbox.isChecked = checked
    checkbox.color = 'lightblue'
    checkbox.onIsCheckedChangedObservable.add(onvalueChanged)
    this._panel.addControl(checkbox)

    const header = new B.GUI.TextBlock()
    header.text = label
    header.width = '65px'
    header.marginLeft = '5px'
    header.textHorizontalAlignment = B.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    header.color = 'white'
    this._panel.addControl(header)

    return this
  }

  _createButton(label, onclicked) {
    const button = B.GUI.Button.CreateSimpleButton('btn', label)
    button.width = 0.15
    button.height = '20px'
    button.color = 'white'
    button.background = 'blue'
    button.onPointerClickObservable.add(onclicked)
    this._panel.addControl(button)

    return this
  }
}
