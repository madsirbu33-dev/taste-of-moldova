import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  Ticket, 
  Settings, 
  ChevronRight, 
  Info, 
  Award,
  LogOut,
  Bell,
  Shield
} from 'lucide-react-native';

function MenuItem({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) {
  return (
    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
      <View style={styles.menuIconWrapper}>
        <Icon size={20} color="#1A1A1A" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color="#CCC" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
               <Text style={styles.avatarInitial}>M</Text>
            </View>
            <View style={styles.badge}>
              <Award size={12} color="#FFF" fill="#FFF" />
            </View>
          </View>
          <Text style={styles.userName}>Madalina</Text>
          <View style={styles.premiumBadge}>
             <Text style={styles.premiumText}>Premium Explorer</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Activity</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={Heart} title="Saved Wineries" subtitle="12 locations" />
            <MenuItem icon={Ticket} title="My Tickets" subtitle="2 upcoming events" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.menuGroup}>
            <MenuItem icon={Bell} title="Notifications" />
            <MenuItem icon={Shield} title="Privacy & Security" />
            <MenuItem icon={Settings} title="General Settings" />
          </View>
        </View>

        {/* Strategic Info Block */}
        <View style={styles.infoCard}>
           <View style={styles.infoIconWrapper}>
              <Info size={24} color="#B81D24" />
           </View>
           <View style={styles.infoContent}>
              <Text style={styles.aboutTitle}>About Taste of Moldova</Text>
              <Text style={styles.aboutText}>
                Official Digital Guide aligned with the <Text style={styles.boldText}>European Moldova 2030</Text> strategy. 
                Promoting the <Text style={styles.boldText}>Tree of Life</Text> national brand.
              </Text>
           </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#B81D24" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: '800',
    color: '#B81D24',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#B81D24',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  premiumBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(184, 29, 36, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumText: {
    color: '#B81D24',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuGroup: {
    backgroundColor: '#F9F9F9',
    borderRadius: 32,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  infoCard: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(184, 29, 36, 0.1)',
    flexDirection: 'row',
    shadowColor: '#B81D24',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  infoIconWrapper: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  boldText: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B81D24',
    marginLeft: 8,
  }
});
