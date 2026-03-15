import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { API_CONFIG } from '../../constants/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  salut: "Salut! Sunt ghidul tău Taste of Moldova. Întreabă-mă despre vinării, IGP sau unde poți mânca bine!",
  hi: "Salut! Sunt ghidul tău Taste of Moldova. Întreabă-mă despre vinării, IGP sau unde poți mânca bine!",
  mănânc: "Pentru mâncare tradițională ca la mama acasă, mergi la Asconi Winery. Dacă vrei ceva modern și rafinat, Castel Mimi are un restaurant de top cu specific fine dining. Poftă bună!",
  igp: "IGP confirmă calitatea vinului. Moldova are 4 regiuni: Codru, Ștefan Vodă, Valul lui Traian și DIVIN (pentru distilate).",
  "prețuri mimi": "Prețurile la Castel Mimi încep de la ~350 MDL. Rezervă direct prin butonul 'Rezervă Acum' din profilul vinăriei.",
};

const QUICK_QUESTIONS = [
  { text: "Tur Cricova?", key: "cricova" },
  { text: "Prețuri Mimi?", key: "mimi" },
  { text: "Unde să mănânc?", key: "mâncare" },
  { text: "Ce este IGP?", key: "igp" }
];

export default function AIGuideScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Salut! I am your personal digital guide for Moldova. Ask me about wineries, wine routes, or local culture!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  const handleSend = (textOverride?: string) => {
    const text = textOverride || inputText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputText('');
    setIsTyping(true);

    // Track AI Interaction
    fetch(`${API_CONFIG.BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ai_interaction' })
    }).catch(err => console.error('Tracking Error:', err));

    // 1-second "AI is thinking" simulation
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: getSmartResponse(text)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getSmartResponse = (text: string) => {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('mănânc')) return KNOWLEDGE_BASE.mănânc;
      if (lowerText.includes('igp')) return KNOWLEDGE_BASE.igp;
      if (lowerText.includes('prețuri mimi')) return KNOWLEDGE_BASE['prețuri mimi'];
      if (lowerText.includes('salut') || lowerText.includes('hi')) return KNOWLEDGE_BASE.salut;

      return "Salut! Sunt ghidul tău Taste of Moldova. Întreabă-mă despre vinării, IGP sau unde poți mănânca bine!";
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BlurView intensity={80} tint="light" style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.botIconWrapper}>
            <Sparkles size={20} color="#B81D24" fill="#B81D24" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Ghid Virtual</Text>
            <Text style={styles.headerSubtitle}>Knowledge Base Moldova</Text>
          </View>
        </View>
      </BlurView>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageRow, msg.role === 'ai' ? styles.rowAI : styles.rowUser]}>
            {msg.role === 'ai' && (
              <View style={styles.avatarAI}>
                <Bot size={18} color="#FFF" />
              </View>
            )}
            <View style={[styles.bubble, msg.role === 'ai' ? styles.bubbleAI : styles.bubbleUser]}>
              <Text style={[styles.messageText, msg.role === 'ai' ? styles.textAI : styles.textUser]}>
                {msg.text}
              </Text>
            </View>
            {msg.role === 'user' && (
              <View style={styles.avatarUser}>
                <User size={18} color="#FFF" />
              </View>
            )}
          </View>
        ))}
        {isTyping && (
            <View style={[styles.messageRow, styles.rowAI]}>
                <View style={styles.avatarAI}>
                    <Bot size={18} color="#FFF" />
                </View>
                <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
                    <ActivityIndicator size="small" color="#B81D24" style={{ marginRight: 8 }} />
                    <Text style={styles.typingText}>Gândesc...</Text>
                </View>
            </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.quickQuestionsScroll}
            contentContainerStyle={styles.quickQuestionsContent}
          >
            {QUICK_QUESTIONS.map((q, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.quickQuestionButton}
                onPress={() => handleSend(q.text)}
              >
                <HelpCircle size={14} color="#B81D24" />
                <Text style={styles.quickQuestionText}>{q.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputArea}>
            <View style={styles.inputWrapper}>
                <TextInput 
                style={styles.input}
                placeholder="Întreabă despre vin, rute sau cultură..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
                />
                <TouchableOpacity 
                style={styles.sendButton}
                activeOpacity={0.8}
                onPress={() => handleSend()}
                >
                <Send size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(184, 29, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160, 
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
    alignItems: 'flex-end',
  },
  rowAI: {
    alignSelf: 'flex-start',
  },
  rowUser: {
    alignSelf: 'flex-end',
  },
  avatarAI: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#B81D24',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarUser: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bubble: {
    padding: 16,
    borderRadius: 22,
  },
  bubbleAI: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#B81D24',
    borderBottomRightRadius: 4,
  },
  typingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textAI: {
    color: '#333',
  },
  textUser: {
    color: '#FFF',
  },
  typingText: {
      color: '#999',
      fontStyle: 'italic',
      fontSize: 13,
  },
  inputSection: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  quickQuestionsScroll: {
    paddingVertical: 12,
    marginBottom: 5,
  },
  quickQuestionsContent: {
      paddingHorizontal: 20,
      gap: 10,
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#B81D24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  quickQuestionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B81D24',
  },
  inputArea: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 130 : 130, 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF', // Light grey background
    borderRadius: 24,
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 0, 
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B81D24',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
