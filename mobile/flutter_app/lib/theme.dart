import 'package:flutter/material.dart';

final ColorScheme _scheme = const ColorScheme.light(
  primary: Colors.teal,
  onPrimary: Colors.white,
  secondary: Colors.orange,
  surface: Colors.white,
  onSurface: Colors.black87,
);

ThemeData appTheme() => ThemeData(
      colorScheme: _scheme,
      useMaterial3: true,
      textTheme: const TextTheme(
        headlineSmall: TextStyle(fontWeight: FontWeight.w600),
        titleMedium: TextStyle(fontWeight: FontWeight.w600),
      ),
      chipTheme: const ChipThemeData(
        selectedColor: Colors.teal,
        secondarySelectedColor: Colors.teal,
      ),
    );