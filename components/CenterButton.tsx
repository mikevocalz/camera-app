import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { Pressable, View } from "react-native";

//background svg which will create space
type ButtonProps = {
  bgColor: string;
};

export const CenterButton = ({bgColor, ...props}: ButtonProps) => {
  const router = useRouter();
  return (
    <View className="relative items-center" pointerEvents="box-none">
      <Pressable
        className="top-[-22.5] justify-center items-center w-[80px] h-[80px] rounded-[27px]"
        style={{ backgroundColor: bgColor }}
        onPress={() => router.push('/camera')}>
        <Camera color="#e0d5b9" size={48} />
      </Pressable>
    </View>
  );
};
