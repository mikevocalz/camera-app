import { Stack, Link, useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View, FlatList, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { Camera, Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMediaType, MediaType } from '../../utils/media';
import { useVideoPlayer, VideoView } from 'expo-video';

type Media = {
  name: string;
  uri: string;  
  type: MediaType;
};

export default function Home() {
  const [images, setImages] = useState<Media[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const player = useVideoPlayer(selectedVideo, (player) => {
    player.loop = false
    player.muted = true
  });

  useFocusEffect(
    useCallback(() => {
      loadFiles();
      loadFavorites();
    }, [])
  );

  const loadFiles = async () => {
    try {
      if (!FileSystem.documentDirectory) {
        console.log("Document directory not available");
        setImages([]);
        return;
      }

      console.log("Loading files from:", FileSystem.documentDirectory);
      const res = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      console.log("Files found:", res);
      
      // Extract file info and sort by filename (often contains timestamp)
      const mediaFiles = res
        .map(file => {
          const type = getMediaType(file);
          return { 
            name: file, 
            uri: FileSystem.documentDirectory + file,
            type,
            timestamp: extractTimestampFromFilename(file)
          };
        })
        .filter(item => item.type === 'image' || item.type === 'video');
      
      mediaFiles.sort((a, b) => a.timestamp - b.timestamp);
      
      console.log("Media files found:", mediaFiles.length);
      
      setImages(mediaFiles.map(item => ({
        name: item.name,
        uri: item.uri,
        type: item.type
      })));
    } catch (error) {
      console.error("Error loading files:", error);
      setImages([]);
    }
  };
  
  const extractTimestampFromFilename = (filename: string): number => {
    const matches = filename.match(/(\d{8}|\d{6}|\d{10}|\d{13})/);
    if (matches && matches[1]) {
      return parseInt(matches[1], 10);
    }
    
    return 0;
  };

  const loadFavorites = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (favoritesJson) {
        const favs = JSON.parse(favoritesJson);
        setFavorites(favs);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (filename: string) => {
    try {
      let newFavorites;
      if (favorites.includes(filename)) {
        newFavorites = favorites.filter(fav => fav !== filename);
      } else {
        newFavorites = [...favorites, filename];
      }
      
      setFavorites(newFavorites);
      
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      if (!favorites.includes(filename)) {
        router.push('/(tabs)/two');
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (filename: string) => {
    return favorites.includes(filename);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Gallery' }} />
      <View className="h-screen w-full max-w-screen-xl flex-1 items-center">
        {images.length === 0 ? (
          <View className="flex-1 items-center justify-center px-5">
            <Text className="mb-3 text-center text-2xl font-bold">No photos yet</Text>
            <Text className="text-center font-medium text-gray-500">
              Capture some photos or videos using the camera!
            </Text>
          </View>
        ) : (
          <FlatList
            data={images}
            className="w-full flex-1"
            contentContainerClassName="p-1"
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperClassName="gap-1"
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="relative aspect-[9/16] h-[150px] w-1/3 max-w-[33%] flex-1 p-1">
                <Link href={`/${item.name}`} asChild>
                  <Pressable
                    className="flex-1"
                    onPress={() => {
                      if (item.type === 'video') {
                        setSelectedVideo(item.uri);
                      }
                    }}>
                    {item.type === 'image' && (
                      <Image
                        source={{ uri: item.uri }}
                        style={{
                          flex: 1,
                          borderRadius: 5,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    )}
                    {item.type === 'video' && item.uri === selectedVideo && (
                      <VideoView
                        nativeControls={false}
                        player={player}
                        contentFit="cover"
                        style={{
                          flex: 1,
                          borderRadius: 5,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    )}
                  </Pressable>
                </Link>
                <Pressable
                  onPress={() => toggleFavorite(item.name)}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 20,
                    padding: 5,
                  }}>
                  <Heart
                    size={20}
                    color={isFavorite(item.name) ? '#ff6b81' : 'white'}
                    fill={isFavorite(item.name) ? '#ff6b81' : 'transparent'}
                  />
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </>
  );
}
