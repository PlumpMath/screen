# Electron.Shell
Interop for electron's screen module

## Documentation


### `displays : Signal (List Display)`

A `Signal` for all of the `Display`s currently available on the machine.
Receives updates on the `display-added`, `display-removed`, and
`display-metrics-changed` events of the native module.
[electron docs](https://github.com/atom/electron/blob/master/docs/api/screen.md#events)

### `getCursorScreenPoint : () -> Task x Point`

Request the current point of the mouse on the user's screen. Note: this is
point on the actual screen, meaning that placing the mouse cursor in the top-
left corner of the screen will yield `{ x = 0, y = 0 }`.
[electron docs](https://github.com/atom/electron/blob/master/docs/api/screen.md#screengetcursorscreenpoint)

### `getPrimaryDisplay : () -> Task x Display`

Request info on the user's primary display.
[electron docs](https://github.com/atom/electron/blob/master/docs/api/screen.md#screengetprimarydisplay)

### `getAllDisplays: () -> Task x (List Display)`

Request the list of all displays at a single point in time, in case you don't
need the `Signal` and only want a one-off list.
[electron docs](https://github.com/atom/electron/blob/master/docs/api/screen.md#screengetalldisplays)

### `getDisplayNearestPoint : Point -> Task x Dislpay`

Request the display closest to the given `Point`. Useful to detect the display
in which the user's cursor currently resides via `getCursorScreenPoint`.
[electron docs](https://github.com/atom/electron/blob/master/docs/api/screen.md#screengetprimarydisplay)

### `getDisplayMatching : Rect -> Task x Display`

Request the display most contained by a given `Rect`.
[electron docs](https://github.com/atom/electron/blob/master/docs/api/screen.md#screengetdisplaymatchingrect)

## Contributing

Any suggestions accepted! Submit issues, PRs, send an email or get in touch on
twitter at @luke_dot_js or on the elmlang Slack at @luke. I'll be working on
even more electron interop coming up so if you have ideas for that process as a
whole feel free to get in touch with those as well. Thanks!
