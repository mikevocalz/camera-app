import { Link, useLocalSearchParams, Stack, router } from 'expo-router';
import { View,  } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { getMediaType } from '../utils/media';
import * as MediaLibrary from 'expo-media-library';

export default function ImageScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();

    const fullUri = (FileSystem.documentDirectory || '') + (name || '');
    const type = getMediaType(fullUri);

    const player = useVideoPlayer(fullUri, (player) => {
      player.loop = true;
      player.play();
    });


  const onDelete = async () => {
    await FileSystem.deleteAsync(fullUri);
    router.back();
  };

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const onSave = async () => {
    if (permissionResponse?.status !== 'granted') {
      await requestPermission();
    }
    const asset = await MediaLibrary.createAssetAsync(fullUri);
    router.back();
  };

  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen
        options={{
          title: 'Media',
          headerBackTitle: 'Back',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <MaterialIcons onPress={onDelete} name="delete" size={26} color="crimson" />
              <MaterialIcons onPress={onSave} name="save" size={26} color="dimgray" />
            </View>
          ),
        }}
      />
      {type === 'image' && (
        <Image source={{ uri: fullUri }} style={{ width: '100%', height: '100%' }} />
      )}

      {type === 'video' && (
        <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      )}
    </View>
  );
}
