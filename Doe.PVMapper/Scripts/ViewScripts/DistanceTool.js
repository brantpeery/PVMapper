pvMapper.onReady(function () {
  var control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
    eventListeners: {
      measure: function (evt) {
        Ext.MessageBox.alert('Measure Distance', "The measurement was " + evt.measure.toFixed(2) + " " + evt.units);
        //alert("The measurement was " + evt.measure.toFixed(2) + " " + evt.units);
      }
    }
  });

  pvMapper.map.addControl(control);

  var distanceBtn = new Ext.Button({
    text: 'Measure Distance',
    enableToggle: true,
    //displaySystemUnits: ["mi","ft"],
    toggleGroup: "editToolbox",
    toggleHandler: function (buttonObj, eventObj) {
      if (buttonObj.pressed) {
        control.activate();
      } else {
        control.deactivate();
      }
    }
  });

  pvMapper.mapToolbar.add(distanceBtn);
});
