# Expo Camera App

A feature-rich camera application built with React Native and Expo that allows users to capture photos, record videos, browse media in a gallery view, and manage favorites.

![Screenshot](https://github.com/mikevocalz/camera-app/blob/master/assets/images/screenshot.jpeg)

[![Demo Video](https://github.com/mikevocalz/camera-app/blob/master/assets/images/screenshot.jpeg)](https://github.com/mikevocalz/camera-app/blob/master/assets/video/demo.mp4)

## Features

- **Photo Capture**: Take high-quality photos using the device's camera
- **Video Recording**: Record videos with automatic thumbnail generation
- **Media Gallery**: Browse all captured photos and videos in chronological order
- **Favorites System**: Mark media as favorites for quick access
- **Media Management**:
  - View photos and videos in a detailed view
  - Play videos with controls
  - Save media to device library
  - Delete unwanted media
- **Modern UI**: Clean and intuitive user interface with smooth navigation

## Technologies Used

### Core

- [React Native](https://reactnative.dev/) - A framework for building native apps using React
- [Expo](https://expo.dev/) - An open-source platform for making universal native apps
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at scale

### Navigation & UI

- [Expo Router](https://docs.expo.dev/routing/introduction/) - File-based routing for Expo apps
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) - Beautiful and consistent icons

### Media Handling

- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) - Camera component for React Native
- [Expo Video](https://docs.expo.dev/versions/latest/sdk/video/) - Video component for React Native
- [Expo Video Thumbnails](https://docs.expo.dev/versions/latest/sdk/video-thumbnails/) - Generate thumbnails from videos
- [Expo Image](https://docs.expo.dev/versions/latest/sdk/image/) - Fast and performant image component
- [Expo Media Library](https://docs.expo.dev/versions/latest/sdk/media-library/) - Access to user's media library
- [Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/) - Access the file system

### Storage

- [AsyncStorage](https://reactnative.dev/docs/asyncstorage) - Asynchronous, persistent, key-value storage system

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/camera-app.git
   cd camera-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Start the development server:

   ```bash
   npx expo start
   # or
   yarn expo start
   # or
   bun run start
   ```

4. Open on your device:
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Or run on a simulator/emulator with `i` for iOS or `a` for Android

## Usage

- **Capture Tab**: Access the camera to take photos or record videos
- **Gallery Tab**: View all captured media in a grid layout
- **Favorites Tab**: Access media marked as favorites
- **Media Detail View**: Tap any media item to view it in detail
  - Use the heart button to toggle favorite status
  - Use the save button to save to your device's media library
  - Use the trash button to delete the media

## Project Structure

```
camera-app/
├── app/                  # Main application code
│   ├── (tabs)/           # Tab-based navigation screens
│   │   ├── index.tsx     # Gallery screen (first tab)
│   │   ├── two.tsx       # Favorites screen (second tab)
│   │   ├── center.tsx    # Center tab placeholder
│   │   └── _layout.tsx   # Tab layout configuration
│   ├── [name].tsx        # Media detail screen
│   ├── camera.tsx        # Camera capture screen
│   └── _layout.tsx       # Root layout configuration
├── assets/               # Static assets
│   ├── images/           # Image assets
│   └── video/            # Video assets including demo
├── utils/                # Utility functions
└── ...                   # Configuration files
```

## Demo

Watch the [demo video](assets/video/demo.mp4) to see the app in action!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Built with [Expo](https://expo.dev/)
