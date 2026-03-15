import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, Bookmark, Clock, User, Calendar } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useArticleStore } from '../../store/articleStore';

const { width } = Dimensions.get('window');

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { articles } = useArticleStore();
  
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text>Articolul nu a fost găsit.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#B81D24', marginTop: 10 }}>Înapoi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        bounces={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
            <Image source={{ uri: article.image }} style={styles.heroImage} />
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'transparent']}
                style={styles.heroGradient}
            >
                <SafeAreaView edges={['top']} style={styles.headerRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.actionCircle}>
                            <Share2 size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionCircle}>
                            <Bookmark size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
            <View style={styles.heroContent}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                </View>
                <Text style={styles.title}>{article.title}</Text>
            </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
            <View style={styles.metaSection}>
                <View style={styles.metaItem}>
                    <User size={16} color="#B81D24" />
                    <Text style={styles.metaText}>{article.author}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.metaText}>{article.date}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.metaText}>{article.time}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.articleBody}>
                {article.content}
            </Text>

            <View style={styles.heritageCard}>
                <LinearGradient
                    colors={['#800020', '#4A0404']}
                    style={styles.heritageGradient}
                >
                    <Text style={styles.heritageTitle}>Știai că?</Text>
                    <Text style={styles.heritageText}>
                        Moldova este țara cu cea mai mare densitate de podgorii din lume raportat la suprafața țării și populație.
                    </Text>
                </LinearGradient>
            </View>
            
            <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating Bottom Button */}
      <BlurView intensity={90} tint="light" style={styles.bottomBar}>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.exploreButtonText}>Explorați rutele vitivinicole</Text>
          </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  heroContainer: {
    width: width,
    height: 450,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
      flexDirection: 'row',
      gap: 12,
  },
  actionCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  heroContent: {
      position: 'absolute',
      bottom: 40,
      left: 24,
      right: 24,
  },
  categoryBadge: {
      backgroundColor: '#B81D24',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginBottom: 12,
  },
  categoryText: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
  },
  title: {
      fontSize: 36,
      fontWeight: '900',
      color: '#FFF',
      lineHeight: 42,
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    padding: 24,
  },
  metaSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  metaText: {
      fontSize: 13,
      color: '#666',
      fontWeight: '600',
  },
  divider: {
      height: 1,
      backgroundColor: '#F0F0F0',
      marginVertical: 20,
  },
  articleBody: {
      fontSize: 17,
      lineHeight: 28,
      color: '#333',
      marginBottom: 30,
      textAlign: 'justify',
  },
  heritageCard: {
      borderRadius: 24,
      overflow: 'hidden',
      marginBottom: 20,
  },
  heritageGradient: {
      padding: 24,
  },
  heritageTitle: {
      color: '#E2D1C3',
      fontSize: 14,
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: 8,
  },
  heritageText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
  },
  bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)',
  },
  exploreButton: {
      backgroundColor: '#B81D24',
      height: 56,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#B81D24',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
  },
  exploreButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
  },
  errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  }
});
