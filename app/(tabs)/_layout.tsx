import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Home, Calendar, Map, MessageSquare, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

/**
 * Custom Tab Bar component for the Premium "Floating" look.
 */
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={80} tint="light" style={styles.floatingBar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isCenter = route.name === 'map';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isCenter && styles.centerTab
              ]}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconWrapper,
                isFocused && !isCenter && styles.activeIconWrapper,
                isCenter && styles.centerIconWrapper
              ]}>
                {options.tabBarIcon?.({ 
                    color: isCenter ? '#fff' : (isFocused ? '#B81D24' : '#666'), 
                    size: isCenter ? 32 : 28 
                })}
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Acasă',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Evenimente',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Hartă',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="ai-guide"
        options={{
          title: 'Asistent AI',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 35,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    // elevation: 5,
    // overflow: 'hidden', // REMOVED to prevent center icon cutoff
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(184, 29, 36, 0.05)',
  },
  centerTab: {
    marginTop: Platform.OS === 'ios' ? -28 : -22,
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  centerIconWrapper: {
    backgroundColor: '#B81D24', // Premium wine-red color
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B81D24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },
});
