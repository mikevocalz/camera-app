import { useCameraPermissions, CameraType, CameraView, CameraCapturedPicture } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import path from 'path';
import { useVideoPlayer, VideoView, VideoThumbnail } from 'expo-video';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [picture, setPicture] = useState<CameraCapturedPicture | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<string | null>(null);

  const camera = useRef<CameraView>(null);
  const router = useRouter();

    const player = useVideoPlayer(video, (player) => {
      player.loop = true;
      player.play();
    });


  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return <ActivityIndicator color={'red'} size={'large'} className="mt-[40%]" />;
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    const res = await camera.current?.takePictureAsync();
    setPicture(res || null);
  };


  const saveFile = async (uri: string) => {
    try {
      console.log("Saving file from URI:", uri);
      // Add timestamp to filename to ensure uniqueness
      const timestamp = new Date().getTime();
      const extension = path.extname(uri) || '.jpg';
      const filename = `photo_${timestamp}${extension}`;
      console.log("Filename:", filename);
      console.log("Saving to:", FileSystem.documentDirectory + filename);

      await FileSystem.copyAsync({
        from: uri,
        to: FileSystem.documentDirectory + filename,
      });

      console.log("File saved successfully");
      setPicture(null);
      setVideo(null);
      router.back();
    } catch (error) {
      console.error("Error saving file:", error);
      // Still navigate back even if save fails
      setPicture(null);
      router.back();
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    const res = await camera.current?.recordAsync();
    setVideo(res?.uri || null);
    setIsRecording(false);
  };

  const onPress = () => {
    if (isRecording) {
      camera.current.stopRecording();
    } else {
      takePicture();
    }
  };

  if (picture || video) {
    return (
      <View className="flex-1">
        {picture && (
          <Image
            contentFit="cover"
            source={{ uri: picture.uri }}
            style={{ width: '100%', flex: 1 }}
          />
        )}
        {video && (
          <VideoView contentFit="cover" style={{ width: '100%', flex: 1 }} player={player} />
        )}
        <View style={{ backgroundColor: '#00494a' }} className="z-50 p-[4px] w-full items-center relative pb-[28px]">
          <SafeAreaView edges={['bottom']} className="w-full items-center">
            <Pressable className="bg-white h-[48px] w-full items-center justify-center rounded-xl  my-[2px] px-[12px] max-w-[400px]" onPress={() => saveFile(picture?.uri || video || '')}>
              <Text className="mb-1 text-center font-medium">Save</Text>
            </Pressable>
          </SafeAreaView>
        </View>
        <MaterialIcons
          onPress={() => {
            setPicture(null);
            setVideo(null);
          }}
          name="close"
          size={35}
          color="white"
          style={{ position: 'absolute', top: 50, left: 20 }}
        />
      </View>
    );
  }

  return (
    <View className="h-full w-full max-w-screen-lg">
      <CameraView
        ref={camera}
        facing={facing}
        mode='video'
        style={StyleSheet.absoluteFill}
        className="h-full w-full max-w-screen-lg"
      />
      <MaterialIcons
        onPress={() => {
          setPicture(null);
          router.back();
        }}
        name="close"
        size={35}
        color="white"
        style={{ position: 'absolute', left: 20, top: 50 }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 20,
          paddingBottom: 40,
        }}>
        <View style={{ width: '10%' }} />
        <Pressable
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: isRecording ? 'turquoise' : 'white',
            alignSelf: 'center',
          }}
          onPress={onPress}
          onLongPress={startRecording}
        />
        <MaterialIcons
          onPress={toggleCameraFacing}
          name="flip-camera-ios"
          size={24}
          color="white"
        />
      </View>
    </View>
  );
}
