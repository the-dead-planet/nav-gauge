---
description: Clear emulator storage and uninstall nav-gauge app to fix install failures
agent: build
---

Clear storage on the connected Android emulator to free up space for installing the mobile app. Run these commands in order:

1. Uninstall the nav-gauge app
2. Clear cache from large preinstalled apps (YouTube, Chrome, Maps, Photos, Gmail, etc.)
3. Check remaining storage

Run:
- `adb shell pm uninstall -k --user 0 com.app`
- `adb shell pm clear com.google.android.youtube`
- `adb shell pm clear com.google.android.apps.youtube.music`
- `adb shell pm clear com.google.android.chrome`
- `adb shell pm clear com.google.android.apps.maps`
- `adb shell pm clear com.google.android.apps.photos`
- `adb shell pm clear com.google.android.apps.docs`
- `adb shell pm clear com.google.android.gm`
- `adb shell pm clear com.google.android.webview`
- `adb shell pm clear com.google.android.gms`
- `adb shell pm clear com.google.android.googlequicksearchbox`
- `adb shell pm clear com.google.android.tts`
- `adb shell pm clear com.android.vending`
- `adb shell pm clear com.google.android.federatedcompute`
- `adb shell pm clear com.google.android.as.oss`
- `adb shell pm clear com.android.bips`
- `adb shell pm clear com.android.camera2`
- `adb shell pm clear com.android.cameraextensions`
- `adb shell df -h /data/local/tmp`

Report the available space after. If still below 1GB, try clearing more apps or suggest recreating the emulator with more storage.
