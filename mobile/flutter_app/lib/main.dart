import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'theme.dart';
import 'data.dart';
import 'services.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as ll;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TuniGuideApp());
}

class TuniGuideApp extends StatelessWidget {
  const TuniGuideApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TuniGuide',
      theme: appTheme(),
      home: const OnboardingPage(),
      routes: {
        '/home': (_) => const HomeShell(),
        '/dashboard': (_) => const DashboardPage(),
        '/map': (_) => const MapPage(),
        '/guides': (_) => const GuidesPage(),
        '/groups': (_) => const GroupsPage(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/place' && settings.arguments is Place) {
          final place = settings.arguments as Place;
          return MaterialPageRoute(
            builder: (_) => PlaceDetailsPage(place: place),
            settings: settings,
          );
        }
        return null;
      },
    );
  }
}

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _controller = PageController();
  int _index = 0;
  final Set<String> _tags = {};
  String _budget = 'medium';
  String _region = 'coastal';

  final _availableTags = const [
    ('culture', Icons.museum),
    ('food', Icons.restaurant),
    ('beach', Icons.beach_access),
    ('history', Icons.account_balance),
    ('nature', Icons.park),
  ];

  final _budgets = const [
    ('low', 'Saver'),
    ('medium', 'Balanced'),
    ('high', 'Premium'),
  ];

  final _regions = const [
    'coastal', 'desert', 'mountain', 'city'
  ];

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('preferences.tags', _tags.toList());
    await prefs.setString('preferences.budget', _budget);
    await prefs.setString('preferences.region', _region);
    if (mounted) Navigator.pushReplacementNamed(context, '/home');
  }

  void _next() {
    if (_index < 3) {
      setState(() => _index++);
      _controller.animateToPage(_index, duration: const Duration(milliseconds: 400), curve: Curves.easeOut);
    } else {
      _save();
    }
  }

  void _back() {
    if (_index > 0) {
      setState(() => _index--);
      _controller.animateToPage(_index, duration: const Duration(milliseconds: 400), curve: Curves.easeOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: _index == 0
            ? null
            : IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: _back,
              ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              scheme.primary.withOpacity(0.15),
              scheme.surface,
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: _Header(step: _index, total: 4),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: PageView(
                  controller: _controller,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _SlideCard(
                      heroIcon: Icons.favorite,
                      title: 'Pick your interests',
                      subtitle: 'We will tailor places, guides and groups for you',
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          for (final (name, icon) in _availableTags)
                            AnimatedScale(
                              duration: const Duration(milliseconds: 150),
                              scale: _tags.contains(name) ? 1.05 : 1.0,
                              child: FilterChip(
                                avatar: Icon(icon, size: 18),
                                label: Text(name),
                                selected: _tags.contains(name),
                                onSelected: (v) => setState(() => v ? _tags.add(name) : _tags.remove(name)),
                              ),
                            ),
                        ],
                      ),
                    ),
                    _SlideCard(
                      heroIcon: Icons.account_balance_wallet,
                      title: 'Budget style',
                      subtitle: 'Choose the travel comfort that fits you',
                      child: Wrap(
                        spacing: 10,
                        children: [
                          for (final (key, label) in _budgets)
                            ChoiceChip(
                              label: Text(label),
                              selected: _budget == key,
                              onSelected: (_) => setState(() => _budget = key),
                            ),
                        ],
                      ),
                    ),
                    _SlideCard(
                      heroIcon: Icons.public,
                      title: 'Preferred region',
                      subtitle: 'Tell us where you like to explore most',
                      child: Wrap(
                        spacing: 10,
                        children: [
                          for (final r in _regions)
                            ChoiceChip(
                              label: Text(r),
                              selected: _region == r,
                              onSelected: (_) => setState(() => _region = r),
                            ),
                        ],
                      ),
                    ),
                    _SlideCard(
                      heroIcon: Icons.check_circle,
                      title: 'Summary',
                      subtitle: 'Confirm your preferences before we personalize',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Interests'),
                          const SizedBox(height: 6),
                          Wrap(spacing: 8, children: [for (final t in _tags) Chip(label: Text(t))]),
                          const SizedBox(height: 12),
                          const Text('Budget'),
                          const SizedBox(height: 6),
                          Chip(label: Text(_budget)),
                          const SizedBox(height: 12),
                          const Text('Region'),
                          const SizedBox(height: 6),
                          Chip(label: Text(_region)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              _Dots(index: _index, count: 4),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: SizedBox(
                  width: double.infinity,
                  child: FilledButton.tonalIcon(
                    onPressed: _index == 0 && _tags.isEmpty ? null : _next,
                    icon: Icon(_index == 3 ? Icons.check : Icons.arrow_forward),
                    label: Text(_index == 3 ? 'Finish' : 'Continue'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  List<String> _tags = const [];

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _tags = prefs.getStringList('preferences.tags') ?? const [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('TuniGuide Dashboard')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Your preferences:'),
            const SizedBox(height: 8),
            Wrap(spacing: 8, children: _tags.map((t) => Chip(label: Text(t))).toList()),
            const SizedBox(height: 24),
            const Text('Suggested Cities'),
            const SizedBox(height: 8),
            SizedBox(
              height: 140,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  const SizedBox(width: 4),
                  for (final p in places.where((p) => _tags.isEmpty || _tags.any((t) => p.tags.contains(t))))
                    _CityCard(place: p),
                  const SizedBox(width: 4),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Quick actions'),
            const SizedBox(height: 8),
            Wrap(spacing: 12, children: [
              ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/map'),
                icon: const Icon(Icons.map),
                label: const Text('Map'),
              ),
              ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/guides'),
                icon: const Icon(Icons.person),
                label: const Text('Guides'),
              ),
              ElevatedButton.icon(
                onPressed: () => Navigator.pushNamed(context, '/groups'),
                icon: const Icon(Icons.group),
                label: const Text('Groups'),
              ),
            ]),
          ],
        ),
      ),
    );
  }
}

class MapPage extends StatelessWidget {
  const MapPage({super.key});

  @override
  Widget build(BuildContext context) {
    final center = ll.LatLng(places.first.lat, places.first.lng);
    return Scaffold(
      appBar: AppBar(title: const Text('Map')),
      body: Column(
        children: [
          Expanded(
            child: FlutterMap(
              options: MapOptions(center: center, zoom: 11),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'tuniguide_mobile',
                ),
                MarkerLayer(
                  markers: [
                    for (final p in places)
                      Marker(
                        point: ll.LatLng(p.lat, p.lng),
                        width: 40,
                        height: 40,
                        child: const Icon(Icons.location_pin, color: Colors.teal, size: 36),
                      ),
                  ],
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: FilledButton.icon(
              onPressed: () async {
                const apiKey = String.fromEnvironment('OPENWEATHER_API_KEY');
                if (apiKey.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Set OPENWEATHER_API_KEY via --dart-define')),
                  );
                  return;
                }
                final svc = WeatherService(apiKey);
                final w = await svc.getCurrentByLatLng(places.first.lat, places.first.lng);
                final summary = w?['weather']?[0]?['main']?.toString() ?? 'N/A';
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Weather: $summary')),
                );
              },
              icon: const Icon(Icons.cloud),
              label: const Text('Check Weather'),
            ),
          ),
        ],
      ),
    );
  }
}

class GuidesPage extends StatelessWidget {
  const GuidesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Guides')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(leading: Icon(Icons.person), title: Text('Guide A'), subtitle: Text('History, culture')),
          ListTile(leading: Icon(Icons.person), title: Text('Guide B'), subtitle: Text('Food, nature')),
        ],
      ),
    );
  }
}

class GroupsPage extends StatelessWidget {
  const GroupsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Groups')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          ListTile(leading: Icon(Icons.group), title: Text('Beach Lovers'), subtitle: Text('20 members')),
          ListTile(leading: Icon(Icons.group), title: Text('Foodies'), subtitle: Text('35 members')),
        ],
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;
  final _pages = const [DashboardPage(), MapPage(), GuidesPage(), GroupsPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.map_outlined), selectedIcon: Icon(Icons.map), label: 'Map'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Guides'),
          NavigationDestination(icon: Icon(Icons.group_outlined), selectedIcon: Icon(Icons.group), label: 'Groups'),
        ],
        onDestinationSelected: (i) => setState(() => _index = i),
      ),
    );
  }
}

class _CityCard extends StatelessWidget {
  final Place place;
  const _CityCard({required this.place});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      width: 180,
      margin: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 12, offset: const Offset(0, 6))],
        border: Border.all(color: scheme.primary.withOpacity(0.12)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.location_city, color: Colors.teal),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Hero(
                      tag: 'place-name-${place.id}',
                      child: Text(place.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              Wrap(
                spacing: 6,
                children: [
                  for (final t in place.tags.take(3))
                    Chip(label: Text(t), visualDensity: VisualDensity.compact, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
                ],
              ),
            ],
          ),
        ),
        onTap: () {
          Navigator.pushNamed(context, '/place', arguments: place);
        },
      ),
    );
  }
}

class _Header extends StatelessWidget {
  final int step;
  final int total;
  const _Header({required this.step, required this.total});

  @override
  Widget build(BuildContext context) {
    final titles = const ['Interests', 'Budget', 'Region', 'Summary'];
    final subtitles = const [
      'Tell us what you love',
      'Pick your comfort level',
      'Where do you prefer to roam',
      'Review your choices',
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Personalize your trip', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 6),
        Row(
          children: [
            Chip(label: Text('Step ${step + 1} of $total')),
            const SizedBox(width: 8),
            Text('${titles[step]} · ${subtitles[step]}'),
          ],
        ),
      ],
    );
  }
}

class _SlideCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final Widget child;
  final IconData? heroIcon;
  const _SlideCard({required this.title, required this.subtitle, required this.child, this.heroIcon});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 18, offset: const Offset(0, 8)),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (heroIcon != null)
              Container(
                height: 120,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary.withOpacity(0.25),
                      Theme.of(context).colorScheme.secondary.withOpacity(0.2),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Icon(heroIcon, size: 64, color: Theme.of(context).colorScheme.onPrimary),
                ),
              ),
            if (heroIcon != null) const SizedBox(height: 12),
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(subtitle, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54)),
            const SizedBox(height: 16),
            Expanded(child: SingleChildScrollView(child: child)),
          ],
        ),
      ),
    );
  }
}

class PlaceDetailsPage extends StatelessWidget {
  final Place place;
  const PlaceDetailsPage({super.key, required this.place});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            expandedHeight: 200,
            flexibleSpace: FlexibleSpaceBar(
              title: Hero(tag: 'place-name-${place.id}', child: Text(place.name)),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [scheme.primary.withOpacity(0.6), scheme.secondary.withOpacity(0.4)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: const Center(child: Icon(Icons.landscape, size: 96, color: Colors.white)),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 8,
                    children: [for (final t in place.tags) Chip(label: Text(t))],
                  ),
                  const SizedBox(height: 12),
                  Text(place.description),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => Navigator.pushNamed(context, '/map'),
                          icon: const Icon(Icons.map),
                          label: const Text('Open Map'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.person),
                          label: const Text('Book Guide'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  FilledButton.tonalIcon(
                    onPressed: () {},
                    icon: const Icon(Icons.group),
                    label: const Text('Join Group'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Dots extends StatelessWidget {
  final int index;
  final int count;
  const _Dots({required this.index, required this.count});

  @override
  Widget build(BuildContext context) {
    final active = Theme.of(context).colorScheme.primary;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        for (int i = 0; i < count; i++)
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            margin: const EdgeInsets.symmetric(horizontal: 4),
            height: 8,
            width: i == index ? 22 : 8,
            decoration: BoxDecoration(
              color: i == index ? active : Colors.black26,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
      ],
    );
  }
}
