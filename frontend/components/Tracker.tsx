import React, { useState } from 'react';
import { Car, Zap, Utensils, Droplets, ShoppingBag, Monitor, Trash2, Plus, CheckCircle2, Circle, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MANUAL_CATEGORIES } from '../constants';
import { analyzeReceiptText } from '../services/ai';
import { useTranslation } from '../services/translation';

export const Tracker: React.FC = () => {
  const { profile } = useAppContext();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'scanner'>(
    profile?.trackerMode === '🤖 AI Automatic Tracker' ? 'ai' : 'manual'
  );
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-805 dark:text-gray-100">{t('co2_tracker_title')}</h1>
        <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('ai')} 
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'ai' 
                ? 'bg-white dark:bg-gray-750 shadow-sm text-eco-600 dark:text-teal-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t('ai_automatic')}
          </button>
          <button 
            onClick={() => setActiveTab('manual')} 
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'manual' 
                ? 'bg-white dark:bg-gray-750 shadow-sm text-eco-600 dark:text-teal-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t('manual')}
          </button>
          <button 
            onClick={() => setActiveTab('scanner')} 
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'scanner' 
                ? 'bg-white dark:bg-gray-750 shadow-sm text-eco-600 dark:text-teal-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t('ai_scanner')}
          </button>
        </div>
      </div>

      {activeTab === 'manual' && <ManualTracker />}
      {activeTab === 'ai' && <AIAutomaticTracker />}
      {activeTab === 'scanner' && <SmartScanner />}
    </div>
  );
};

const AIAutomaticTracker = () => {
  const { profile, missions, completeMission, isLoadingMissions } = useAppContext();
  const { t } = useTranslation();

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
      <div className="bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl mb-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-1">{t('ai_automatic')} Active</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Category: <strong>{profile?.aiCategory || 'General'}</strong> | Level: <strong>{profile?.aiLevel || 'Standard'}</strong>
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
          AI automatically generates daily missions and recommendations based on your profile. Completing them updates your scores live.
        </p>
      </div>

      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Today's Recommendations</h2>
      
      <div className="space-y-4">
        {isLoadingMissions ? (
          <div className="flex justify-center items-center py-10 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-500"></div>
          </div>
        ) : missions.length > 0 ? (
          missions.map(mission => (
            <div key={mission.id} className={`p-5 rounded-xl border transition-all ${mission.completed ? 'bg-gray-50/30 border-gray-200 opacity-75 dark:border-gray-750' : 'bg-white/70 dark:bg-gray-800/70 border-eco-200 dark:border-emerald-900 hover:border-eco-400 dark:hover:border-emerald-600 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold text-eco-600 dark:text-teal-400 uppercase tracking-wider mb-1 block">{mission.category}</span>
                  <h3 className={`font-semibold text-lg ${mission.completed ? 'text-gray-500 line-through dark:text-gray-450' : 'text-gray-800 dark:text-gray-100'}`}>{mission.title}</h3>
                </div>
                <button onClick={() => completeMission(mission.id)} disabled={mission.completed} className="text-eco-500 dark:text-teal-400 hover:text-eco-700 disabled:text-gray-300 transition-colors cursor-pointer">
                  {mission.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{mission.description}</p>
              <div className="flex gap-3 text-sm font-medium">
                <span className="bg-green-100 dark:bg-emerald-950/80 text-green-700 dark:text-emerald-300 px-3 py-1 rounded-lg">-{mission.expectedCo2Save}kg CO₂</span>
                <span className="bg-yellow-100 dark:bg-yellow-950/80 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-lg">+{mission.xpReward} XP</span>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg">{mission.difficulty}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">{t('no_missions')}</p>
        )}
      </div>
    </div>
  );
};

const ManualTracker = () => {
  const { addLog } = useAppContext();
  const { t, lang } = useTranslation();
  const [category, setCategory] = useState(MANUAL_CATEGORIES[0].name);
  const [detail, setDetail] = useState(MANUAL_CATEGORIES[0].options[0]);
  const [amount, setAmount] = useState('');

  const activeCatData = MANUAL_CATEGORIES.find(c => c.name === category);

  // Localization tables
  const categoryTranslations: Record<string, Record<string, string>> = {
    Transport: { English: 'Transport', Hindi: 'परिवहन', Marathi: 'वाहतूक', Spanish: 'Transporte', French: 'Transport' },
    Electricity: { English: 'Electricity', Hindi: 'बिजली', Marathi: 'वीज', Spanish: 'Electricidad', French: 'Électricité' },
    Food: { English: 'Food', Hindi: 'भोजन', Marathi: 'अन्न', Spanish: 'Comida', French: 'Alimentation' },
    Water: { English: 'Water', Hindi: 'पानी', Marathi: 'पाणी', Spanish: 'Agua', French: 'Eau' },
    Waste: { English: 'Waste', Hindi: 'कचरा', Marathi: 'कचरा', Spanish: 'Residuos', French: 'Déchets' },
    Shopping: { English: 'Shopping', Hindi: 'खरीदारी', Marathi: 'खरेदी', Spanish: 'Compras', French: 'Achats' },
    Digital: { English: 'Digital', Hindi: 'डिजिटल', Marathi: 'डिजिटल', Spanish: 'Digital', French: 'Numérique' }
  };

  const optionTranslations: Record<string, Record<string, string>> = {
    Walking: { English: 'Walking', Hindi: 'पैदल चलना', Marathi: 'चालणे', Spanish: 'Caminar', French: 'Marche' },
    Cycling: { English: 'Cycling', Hindi: 'साइकिल चलाना', Marathi: 'सायकल चालवणे', Spanish: 'Ciclismo', French: 'Vélo' },
    Bike: { English: 'Motorcycle/Bike', Hindi: 'मोटरसाइकिल', Marathi: 'मोटारसायकल', Spanish: 'Motocicleta', French: 'Moto' },
    EV: { English: 'Electric Vehicle (EV)', Hindi: 'इलेक्ट्रिक वाहन (EV)', Marathi: 'इलेक्ट्रिक वाहन (EV)', Spanish: 'Vehículo Eléctrico', French: 'Véhicule Électrique' },
    'Petrol Car': { English: 'Petrol Car', Hindi: 'पेट्रोल कार', Marathi: 'पेट्रोल कार', Spanish: 'Coche de Gasolina', French: 'Voiture Essence' },
    'Diesel Car': { English: 'Diesel Car', Hindi: 'डीजल कार', Marathi: 'डिझेल कार', Spanish: 'Coche Diésel', French: 'Voiture Diesel' },
    Metro: { English: 'Metro/Subway', Hindi: 'मेट्रो', Marathi: 'मेट्रो', Spanish: 'Metro', French: 'Métro' },
    Bus: { English: 'Bus', Hindi: 'बस', Marathi: 'बस', Spanish: 'Autobús', French: 'Bus' },
    Train: { English: 'Train', Hindi: 'ट्रेन', Marathi: 'रेल्वे', Spanish: 'Tren', French: 'Train' },
    Flight: { English: 'Flight', Hindi: 'हवाई यात्रा', Marathi: 'विमान प्रवास', Spanish: 'Vuelo', French: 'Vol' },
    Ship: { English: 'Ship/Ferry', Hindi: 'जहाज', Marathi: 'जहाज', Spanish: 'Barco', French: 'Bateau' },
    AC: { English: 'Air Conditioner', Hindi: 'एसी', Marathi: 'एसी', Spanish: 'Aire Acondicionado', French: 'Climatiseur' },
    Fan: { English: 'Fan', Hindi: 'पंखे', Marathi: 'पंखा', Spanish: 'Ventilador', French: 'Ventilateur' },
    TV: { English: 'TV', Hindi: 'टीवी', Marathi: 'टीव्ही', Spanish: 'Televisor', French: 'Télévision' },
    Fridge: { English: 'Refrigerator', Hindi: 'फ्रिज', Marathi: 'फ्रिज', Spanish: 'Refrigerador', French: 'Réfrigérateur' },
    Laptop: { English: 'Laptop', Hindi: 'लैपटॉप', Marathi: 'लॅपटॉप', Spanish: 'Computadora Portátil', French: 'Ordinateur Portable' },
    Desktop: { English: 'Desktop PC', Hindi: 'डेस्कटॉप कंप्यूटर', Marathi: 'डेस्कटॉप कॉम्प्युटर', Spanish: 'Computadora de Escritorio', French: 'Ordinateur Fixe' },
    LED: { English: 'LED Bulb', Hindi: 'एलईडी बल्ब', Marathi: 'एलईडी बल्ब', Spanish: 'Bombilla LED', French: 'Ampoule LED' },
    'Water Heater': { English: 'Water Heater', Hindi: 'गीजर/वाटर हीटर', Marathi: 'वॉटर हिटर', Spanish: 'Calentador de Agua', French: 'Chauffe-eau' },
    'Washing Machine': { English: 'Washing Machine', Hindi: 'वाशिंग मशीन', Marathi: 'वॉशिंग मशीन', Spanish: 'Lavadora', French: 'Lave-linge' },
    'Kitchen Appliances': { English: 'Kitchen Appliances', Hindi: 'रसोई के उपकरण', Marathi: 'स्वयंपाकघर उपकरणे', Spanish: 'Electrodomésticos de Cocina', French: 'Appareils de Cuisine' },
    Other: { English: 'Other', Hindi: 'अन्य', Marathi: 'इतर', Spanish: 'Otro', French: 'Autre' },
    Vegetarian: { English: 'Vegetarian Meal', Hindi: 'शाकाहारी भोजन', Marathi: 'शाकाहारी जेवण', Spanish: 'Comida Vegetariana', French: 'Repas Végétarien' },
    Vegan: { English: 'Vegan Meal', Hindi: 'वीगन भोजन', Marathi: 'शाकाहारी/व्हेगन जेवण', Spanish: 'Comida Vegana', French: 'Repas Végétalien' },
    Chicken: { English: 'Chicken Meal', Hindi: 'चिकन भोजन', Marathi: 'चिकन जेवण', Spanish: 'Plato de Pollo', French: 'Repas Poulet' },
    Fish: { English: 'Fish Meal', Hindi: 'मछली भोजन', Marathi: 'मासे जेवण', Spanish: 'Plato de Pescado', French: 'Repas Poisson' },
    Dairy: { English: 'Dairy Products', Hindi: 'डेयरी उत्पाद', Marathi: 'दुग्धजन्य पदार्थ', Spanish: 'Lácteos', French: 'Produits Laitiers' },
    'Fast Food': { English: 'Fast Food', Hindi: 'फास्ट फूड', Marathi: 'फास्ट फूड', Spanish: 'Comida Rápida', French: 'Fast-food' },
    'Processed Food': { English: 'Processed Food', Hindi: 'प्रसंस्कृत भोजन', Marathi: 'प्रक्रिया केलेले अन्न', Spanish: 'Alimentos Procesados', French: 'Aliments Transformés' },
    Custom: { English: 'Custom/Mixed', Hindi: 'कस्टम', Marathi: 'कस्टम', Spanish: 'Personalizado', French: 'Personnalisé' },
    Shower: { English: 'Shower Bath', Hindi: 'स्नान (शावर)', Marathi: 'आंघोळ', Spanish: 'Ducha', French: 'Douche' },
    Kitchen: { English: 'Kitchen Water', Hindi: 'रसोई का पानी', Marathi: 'स्वयंपाकघर पाणी', Spanish: 'Agua de Cocina', French: 'Eau de Cuisine' },
    Laundry: { English: 'Laundry Washing', Hindi: 'कपड़े धोना', Marathi: 'कपडे धुणे', Spanish: 'Lavandería', French: 'Lessive' },
    Garden: { English: 'Garden Watering', Hindi: 'बगीचे में सिंचाई', Marathi: 'बागकाम पाणी', Spanish: 'Riego de Jardín', French: 'Arrosage Jardin' },
    Cleaning: { English: 'House Cleaning', Hindi: 'घर की सफाई', Marathi: 'घर साफसफाई', Spanish: 'Limpieza', French: 'Nettoyage' },
    Drinking: { English: 'Drinking Water', Hindi: 'पीने का पानी', Marathi: 'पिण्याचे पाणी', Spanish: 'Agua Potable', French: 'Eau Potable' },
    Plastic: { English: 'Plastic Waste', Hindi: 'प्लास्टिक कचरा', Marathi: 'प्लास्टिक कचरा', Spanish: 'Residuos Plásticos', French: 'Déchets Plastiques' },
    Paper: { English: 'Paper/Cardboard', Hindi: 'कागज कचरा', Marathi: 'कागदी कचरा', Spanish: 'Residuos de Papel', French: 'Déchets Papier' },
    Glass: { English: 'Glass Waste', Hindi: 'कांच कचरा', Marathi: 'काचेचा कचरा', Spanish: 'Residuos de Vidrio', French: 'Déchets Verre' },
    Metal: { English: 'Metal Waste', Hindi: 'धातु कचरा', Marathi: 'धातूचा कचरा', Spanish: 'Residuos Metálicos', French: 'Déchets Métalliques' },
    Organic: { English: 'Organic/Food Waste', Hindi: 'जैविक/गीला कचरा', Marathi: 'ओला कचरा', Spanish: 'Residuos Orgánicos', French: 'Déchets Organiques' },
    'E-Waste': { English: 'Electronic Waste', Hindi: 'ई-कचरा', Marathi: 'ई-कचरा', Spanish: 'Residuos Electrónicos', French: 'Déchets Électroniques' },
    'Mixed Waste': { English: 'Mixed Trash', Hindi: 'मिश्रित कचरा', Marathi: 'मिश्र कचरा', Spanish: 'Basura Mixta', French: 'Déchets Ménagers' },
    Clothes: { English: 'Clothing/Fashion', Hindi: 'कपड़ों की खरीदारी', Marathi: 'कपड्यांची खरेदी', Spanish: 'Ropa', French: 'Vêtements' },
    Electronics: { English: 'Electronics/Gadgets', Hindi: 'इलेक्ट्रॉनिक्स', Marathi: 'इलेक्ट्रॉनिक्स उपकरणे', Spanish: 'Electrónicos', French: 'Électronique' },
    Furniture: { English: 'Furniture', Hindi: 'फर्नीचर', Marathi: 'फर्निचर', Spanish: 'Muebles', French: 'Meubles' },
    Groceries: { English: 'Groceries', Hindi: 'किराने का सामान', Marathi: 'किराणा सामान', Spanish: 'Comestibles', French: 'Courses' },
    'Online Orders': { English: 'Online Shipping Delivery', Hindi: 'ऑनलाइन डिलीवरी', Marathi: 'ऑनलाइन डिलिव्हरी', Spanish: 'Pedidos en Línea', French: 'Commandes en Ligne' },
    'Luxury Products': { English: 'Luxury Products', Hindi: 'विलासिता के सामान', Marathi: 'लक्झरी वस्तू', Spanish: 'Productos de Lujo', French: 'Produits de Luxe' },
    Streaming: { English: 'Video Streaming (HD/4K)', Hindi: 'वीडियो स्ट्रीमिंग', Marathi: 'व्हिडिओ स्ट्रीमिंग', Spanish: 'Transmisión de Video', French: 'Streaming Vidéo' },
    Gaming: { English: 'Online Gaming', Hindi: 'ऑनलाइन गेमिंग', Marathi: 'ऑनलाइन गेमिंग', Spanish: 'Videojuegos en Línea', French: 'Jeux en Ligne' },
    'AI Usage': { English: 'AI Queries (ChatGPT/Gemini)', Hindi: 'एआई प्रश्नोत्तर', Marathi: 'एआय क्वेरी', Spanish: 'Consultas de IA', French: 'Requêtes IA' },
    'Cloud Storage': { English: 'Cloud Storage Backup', Hindi: 'क्लाउड स्टोरेज', Marathi: 'क्लाउड स्टोरेज', Spanish: 'Almacenamiento en Nube', French: 'Stockage Cloud' },
    'Video Calls': { English: 'Video Calls/Meetings', Hindi: 'वीडियो कॉल', Marathi: 'व्हिडिओ कॉल', Spanish: 'Videollamadas', French: 'Appels Vidéo' },
    'Social Media': { English: 'Social Media Browsing', Hindi: 'सोशल मीडिया ब्राउज़िंग', Marathi: 'सोशल मीडिया वापर', Spanish: 'Redes Sociales', French: 'Réseaux Sociaux' }
  };

  const getCategoryLabel = (name: string): string => {
    return categoryTranslations[name]?.[lang] || name;
  };

  const getOptionLabel = (name: string): string => {
    return optionTranslations[name]?.[lang] || name;
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'Transport': return <Car size={18}/>;
      case 'Electricity': return <Zap size={18}/>;
      case 'Food': return <Utensils size={18}/>;
      case 'Water': return <Droplets size={18}/>;
      case 'Waste': return <Trash2 size={18}/>;
      case 'Shopping': return <ShoppingBag size={18}/>;
      case 'Digital': return <Monitor size={18}/>;
      default: return <Plus size={18}/>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    let co2 = 0; 
    let xp = 5; 
    const val = parseFloat(amount);
    if (category === 'Transport') {
      if (['Walking', 'Cycling', 'Bike'].includes(detail)) { 
        co2 = -0.5 * val; 
        xp = 20; 
      } else {
        co2 = val * 0.2; 
      }
    } else if (category === 'Electricity') { 
      co2 = val * 0.4; 
      xp = 10;
    } else if (category === 'Food') {
      if (['Vegetarian', 'Vegan'].includes(detail)) { 
        co2 = val * 0.5; 
        xp = 15; 
      } else {
        co2 = val * 3;
      }
    } else { 
      co2 = val * 1.5; 
      xp = 8;
    }

    addLog({ category, description: `${detail} (${val})`, co2Impact: parseFloat(co2.toFixed(2)), xpEarned: xp });
    setAmount('');
    alert(t('activity_logged'));
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {MANUAL_CATEGORIES.map(c => (
          <button 
            key={c.name} 
            onClick={() => { setCategory(c.name); setDetail(c.options[0]); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
              category === c.name 
                ? 'border-eco-500 dark:border-teal-500 bg-eco-50 dark:bg-emerald-950/50 text-eco-700 dark:text-teal-400 font-bold' 
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            {getIcon(c.name)} {getCategoryLabel(c.name)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('select_activity')}</label>
          <select 
            value={detail} 
            onChange={(e) => setDetail(e.target.value)} 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-eco-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none cursor-pointer"
          >
            {activeCatData?.options.map(o => (
              <option key={o} value={o} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {getOptionLabel(o)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('amount_duration')}</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter value (e.g., km, hours, items)" 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-eco-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none" 
            required 
            min="0.1" 
            step="0.1" 
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { 
                e.preventDefault(); 
                handleSubmit(e as any); 
              } 
            }} 
          />
        </div>
        <button type="submit" className="w-full bg-eco-600 dark:bg-emerald-600 hover:bg-eco-700 dark:hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md">
          <Plus size={20} /> {t('log_activity')}
        </button>
      </form>
    </div>
  );
};

const SmartScanner = () => {
  const { addLog } = useAppContext();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!text) return;
    setIsScanning(true);
    const analysis = await analyzeReceiptText(text);
    setResult(analysis);
    setIsScanning(false);
  };

  const handleSave = () => {
    if (result) {
      addLog({ 
        category: 'Shopping/Food', 
        description: `AI Scanned: ${result.items.join(', ')}`, 
        co2Impact: result.totalCo2, 
        xpEarned: 15 
      });
      setResult(null); 
      setText(''); 
      alert(t('scanned_items'));
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-md">
      <div className="bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl mb-6 flex gap-3">
        <Camera className="text-blue-500 shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>AI Smart Scanner:</strong> {t('ai_scanner_tip')}
        </p>
      </div>

      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleScan();
          }
        }}
        placeholder="Describe your bill/receipt here... (Press Enter to Analyze)" 
        className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-eco-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none min-h-[120px] mb-4 transition-shadow shadow-sm" 
      />

      <button 
        onClick={handleScan} 
        disabled={isScanning || !text} 
        className="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-650 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg w-full md:w-auto cursor-pointer"
      >
        {isScanning ? t('analyzing_ai') : t('analyze_text')}
      </button>

      {result && (
        <div className="mt-6 p-5 border border-eco-200 dark:border-emerald-800 bg-eco-50/40 dark:bg-emerald-950/20 rounded-xl animate-fade-in">
          <h3 className="font-bold text-eco-800 dark:text-teal-400 mb-2">AI Analysis Result</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-355 mb-3">
            {result.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Estimated Impact: <span className="text-red-500">{result.totalCo2} kg CO₂e</span></p>
          <p className="text-sm text-eco-700 dark:text-teal-300 italic mb-4">💡 AI Advice: {result.advice}</p>
          <button onClick={handleSave} className="bg-eco-600 dark:bg-emerald-600 hover:bg-eco-700 dark:hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-sm cursor-pointer">Log to Tracker</button>
        </div>
      )}
    </div>
  );
};
