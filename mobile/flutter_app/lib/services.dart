import 'dart:convert';
import 'package:http/http.dart' as http;

class WeatherService {
  final String apiKey;
  WeatherService(this.apiKey);

  Future<Map<String, dynamic>?> getCurrentByLatLng(double lat, double lng) async {
    // Example with OpenWeatherMap; adapt to your chosen API
    final url = Uri.parse('https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lng&appid=$apiKey&units=metric');
    final res = await http.get(url);
    if (res.statusCode == 200) {
      return jsonDecode(res.body) as Map<String, dynamic>;
    }
    return null;
  }
}
