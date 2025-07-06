import { Link, Tabs } from 'expo-router';

import { HeaderButton } from '../../components/HeaderButton';
import  TabBarIcon  from '../../components/TabBarIcon';
import { CenterButton } from '~/components/CenterButton';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#db6484',
        tabBarInactiveTintColor: '#716a62',
        tabBarStyle: {
          backgroundColor: '#e0d5b9',
        },
        headerStyle: {
          backgroundColor: '#e0d5b9',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#00494a',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <TabBarIcon name={'GalleryVertical'} color={color} />
        }}
      />
      <Tabs.Screen
        name="center"
        options={{
          tabBarItemStyle: {
            width: '100%',
            pointerEvents: 'auto',
          },
          title: '',
          tabBarButton: (props) => <CenterButton bgColor={'#007c7d'} {...props} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name={'BookHeart'} color={color} />,
        }}
      />
    </Tabs>
  );
}
