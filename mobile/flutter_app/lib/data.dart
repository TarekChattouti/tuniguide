class Place {
  final int id;
  final String name;
  final List<String> tags;
  final double lat;
  final double lng;
  final String image;
  final String description;

  const Place({
    required this.id,
    required this.name,
    required this.tags,
    required this.lat,
    required this.lng,
    required this.image,
    required this.description,
  });
}

class Guide {
  final int id;
  final String name;
  final List<String> expertise;
  final String avatar;

  const Guide({
    required this.id,
    required this.name,
    required this.expertise,
    required this.avatar,
  });
}

class Group {
  final int id;
  final String name;
  final int members;

  const Group({
    required this.id,
    required this.name,
    required this.members,
  });
}

// Mock data mirroring js/data.js themes
const places = <Place>[
  Place(
    id: 1,
    name: 'Carthage Ruins',
    tags: ['history', 'culture'],
    lat: 36.8610,
    lng: 10.3300,
    image: 'assets/images/carthage.jpg',
    description: 'Ancient city ruins overlooking the sea.',
  ),
  Place(
    id: 2,
    name: 'Sidi Bou Said',
    tags: ['culture', 'beach'],
    lat: 36.8700,
    lng: 10.3430,
    image: 'assets/images/sidi_bou_said.jpg',
    description: 'Blue and white village with stunning views.',
  ),
];

const guides = <Guide>[
  Guide(id: 1, name: 'Amel', expertise: ['history', 'culture'], avatar: ''),
  Guide(id: 2, name: 'Youssef', expertise: ['food', 'nature'], avatar: ''),
];

const groups = <Group>[
  Group(id: 1, name: 'Beach Lovers', members: 20),
  Group(id: 2, name: 'Foodies', members: 35),
];
