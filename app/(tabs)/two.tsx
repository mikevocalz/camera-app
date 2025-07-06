import { Stack, useFocusEffect, Link} from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Pressable, View, FlatList, Text } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Play } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMediaType, MediaType } from '../../utils/media';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as FileSystem from 'expo-file-system';

type Media = {
  name: string;
  uri: string;
  type: MediaType;
};

export default function Favorites() {
  const [favoriteImages, setFavoriteImages] = useState<Media[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const player = useVideoPlayer(selectedVideo, (player) => {
    player.loop = false;
    player.muted = true;
  });
  
  useFocusEffect(
    useCallback(() => {
      loadFavoriteImages();
    }, [])
  );

  const loadFavoriteImages = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (!favoritesJson) {
        setFavoriteImages([]);
        return;
      }

      const favoriteFilenames = JSON.parse(favoritesJson) as string[];
      if (!FileSystem.documentDirectory || favoriteFilenames.length === 0) {
        setFavoriteImages([]);
        return;
      }

      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      
      const favorites = files
        .filter(filename => favoriteFilenames.includes(filename))
        .map(filename => ({
          name: filename,
          uri: FileSystem.documentDirectory + filename,
          type: getMediaType(filename),
        }));
      
      setFavoriteImages(favorites);
    } catch (error) {
      console.error("Error loading favorite images:", error);
    }
  };

  const removeFavorite = async (uri: string) => {
    try {
      console.log("Attempting to remove favorite with URI:", uri);
      
      const filename = uri.split('/').pop() || '';
      console.log("Extracted filename to remove:", filename);
      
      const favoritesJson = await AsyncStorage.getItem('favorites');
      if (!favoritesJson) {
        console.log("No favorites found in storage");
        return;
      }
      
      const favorites = JSON.parse(favoritesJson) as string[];
      console.log("Current favorites in storage:", favorites);
      
      const exists = favorites.includes(filename);
      console.log("Filename exists in favorites?", exists);
      
      if (!exists) {
        console.log("Favorite not found, nothing to remove");
        return;
      }
      
      const updatedFavorites = favorites.filter(fav => fav !== filename);
      console.log("Favorites after filtering:", updatedFavorites);
      
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      console.log("Updated favorites saved to storage");
      
      setFavoriteImages(current => current.filter(img => img.name !== filename));
      
      setTimeout(loadFavoriteImages, 100);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Favorites' }} />
      <View className="h-screen w-full max-w-screen-xl flex-1 items-center">
        {favoriteImages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-5">
            <Text className="mb-3 text-center text-2xl font-bold">No favorites yet</Text>
            <Text className="text-center font-medium text-gray-500">
              Add favorites from the gallery by tapping the heart icon!
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteImages}
            showsVerticalScrollIndicator={false}
            className="w-full flex-1"
            contentContainerClassName="p-1 pb-[100px]"
            numColumns={2}
            columnWrapperClassName="gap-1"
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="relative aspect-[9/16] h-[150px] w-1/2 max-w-[50%] flex-1 p-1">
                <Link href={`/${item.name}`} asChild>
                  <Pressable 
                    className="flex-1"
                    onPress={() => {
                      if (item.type === 'video') {
                        setSelectedVideo(item.uri);
                      } else {
                        setSelectedVideo(null);
                      }
                    }}>
                    {item.type === 'image' && (
                      <Image contentFit="cover" source={{ uri: item.uri }} style={styles.image} />
                    )}

                    {item.type === 'video' && item.uri === selectedVideo && (
                      <>
                      <Play size={50} color="white" style={{ padding: 15, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 25, position: 'absolute', top: '40%', right: '30%', zIndex: 100}} />
                      <VideoView
                        nativeControls={false}
                        player={player}
                        contentFit="cover"
                        style={{
                          flex: 1,
                          borderRadius: 12,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                      </>
                    )}
                  </Pressable>
                </Link>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation(); // Stop event propagation
                    console.log("Favorite remove button pressed for:", item.uri);
                    removeFavorite(item.uri);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 20,
                    padding: 5,
                    zIndex: 100, // Ensure it's above other elements
                  }}>
                  <Heart size={20} color="#ff6b81" fill="#ff6b81" />
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
});
