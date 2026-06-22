import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../services/translation';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const AIChat: React.FC = () => {
  const { profile, stats, logs } = useAppContext();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!profile) return;

    // Format the recent 15 logs
    const recentLogsStr = logs.slice(0, 15).map(l => {
      const dateStr = l.date ? l.date.split('T')[0] : 'No date';
      return `- [${dateStr}] ${l.description} (${l.category}): ${l.co2Impact} kg CO2, +${l.xpEarned} XP`;
    }).join('\n');

    // Initialize the chat session with deep context about the user and the app
    const systemInstruction = `You are the Smart Carbon Tracker AI Assistant.
    
    User Context:
    - Name: ${profile.userName || 'User'}
    - Location: ${profile.city}, ${profile.state}, ${profile.country}
    - Preferred Language: ${profile.language}
    - Current Goal: ${profile.goal}
    
    User's Current Stats:
    - Carbon Score (Total Emissions): ${stats.carbonScore} kg CO2 (Lower is better)
    - Green XP: ${stats.greenXP} (Level ${stats.level})
    - Health Score: ${stats.healthyLivingScore}/100
    - CO2 Saved (Total Savings): ${stats.co2SavedKg} kg
    - Money Saved: $${stats.moneySaved}
    
    User's Recent Activity Logs (up to 15):
    ${recentLogsStr || 'No activities logged yet.'}
    
    App Context & Features:
    - The app tracks carbon footprints, healthy living, and government climate targets.
    - "Green XP" is earned by completing eco-friendly tasks and logging activities.
    - "Gov Targets" shows live data on national Net Zero goals and renewable energy.
    - "What If Simulator" lets users see the impact of lifestyle changes.
    - "Carbon Source Library" explains the impact of 1000+ activities.
    
    Your Job:
    - IMPORTANT: detect the language the user is speaking and reply in that language (ChatGPT style). If they say "talk hindi" or "हिंदी में बात करो", reply in Hindi. If they speak Marathi, reply in Marathi.
    - Otherwise, default to user's preferred language: ${profile.language}.
    - Answer questions about sustainability, carbon footprints, and climate change.
    - Explain the user's specific data and app features if they ask.
    - Provide localized advice based on their country/city (${profile.city}, ${profile.country}).
    - Be encouraging, concise, and friendly.`;

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    // Set initial greeting using translation dictionary
    const initialGreetings: Record<string, string> = {
      English: `Hello ${profile.userName || ''}! I am your AI Sustainability Assistant. I can help you understand your stats, explain app features, or give eco-friendly tips. How can I help you today?`,
      Hindi: `नमस्ते ${profile.userName || ''}! मैं आपका एआई पर्यावरण सहायक हूँ। मैं आपको अपने आँकड़ों को समझने, ऐप सुविधाओं को जानने या पर्यावरण-अनुकूल सुझाव देने में मदद कर सकता हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`,
      Marathi: `नमस्कार ${profile.userName || ''}! मी आपला एआय पर्यावरण सहाय्यक आहे. मी तुम्हाला तुमची आकडेवारी समजून घेण्यास, ॲपची वैशिष्ट्ये जाणून घेण्यास किंवा पर्यावरणपूरक टिप्स देण्यास मदत करू शकतो. आज मी तुम्हाला कशी मदत करू शकतो?`,
      Spanish: `¡Hola ${profile.userName || ''}! Soy tu asistente ecológico de IA. Puedo ayudarte a comprender tus estadísticas, explicarte las funciones de la aplicación o darte consejos ecológicos. ¿Cómo puedo ayudarte hoy?`,
      French: `Bonjour ${profile.userName || ''} ! Je suis votre assistant écologique IA. Je peux vous aider à comprendre vos statistiques, vous expliquer les fonctionnalités de l'application ou vous donner des conseils écologiques. Comment puis-je vous aider aujourd'hui ?`
    };

    const userLang = profile.language || 'English';
    const greeting = initialGreetings[userLang] || initialGreetings['English'];

    setMessages([
      { role: 'model', text: greeting }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.userName]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) throw new Error("Chat not initialized");
      const response = await chatRef.current.sendMessage({ message: userMsg });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch (error) {
      console.warn("Vertex AI connection failed, using local smart sustainability advisor fallback:", error);
      const fallbackResponse = getLocalAIResponse(userMsg, profile, stats, logs);
      // Wait a tiny bit to simulate typing
      await new Promise(r => setTimeout(r, 600));
      setMessages(prev => [...prev, { role: 'model', text: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectLanguage = (text: string, preferredLang: string): string => {
    const clean = text.toLowerCase();
    
    // Explicit language change commands
    if (clean.includes('hindi') || clean.includes('हिंदी') || clean.includes('हिन्दी')) return 'Hindi';
    if (clean.includes('marathi') || clean.includes('मराठी')) return 'Marathi';
    if (clean.includes('spanish') || clean.includes('español') || clean.includes('espanol')) return 'Spanish';
    if (clean.includes('french') || clean.includes('français') || clean.includes('francais')) return 'French';
    if (clean.includes('english') || clean.includes('अंग्रेजी') || clean.includes('इंग्रजी')) return 'English';

    // Script/character checks
    // Devnagari script range: \u0900-\u097F
    if (/[\u0900-\u097F]/.test(text)) {
      const marathiWords = ['आहे', 'नाही', 'काय', 'कसं', 'करतो', 'मला', 'तुला', 'सांग', 'नमस्कार', 'प्रवास', 'सायकल', 'कचरा', 'झालं', 'करू'];
      if (marathiWords.some(w => clean.includes(w))) {
        return 'Marathi';
      }
      return 'Hindi';
    }

    // Spanish word checks
    const spanishWords = ['hola', 'gracias', 'como', 'buenos', 'dias', 'tarde', 'noche', 'por', 'favor', 'carbono', 'energia', 'agua', 'transporte', 'comida', 'puntos'];
    if (spanishWords.some(w => clean.split(/\s+/).includes(w))) return 'Spanish';

    // French word checks
    const frenchWords = ['bonjour', 'merci', 'sante', 'comment', 's\'il', 'sil', 'plait', 'carbone', 'energie', 'eau', 'transport', 'nourriture', 'repas'];
    if (frenchWords.some(w => clean.split(/\s+/).includes(w))) return 'French';

    return preferredLang;
  };

  const getLocalAIResponse = (message: string, userProfile: any, userStats: any, userLogs: any[] = []): string => {
    const preferredLang = userProfile?.language || 'English';
    const lang = detectLanguage(message, preferredLang);

    const respond = (en: string, hi: string, mr: string, es: string, fr: string) => {
      if (lang === 'Hindi') return hi;
      if (lang === 'Marathi') return mr;
      if (lang === 'Spanish') return es;
      if (lang === 'French') return fr;
      return en;
    };

    const msg = message.toLowerCase();

    // Multi-language keyword lists
    const helloKeywords = ['hello', 'hi', 'hey', 'नमस्ते', 'hola', 'नमस्कार', 'bonjour', 'hallo', 'ola', 'काही', 'कसा'];
    const scoreKeywords = ['score', 'stat', 'current', 'level', 'xp', 'स्कोर', 'लेवल', 'स्थिति', 'अंक', 'puntos', 'nivel', 'puntaje', 'point', 'note', 'stats', 'progress', 'गुण', 'पातळी'];
    const transportKeywords = ['transport', 'car', 'vehicle', 'bike', 'walk', 'cycle', 'यात्रा', 'गाड़ी', 'कार', 'सफर', 'coche', 'caminar', 'bicicleta', 'viaje', 'transporte', 'voiture', 'marcher', 'vélo', 'प्रवास', 'सायकल', 'बस', 'गाडी'];
    const energyKeywords = ['solar', 'electricity', 'energy', 'power', 'light', 'बिजली', 'ऊर्जा', 'सौर', 'luz', 'energía', 'sol', 'electricidad', 'courant', 'ampoule', 'panneau', 'kwh', 'plug', 'unplug', 'वीज', 'उर्जा'];
    const foodKeywords = ['food', 'eat', 'meat', 'vegan', 'vegetarian', 'diet', 'भोजन', 'खाना', 'सब्जी', 'मांस', 'शाकाहारी', 'comida', 'carne', 'vegetariano', 'nourriture', 'manger', 'repas', 'veggie', 'जेवण', 'अन्न', 'शाकाहारी'];
    const reduceKeywords = ['how', 'reduce', 'tips', 'help', 'कम', 'तरीका', 'सुझाव', 'reducir', 'consejo', 'aide', 'comment', 'réduire', 'decrease', 'action', 'कमी', 'मदत', 'टीप'];

    const matches = (keywords: string[]) => keywords.some(k => msg.includes(k));

    // Dynamic calculations from userLogs
    const totalLogs = userLogs.length;
    
    // Filters
    const transportLogs = userLogs.filter(l => l.category === 'Transport');
    const energyLogs = userLogs.filter(l => l.category === 'Electricity' || l.category === 'Energy');
    const foodLogs = userLogs.filter(l => l.category === 'Food');
    const waterLogs = userLogs.filter(l => l.category === 'Water');
    const wasteLogs = userLogs.filter(l => l.category === 'Waste');

    // Counts
    const transportCount = transportLogs.length;
    const energyCount = energyLogs.length;
    const foodCount = foodLogs.length;
    const waterCount = waterLogs.length;
    const wasteCount = wasteLogs.length;

    // Percentages
    const transportPct = totalLogs > 0 ? Math.round((transportCount / totalLogs) * 100) : 0;
    const energyPct = totalLogs > 0 ? Math.round((energyCount / totalLogs) * 100) : 0;
    const foodPct = totalLogs > 0 ? Math.round((foodCount / totalLogs) * 100) : 0;
    const waterPct = totalLogs > 0 ? Math.round((waterCount / totalLogs) * 100) : 0;
    const wastePct = totalLogs > 0 ? Math.round((wasteCount / totalLogs) * 100) : 0;

    // Net impacts (CO2 impact can be positive or negative)
    const transportNet = parseFloat(transportLogs.reduce((sum, l) => sum + l.co2Impact, 0).toFixed(1));
    const energyNet = parseFloat(energyLogs.reduce((sum, l) => sum + l.co2Impact, 0).toFixed(1));
    const foodNet = parseFloat(foodLogs.reduce((sum, l) => sum + l.co2Impact, 0).toFixed(1));
    const waterNet = parseFloat(waterLogs.reduce((sum, l) => sum + l.co2Impact, 0).toFixed(1));
    const wasteNet = parseFloat(wasteLogs.reduce((sum, l) => sum + l.co2Impact, 0).toFixed(1));

    if (matches(helloKeywords)) {
      return respond(
        `Hello ${userProfile?.userName || 'there'}! I am your AI Eco Assistant. How can I help you track or reduce your carbon footprint today?`,
        `नमस्ते ${userProfile?.userName || 'जी'}! मैं आपका एआई पर्यावरण सहायक हूँ। आज मैं आपके कार्बन फुटप्रिंट को ट्रैक करने या इसे कम करने में आपकी क्या सहायता कर सकता हूँ?`,
        `नमस्कार ${userProfile?.userName || 'जी'}! मी तुमचा एआय पर्यावरण सहाय्यक आहे. आज मी तुम्हाला तुमचा कार्बन फूटप्रिंट ट्रॅक किंवा कमी करण्यात कशी मदत करू शकतो?`,
        `¡Hola ${userProfile?.userName || 'ahí'}! Soy tu Asistente Eco IA. ¿Cómo puedo ayudarte a rastrear o reducir tu huella de carbono hoy?`,
        `Bonjour ${userProfile?.userName || 'ici'} ! Je suis votre Assistant Éco IA. Comment puis-je vous aider à suivre ou réduire votre empreinte carbone aujourd'hui ?`
      );
    }

    if (matches(scoreKeywords)) {
      return respond(
        `Here is your live carbon analysis:
- Carbon Score: ${userStats.carbonScore} kg CO₂ (lower is better)
- Green XP: ${userStats.greenXP} (Level ${userStats.level})
- CO₂ Saved: ${userStats.co2SavedKg.toFixed(1)} kg
- Money Saved: $${userStats.moneySaved.toFixed(2)}

Category Ratios out of ${totalLogs} total logged activities:
- 🚗 Transport: ${transportCount} logs (${transportPct}%), Net: ${transportNet} kg CO₂
- ⚡ Energy: ${energyCount} logs (${energyPct}%), Net: ${energyNet} kg CO₂
- 🍔 Food: ${foodCount} logs (${foodPct}%), Net: ${foodNet} kg CO₂
- 💧 Water: ${waterCount} logs (${waterPct}%), Net: ${waterNet} kg CO₂
- ♻️ Waste: ${wasteCount} logs (${wastePct}%), Net: ${wasteNet} kg CO₂

Your health score is ${userStats.healthyLivingScore}/100. Keep up the green choices!`,
        `यहाँ आपका लाइव कार्बन विश्लेषण है:
- कार्बन स्कोर: ${userStats.carbonScore} किलोग्राम (जितना कम हो उतना अच्छा है)
- ग्रीन एक्सपी: ${userStats.greenXP} (लेवल ${userStats.level})
- कुल बचाया गया: ${userStats.co2SavedKg.toFixed(1)} किलोग्राम CO₂
- कुल बचाए गए पैसे: $${userStats.moneySaved.toFixed(2)}

आपके ${totalLogs} कुल लॉग की गई गतिविधियों में से श्रेणी अनुपात:
- 🚗 परिवहन: ${transportCount} लॉग (${transportPct}%), नेट: ${transportNet} किलो CO₂
- ⚡ ऊर्जा: ${energyCount} लॉग (${energyPct}%), नेट: ${energyNet} किलो CO₂
- 🍔 भोजन: ${foodCount} लॉग (${foodPct}%), नेट: ${foodNet} किलो CO₂
- 💧 पानी: ${waterCount} लॉग (${waterPct}%), नेट: ${waterNet} किलो CO₂
- ♻️ कचरा: ${wasteCount} लॉग (${wastePct}%), नेट: ${wasteNet} किलो CO₂

आपका स्वास्थ्य स्कोर ${userStats.healthyLivingScore}/100 है। अच्छे विकल्प चुनते रहें!`,
        `तुमचे लाइव्ह carbon विश्लेषण येथे आहे:
- कार्बन स्कोअर: ${userStats.carbonScore} किलो (कमी असणे चांगले)
- ग्रीन XP: ${userStats.greenXP} (पातळी ${userStats.level})
- एकूण बचत: ${userStats.co2SavedKg.toFixed(1)} किलो CO₂
- एकूण पैशांची बचत: $${userStats.moneySaved.toFixed(2)}

एकूण ${totalLogs} नोंदणीकृत उपक्रमांमधील प्रमाण:
- 🚗 वाहतूक: ${transportCount} नोंदी (${transportPct}%), नेट: ${transportNet} किलो CO₂
- ⚡ ऊर्जा: ${energyCount} नोंदी (${energyPct}%), नेट: ${energyNet} किलो CO₂
- 🍔 अन्न: ${foodCount} नोंदी (${foodPct}%), Net: ${foodNet} किलो CO₂
- 💧 पाणी: ${waterCount} नोंदी (${waterPct}%), नेट: ${waterNet} किलो CO₂
- ♻️ कचरा: ${wasteCount} नोंदी (${wastePct}%), नेट: ${wasteNet} किलो CO₂

तुमचा आरोग्य स्कोअर ${userStats.healthyLivingScore}/100 आहे. हिरवे पर्याय निवडत राहा!`,
        `Aquí está tu análisis de carbono en vivo:
- Puntuación de Carbono: ${userStats.carbonScore} kg CO₂ (menor es mejor)
- Green XP: ${userStats.greenXP} (Nivel ${userStats.level})
- CO₂ Ahorrado: ${userStats.co2SavedKg.toFixed(1)} kg
- Dinero Ahorrado: $${userStats.moneySaved.toFixed(2)}

Distribución de tus ${totalLogs} actividades:
- 🚗 Transporte: ${transportCount} logs (${transportPct}%), Neto: ${transportNet} kg CO₂
- ⚡ Energía: ${energyCount} logs (${energyPct}%), Neto: ${energyNet} kg CO₂
- 🍔 Comida: ${foodCount} logs (${foodPct}%), Neto: ${foodNet} kg CO₂
- 💧 Agua: ${waterCount} logs (${waterPct}%), Neto: ${waterNet} kg CO₂
- ♻️ Residuos: ${wasteCount} logs (${wastePct}%), Neto: ${wasteNet} kg CO₂

¡Tu puntuación de salud es ${userStats.healthyLivingScore}/100!`,
        `Voici votre analyse de carbone en temps réel :
- Score Carbone : ${userStats.carbonScore} kg CO₂ (le plus bas est le mieux)
- Green XP : ${userStats.greenXP} (Niveau ${userStats.level})
- CO₂ Économisé : ${userStats.co2SavedKg.toFixed(1)} kg
- Argent Économisé : $${userStats.moneySaved.toFixed(2)}

Répartition de vos ${totalLogs} activités :
- 🚗 Transport : ${transportCount} logs (${transportPct}%), Net : ${transportNet} kg CO₂
- ⚡ Énergie : ${energyCount} logs (${energyPct}%), Net : ${energyNet} kg CO₂
- 🍔 Nourriture : ${foodCount} logs (${foodPct}%), Net : ${foodNet} kg CO₂
- 💧 Eau : ${waterCount} logs (${waterPct}%), Net : ${waterNet} kg CO₂
- ♻️ Déchets : ${wasteCount} logs (${wastePct}%), Net : ${wasteNet} kg CO₂

Votre score de vie saine est de ${userStats.healthyLivingScore}/100 !`
      );
    }

    if (matches(transportKeywords)) {
      return respond(
        `Transport makes up ${transportPct}% of your logged activities (${transportCount} logs) with a net impact of ${transportNet} kg CO₂. Since you are in ${userProfile?.city || 'your city'}, try:
1. Walk or Cycle for short trips (earns +20 XP).
2. Use public transit or carpool whenever possible.
3. Switch to an Electric Vehicle (EV) which can reduce your personal transit footprint by ~80% compared to fossil fuel vehicles.`,
        `परिवहन आपकी ${transportPct}% गतिविधियों (${transportCount} लॉग) का हिस्सा है, जिसका नेट प्रभाव ${transportNet} किलो CO₂ है। चूंकि आप ${userProfile?.city || 'अपने शहर'} में हैं, कोशिश करें:
1. छोटी यात्राओं के लिए पैदल चलें या साइकिल का उपयोग करें (आपको +20 XP मिलेंगे)।
2. जब भी संभव हो सार्वजनिक परिवहन या कारपूल का उपयोग करें।
3. इलेक्ट्रिक वाहन (EV) अपनाने पर विचार करें, जो जीवाश्म ईंधन वाहनों की तुलना में आपके फुटप्रिंट को ~80% तक कम कर सकता है।`,
        `वाहतूक तुमच्या ${transportPct}% उपक्रमांचा (${transportCount} नोंदी) भाग आहे, ज्याचा निव्वळ प्रभाव ${transportNet} किलो CO₂ आहे. तुम्ही ${userProfile?.city || 'तुमच्या शहरात'} असल्यामुळे, प्रयत्न करा:
1. लहान प्रवासासाठी चाला किंवा सायकल चालवा (+20 XP मिळतात).
2. शक्य असेल तेव्हा सार्वजनिक वाहतूक किंवा कारपूल वापरा.
3. इलेक्ट्रिक व्हेईकल (EV) वर स्विच करा जे जीवाश्म इंधन वाहनांच्या तुलनेत तुमच्या फूटप्रिंटला ~८०% कमी करू शकते।`,
        `El transporte representa el ${transportPct}% de tus actividades (${transportCount} logs) con un impacto neto de ${transportNet} kg CO₂. Dado que estás en ${userProfile?.city || 'tu ciudad'}, intenta:
1. Caminar o ir en bicicleta para distancias cortas (gana +20 XP).
2. Usar transporte público o compartir vehículo.
3. Cambiar a un vehículo eléctrico (EV), que reduce tus emisiones en un 80%.`,
        `Le transport représente ${transportPct}% de vos activités ({transportCount} logs) avec un impact net de ${transportNet} kg CO₂. Puisque vous êtes à ${userProfile?.city || 'votre ville'}, essayez :
1. Marchez ou faites du vélo pour les courts trajets (gagnez +20 XP).
2. Utilisez les transports en commun ou le covoiturage.
3. Passer à un véhicule électrique (EV), ce qui peut réduire votre empreinte transport de 80 %.`
      );
    }

    if (matches(energyKeywords)) {
      return respond(
        `Energy/Electricity makes up ${energyPct}% of your logged activities (${energyCount} logs) with a net impact of ${energyNet} kg CO₂. To optimize:
1. Unplug devices that are in standby mode (phantom load).
2. Consider installing Solar Panels, which can reduce your carbon footprint by up to 3000 kg of CO₂ per year.
3. Switch to LED lighting and energy-efficient appliances.`,
        `ऊर्जा/बिजली आपकी ${energyPct}% गतिविधियों (${energyCount} लॉग) का हिस्सा है, जिसका नेट प्रभाव ${energyNet} किलो CO₂ है। सुधार के लिए:
1. स्टैंडबाय मोड वाले उपकरणों को अनप्लग करें।
2. सोलर पैनल लगाने पर विचार करें, जो प्रति वर्ष आपके फुटप्रिंट को 3000 किलोग्राम CO₂ तक कम कर सकता है।
3. एलईडी लाइट्स और ऊर्जा-कुशल उपकरणों का उपयोग करें।`,
        `ऊर्जा/वीज तुमच्या ${energyPct}% उपक्रमांचा (${energyCount} नोंदी) भाग आहे, निव्वळ प्रभाव ${energyNet} किलो CO₂ आहे. सुधारण्यासाठी:
1. स्टँडबाय मोडमध्ये असलेली उपकरणे अनप्लग करा.
2. सोलर पॅनेल बसवण्याचा विचार करा, जे तुमचे कार्बन फूटप्रिंट वर्षाला 3000 किलो CO₂ पर्यंत कमी करू शकतात.
3. एलईडी दिवे आणि ऊर्जा-कार्यक्षम उपकरणांवर स्विच करा।`,
        `La energía representa el ${energyPct}% de tus actividades (${energyCount} logs) con un impacto neto de ${energyNet} kg CO₂. Para optimizar:
1. Desconecta los aparatos en modo de espera.
2. Considera instalar paneles solares para reducir tu huella en unos 3000 kg de CO₂ al año.
3. Cambia a luces LED.`,
        `L'énergie représente ${energyPct}% de vos activités (${energyCount} logs) avec un impact net de ${energyNet} kg CO₂. Pour optimiser :
1. Débranchez les appareils en mode veille.
2. Envisagez d'installer des panneaux solaires pour réduire votre empreinte jusqu'à 3000 kg de CO₂ par an.
3. Utilisez des éclairages LED.`
      );
    }

    if (matches(foodKeywords)) {
      return respond(
        `Food/Diet makes up ${foodPct}% of your logged activities (${foodCount} logs) with a net impact of ${foodNet} kg CO₂. Tips:
1. Adopting a vegetarian or vegan diet significantly reduces greenhouse gases (cuts ~1500 kg CO₂ per year if consistent).
2. Avoid food waste by shopping with a list and utilizing leftovers.
3. Buy local, seasonal products to reduce food miles.`,
        `भोजन/आहार आपकी ${foodPct}% गतिविधियों (${foodCount} लॉग) का हिस्सा है, जिसका नेट प्रभाव ${foodNet} किलो CO₂ है। सुझाव:
1. शाकाहारी या वीगन आहार अपनाने से ग्रीनहाउस गैसें बहुत कम होती हैं (साल में ~1500 किलोग्राम CO₂ की बचत)।
2. खरीदारी की सूची बनाकर भोजन की बर्बादी से बचें।
3. फूड माइल्स को कम करने के लिए स्थानीय और मौसमी खाद्य पदार्थ खरीदें।`,
        `अन्न/आहार तुमच्या ${foodPct}% उपक्रमांचा (${foodCount} नोंदी) भाग आहे, निव्वळ प्रभाव ${foodNet} किलो CO₂ आहे. टिप्स:
1. शाकाहारी किंवा शाकाहारी आहार स्वीकारल्याने हरितगृह वायू लक्षणीयरीत्या कमी होतात (नियमित असल्यास वर्षाला ~१५०० किलो CO₂ ची बचत होते).
2. खरेदी सूचीसह खरेदी करून अन्नाचा अपव्यय टाळा.
3. फूड माइल्स कमी करण्यासाठी स्थानिक, हंगामी उत्पादने खरेदी करा।`,
        `La comida representa el ${foodPct}% de tus actividades (${foodCount} logs) con un impacto neto de ${foodNet} kg CO₂. Consejos:
1. Adoptar una dieta vegetariana o vegana reduce significativamente los gases (ahorra ~1500 kg de CO₂ al año).
2. Evita el desperdicio planificando las compras.
3. Elige productos locales y de temporada.`,
        `L'alimentation représente ${foodPct}% de vos activités (${foodCount} logs) avec un impact net de ${foodNet} kg CO₂. Conseils :
1. Adopter un régime végétarien ou végétalien réduit considérablement les gaz (environ 1500 kg de CO₂ en moins par an).
2. Évitez le gaspillage en planifiant vos courses.
3. Privilégiez les produits locaux et de saison.`
      );
    }

    if (matches(reduceKeywords)) {
      return respond(
        `Here are the best ways to reduce your carbon footprint today:
1. Use the "Daily Log" tab to log walking/cycling or healthy habits.
2. Check the "What If Simulator" to preview the impact of future actions (like switching to EV or installing solar).
3. Try to complete your AI Daily Missions shown on the dashboard for bonus Green XP!`,
        `आज अपने carbon footprint को कम करने के बेहतरीन तरीके:
1. "Daily Log" टैब का उपयोग करके पैदल चलने/साइकिल चलाने या अन्य आदतों को दर्ज करें।
2. भविष्य के बदलावों (जैसे ईवी पर स्विच करना या सोलर लगाना) के प्रभाव को देखने के लिए "What If Simulator" देखें।
3. अतिरिक्त ग्रीन एक्सपी बोनस के लिए डैशबोर्ड पर दिए गए एआई दैनिक मिशनों को पूरा करने का प्रयास करें!`,
        `तुमचे कार्बन फूटप्रिंट आजच कमी करण्याचे उत्तम मार्ग येथे आहेत:
1. चालणे/सायकल चालवणे किंवा इतर सवयी नोंदवण्यासाठी "Daily Log" टॅब वापरा.
2. भविष्यातील कृतींचे परिणाम तपासण्यासाठी "What If Simulator" तपासा (उदा. ईव्ही किंवा सोलर पॅनेल लावणे).
3. बोनस ग्रीन एक्सपी मिळवण्यासाठी तुमच्या डॅशबोर्डवर दिसणारी एआय दैनिक मिशन पूर्ण करण्याचा प्रयत्न करा!`,
        `Aquí tienes las mejores maneras de reducir tu huella hoy:
1. Usa la pestaña "Daily Log" para registrar tus actividades.
2. Consulta el "What If Simulator" para predecir el impacto de futuros cambios.
3. ¡Completa las misiones diarias en tu panel para ganar Green XP!`,
        `Voici les meilleures façons de réduire votre empreinte aujourd'hui :
1. Utilisez l'onglet "Daily Log" pour enregistrer vos activités.
2. Consultez le "What If Simulator" pour prévoir l'impact de vos choix futurs.
3. Remplissez les missions quotidiennes pour remporter des Green XP !`
      );
    }

    return respond(
      `That is an interesting topic! As your sustainability advisor in ${userProfile?.city || 'your region'}, I encourage you to check your current carbon score of ${userStats.carbonScore} kg. You can inspect the carbon impact of 1000+ activities in our "Source Library" tab, or simulate green investments in the "What If Simulator". Let me know if you have specific questions about saving energy, water, transport, or waste recycling!`,
      `यह एक बहुत अच्छा विषय है! ${userProfile?.city || 'आपके क्षेत्र'} में आपके पर्यावरण सलाहकार के रूप में, मैं आपको अपना वर्तमान कार्बन स्कोर (${userStats.carbonScore} किलोग्राम) देखने का सुझाव देता हूँ। आप "Source Library" टैब में 1000+ गतिविधियों के प्रभाव की जांच कर सकते हैं, या "What If Simulator" में हरित निवेश का सिमुलेशन कर सकते हैं। मुझे बताएं कि क्या आपके पास कोई और प्रश्न है!`,
      `हा एक मनोरंजक विषय आहे! ${userProfile?.city || 'तुमच्या प्रदेशातील'} शाश्वतता सल्लागार म्हणून, मी तुम्हाला तुमचा सध्याचा कार्बन स्कोअर ${userStats.carbonScore} किलो तपासण्यासाठी प्रोत्साहित करतो. तुम्ही आमच्या "Source Library" मध्ये १०००+ कृतींचे कार्बन प्रभाव तपासू शकता किंवा "What If Simulator" मध्ये हरित गुंतवणूकीचे सिमुलेशन करू शकता. तुम्हाला वीज, पाणी, वाहतूक किंवा कचरा पुनर्वापराबद्दल काही विशिष्ट प्रश्न असल्यास विचारा!`,
      `¡Es un tema interesante! Como tu asesor en ${userProfile?.city || 'tu región'}, te animo a revisar tu puntuación de carbono de ${userStats.carbonScore} kg. Puedes ver el impacto de más de 1000 actividades en nuestra "Source Library" o usar el "What If Simulator". ¡Pregúntame sobre cualquier duda de ahorro ecológico!`,
      `C'est un sujet intéressant ! En tant que conseiller à ${userProfile?.city || 'votre région'}, je vous invite à regarder votre score actuel de ${userStats.carbonScore} kg. Vous pouvez inspecter l'impact de plus de 1000 activités dans la "Source Library" ou simuler des choix dans le "What If Simulator".`
    );
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('ai_assistant_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('ai_assistant_desc')}</p>
        </div>
      </div>

      <div className="flex-1 bg-white/70 dark:bg-gray-900/75 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden backdrop-blur-md">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-eco-100 dark:bg-emerald-950/50 text-eco-600 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'user' ? 'bg-eco-600 dark:bg-emerald-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-600 dark:text-blue-400" /> {t('thinking')}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('ai_placeholder')}
              className="flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-4 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
