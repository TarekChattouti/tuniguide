# TuniGuide Mobile (Flutter)

A lightweight Flutter app that mirrors core flows of the web app: onboarding (preferences), dashboard shortcuts, and simple views for map/guides/groups.

## Prerequisites
- Install Flutter SDK: https://docs.flutter.dev/get-started/install
- Set up an emulator or connect a device.

## Run
```powershell
# From repo root
cd c:\hackathon\tuniguide\mobile\flutter_app
flutter pub get ; flutter run
```

## Structure
- `lib/main.dart` — App entry, routes, and basic screens.
- `pubspec.yaml` — Dependencies: `shared_preferences` for onboarding prefs.
- `assets/images/` — Reuses web assets; map to Flutter assets via `pubspec.yaml`.

## Notes
- Keys mirror web `localStorage` semantics (e.g., `preferences.tags`).
- This is a minimal scaffold; expand with real data models and views as needed.

## Mapbox Setup (Android/iOS/Web)
Mapbox is temporarily disabled to unblock builds. To enable it:

1. Add dependency:
	```yaml
	dependencies:
	  mapbox_gl: ^0.16.0 # or a newer compatible version
	```
2. Set SDK downloads token (Android build requirement):
	- Create `C:\Users\<you>\.gradle\gradle.properties` and add:
	  ```
	  MAPBOX_DOWNLOADS_TOKEN=your_mapbox_downloads_token
	  ```
	- Alternatively set a user env var `MAPBOX_DOWNLOADS_TOKEN`.
3. Provide your Mapbox access token at runtime (recommended) or via platform files.
	- Runtime: pass the token when constructing the map widget.
	- Android: add meta-data in `android/app/src/main/AndroidManifest.xml`.
	- iOS: add to `Info.plist`.
4. Web: ensure `flutter config --enable-web` is set. If you see `platformViewRegistry` or `hashValues` errors, pin Mapbox packages to versions compatible with your Flutter/Dart SDK.

After configuring:
```powershell
flutter pub get
flutter run -d android
```

If you prefer a token-free alternative, consider `maplibre_gl` (MapLibre) which works similarly and doesn’t require the Mapbox downloads token.
