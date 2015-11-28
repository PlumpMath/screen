function makeNativeModule(elmPath, factory) {

  if(typeof elmPath !== 'string') {
    throw Error('first argument of makeNativeModule must be a string');
  }

  if(typeof factory !== 'function') {
    throw Error('second argument of makeNativeModule must be a function');
  }

  function namespace(root, path) {
    return path.split('.').reduce(function (current, nextPath) {
      if(!current[nexPath]) current[nextPath] = {};
      return current[nextPath];
    }, root);
  }

  var globalEntry = namespace(Elm.Native, elmPath);

  globalEntry.make = function (localRuntime) {

    var localEntry = namespace(localRuntime.Native, elmPath);

    if(globalEntry.values) {
      localEntry.values = globalEntry.values;
    }

    if(localEntry.values) {
      return localEntry.values;
    }

    var values = factory(Elm, localRuntime);

    if(Object.prototype.toString(values) !== '[object Object]') {
      throw Error('makeNativeModule factory function must return an object');
    }

    localEntry.values = values;
    return localEntry.values;
  }
}

function requireElectronModule(electronModule, elmModule) {
  var electron;
  try {
    electron = require('electron');
  } catch (error) {
    throw Error(elmModule + ' can only be used in electron, and only in electron >= 0.35.2');
  }
  var module = electron[electronModule];
  if(!module) {
    throw Error(electronModule + ' is not an electron module');
  }
  return module;
}

makeNativeModule('Electron.Screen', function (Elm, localRuntime) {

  var electronScreen = requireElectronModule('screen', 'Electron.Screen');

  var Task = Elm.Native.Task.make(localRuntime);
  var List = Elm.Native.List.make(localRuntime);
  var Signal = Elm.Native.Signal.make(localRuntime);
  var Utils = Elm.Native.Utils.make(localRuntime);
  var Result = Elm.Result.make(localRuntime);

  // Signal (List NativeDisplay)
  var displays = Signal.input(
    'Electron.Screen.displays',
    Utils.list(electronScreen.getAllDisplays())
  );

  function updateDisplays() {
    localRuntime.notify(displays.id, Utils.list(electronScreen.getAllDisplays()));
  }

  electronScreen.on('display-added', updateDisplays);
  electronScreen.on('display-removed', updateDisplays);
  electronScreen.on('display-metrics-changed', updateDisplays);

  // getAllDisplays : () -> Task x (List NativeDisplay)
  function getAllDisplays() {
    return Task.asyncFunction(function (callback) {
      var displaysList = Utils.list(electronScreen.getAllDisplays());
      callback(Task.succeed(displaysList));
    });
  }

  // getCursorScreenPoint : () -> Task x Point
  function getCursorScreenPoint() {
    return Task.asyncFunction(function (callback) {
      callback(Task.succeed(electronScreen.getCursorScreenPoint()))
    });
  }

  // getPrimaryDisplay : () -> Task x NativeDisplay
  function getPrimaryDisplay() {
    return Task.asyncFunction(function (callback) {
      callback(Task.succeed(electronScreen.getPrimaryDisplay()));
    });
  }

  // getDisplayNearestPoint : Point -> Task x NativeDisplay
  function getDisplayNearestPoint(point) {
    return Task.asyncFunction(function (callback) {
      var display = electronScreen.getDisplayNearestPoint(point);
      callback(Task.succeed(display));
    })
  }

  // getDisplayMatching : Rect -> Task x NativeDisplay
  function getDisplayMatching(rect) {
    return Task.asyncFunction(function (callback) {
      var display = electronScreen.getDisplayMatching(rect);
      callback(Task.succeed(display));
    });
  }

  return {
    displays: displays,
    displayMetrics: displayMetrics,
    getCursorScreenPoint: getCursorScreenPoint,
    getPrimaryDisplay: getPrimaryDisplay,
    getDisplayNearestPoint: getDisplayNearestPoint,
    getDisplayMatching: getDisplayMatching
  };
});
