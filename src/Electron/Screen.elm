module Electron.Screen(Point, Size, Rect, TouchSupport, Display, displays, getCursorScreenPoint, getPrimaryDisplay, getAllDisplays, getDisplayNearestPoint, getDisplayMatching) where

{-| Interop for electron's screen module.

# Types
@docs Point, Size, Rect, TouchSupport, Display

# Observe changes to the user's monitor setup
@docs displays

# Request info about the user's display
@docs getCursorScreenPoint, getPrimaryDisplay, getAllDisplays, getDisplayNearestPoint, getDisplayMatching
-}

import Native.Electron.Screen
import Task
import Signal

{-| A point on the user's screen
-}
type alias Point =
  { x: Int
  , y: Int
  }

{-| The size of a display
-}
type alias Size =
  { width: Int
  , height: Int
  }

{-| A bounding rectangle for a display or area
-}
type alias Rect =
  { x: Int
  , y: Int
  , width: Int
  , height: Int
  }

{-| Various touch support capabilites for the display
-}
type TouchSupport
  = Available
  | Unavailable
  | Unknown

{-| Display info structure retrieved directly by electron, requires conversion
on the touchSupport property
-}
type alias NativeDisplay =
  { bounds: Rect
  , id: Int
  , rotation: Int
  , scaleFactor: Int
  , size: Size
  , touchSupport: String
  , workArea: Rect
  , workAreaSize: Rect
  }

{-| Info about a user's display
-}
type alias Display =
  { bounds: Rect
  , id: Int
  , rotation: Int
  , scaleFactor: Int
  , size: Size
  , touchSupport: TouchSupport
  , workArea: Rect
  , workAreaSize: Rect
  }

{-| Converts native touchSupport strings into TouchSupport types
-}
convertTouchSupport : String -> TouchSupport
convertTouchSupport supportString =
  case supportString of
    "available" ->
      Available
    "unavailable" ->
      Unavailable
    _ ->
      Unknown


{-| Converts a NativeDisplay to a Display
-}
convertNativeDisplay : NativeDisplay -> Display
convertNativeDisplay nativeDisplay =
  { nativeDisplay
  | touchSupport = (convertTouchSupport nativeDisplay.touchSupport)
  }


{-| The current displays connected to the user's machine
-}
displays : Signal (List Display)
displays =
  Signal.map (List.map convertNativeDisplay) Native.Electron.Screen.displays


{-| Request the coordinates of the mouse on the user's screen (not window, but
actual monitor area)
-}
getCursorScreenPoint : () -> Task.Task x Point
getCursorScreenPoint = Native.Electron.Screen.getCursorScreenPoint


{-| Request info on the user's primary display
-}
getPrimaryDisplay : () -> Task.Task x Display
getPrimaryDisplay () =
  Native.Electron.Screen.getPrimaryDisplay ()
    `Task.andThen` (convertNativeDisplay >> Task.succeed)


{-| Request a List of info on all displays
-}
getAllDisplays : () -> Task.Task x (List Display)
getAllDisplays () =
  Native.Electron.Screen.getAllDisplays ()
    `Task.andThen` ((List.map convertNativeDisplay) >> Task.succeed)


{-| Request the containing a given set of mouse coordinates
-}
getDisplayNearestPoint : Point -> Task.Task x Display
getDisplayNearestPoint point =
  Native.Electron.Screen.getDisplayNearestPoint point
    `Task.andThen` (convertNativeDisplay >> Task.succeed)


{-| Request the screen most contained by a bounding rectangle
-}
getDisplayMatching : Rect -> Task.Task x Display
getDisplayMatching rect =
  Native.Electron.Screen.getDisplayMatching rect
    `Task.andThen` (convertNativeDisplay >> Task.succeed)
