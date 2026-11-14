import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode =
  | 'en' // English
  | 'hi' // Hindi (हिंदी)
  | 'te' // Telugu (తెలుగు)
  | 'ta' // Tamil (தமிழ்)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'bn' // Bengali (বাংলা)
  | 'mr' // Marathi (मराठी)
  | 'es' // Spanish (Español)
  | 'fr' // French (Français)
  | 'de' // German (Deutsch)
  | 'ja' // Japanese (日本語)
  | 'ko' // Korean (한국어)
  | 'ar'; // Arabic (العربية)

export interface LanguageMeta {
  code: LanguageCode;
  label: string;
  nativeName: string;
  region: 'Indian' | 'Global';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  // Indian Languages (First Priority)
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', region: 'Indian' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', region: 'Indian' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', region: 'Indian' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Indian' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം', region: 'Indian' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', region: 'Indian' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', region: 'Indian' },
  // World Languages
  { code: 'en', label: 'English', nativeName: 'English', region: 'Global' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', region: 'Global' },
  { code: 'fr', label: 'French', nativeName: 'Français', region: 'Global' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', region: 'Global' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', region: 'Global' },
  { code: 'ko', label: 'Korean', nativeName: '한국어', region: 'Global' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', region: 'Global' }
];

export const TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  // Proverbs & Cinematic Mottos
  'proverb.tagline': {
    en: 'Where Stories Meet Talent',
    hi: 'जहाँ कहानियाँ प्रतिभा से मिलती हैं',
    te: 'కథలు ప్రతిభను కలిసే వేదిక',
    ta: 'கதைகள் திறமையை சந்திக்கும் இடம்',
    kn: 'ಕಥೆಗಳು ಪ್ರತಿಭೆಯನ್ನು ಭೇಟಿಯಾಗುವ ಸ್ಥಳ',
    ml: 'കഥകൾ കഴിവുകളെ കണ്ടുമുട്ടുന്ന ഇടം',
    bn: 'যেখানে গল্প প্রতিভার সাথে মিলিত হয়',
    mr: 'जिथे कथा प्रतिभेला भेटतात',
    es: 'Donde las historias encuentran al talento',
    fr: 'Où les histoires rencontrent les talents',
    de: 'Wo Geschichten auf Talente treffen',
    ja: '物語が才能と出会う場所',
    ko: '이야기가 인재를 만나는 곳',
    ar: 'حيث تلتقي القصص بالمواهب'
  },
  'proverb.cinema': {
    en: 'Cinema is the ultimate art that weaves dreams into reality.',
    hi: 'सिनेमा वह अंतिम कला है जो सपनों को हकीकत में बुनती है।',
    te: 'సినిమా అనేది కలలను నిజంగా మార్చే అత్యున్నత కళ.',
    ta: 'சினிமா என்பது கனவுகளை நனவாக்கும் உன்னதமான கலை.',
    kn: 'ಸಿನಿಮಾ ಎನ್ನುವುದು ಕನಸುಗಳನ್ನು ನನಸಾಗಿಸುವ ಅಂತಿಮ ಕಲೆ.',
    ml: 'സ്വപ്നങ്ങളെ യാഥാർത്ഥ്യമാക്കുന്ന ആത്യന്തിക കലയാണ് സിനിമ.',
    bn: 'সিনেমা হলো চূড়ান্ত শিল্প যা স্বপ্নকে বাস্তবে রূপ দেয়।',
    mr: 'सिनेमा ही स्वप्नांना प्रत्यक्षात आणणारी अंतिम कला आहे.',
    es: 'El cine es el arte supremo que teje los sueños en realidad.',
    fr: 'Le cinéma est l’art ultime qui tisse les rêves en réalité.',
    de: 'Kino ist die ultimative Kunst, die Träume in Realität verwandelt.',
    ja: '映画は夢を現実に織り成す究極の芸術です。',
    ko: '영화는 꿈을 현실로 엮어내는 최고의 예술입니다.',
    ar: 'السينما هي الفن الأسمى الذي ينسج الأحلام حقيقة.'
  },
  'proverb.light_shadow': {
    en: 'Stories written in light, shadows sculpted in sound.',
    hi: 'रोशनी में लिखी कहानियाँ, आवाज़ में गढ़ी गई परछाइयाँ।',
    te: 'వెలుగుతో రాసిన కథలు, శబ్దంతో చెక్కిన నీడలు.',
    ta: 'ஒளியால் எழுதப்பட்ட கதைகள், ஒலியால் செதுக்கப்பட்ட நிழல்கள்.',
    kn: 'ಬೆಳಕಿನಲ್ಲಿ ಬರೆದ ಕಥೆಗಳು, ಧ್ವನಿಯಲ್ಲಿ ಕೆತ್ತಿದ ನೆರಳುಗಳು.',
    ml: 'വെളിച്ചത്തിൽ എഴുതിയ കഥകൾ, ശബ്ദത്തിൽ കൊത്തിയെടുത്ത നിഴലുകൾ.',
    bn: 'আলোয় লেখা গল্প, শব্দে খোদাই করা ছায়া।',
    mr: 'प्रकाशात लिहिलेल्या कथा, आवाजात कोरलेल्या सावल्या.',
    es: 'Historias escritas en luz, sombras esculpidas en sonido.',
    fr: 'Histoires écrites dans la lumière, ombres sculptées dans le son.',
    de: 'Geschichten in Licht geschrieben, Schatten in Klang gemeißelt.',
    ja: '光で描かれた物語、音で刻まれた影。',
    ko: '빛으로 쓴 이야기, 소리로 빚은 그림자.',
    ar: 'قصص مكتوبة بالنور، وظلال منحوتة بالصوت.'
  },
  'proverb.subtext': {
    en: 'CineVantaara is the international cinema collaboration ecosystem connecting visionary directors, producers, screenwriters, actors, and verified craftspeople worldwide.',
    hi: 'सिनेवंतारा अंतरराष्ट्रीय सिनेमा सहयोग मंच है जो दुनिया भर के दूरदर्शी निर्देशकों, निर्माताओं, पटकथा लेखकों, अभिनेताओं और सत्यापित तकनीशियनों को जोड़ता है।',
    te: 'సినీవంటారా అనేది ప్రపంచవ్యాప్తంగా ఉన్న దర్శకులు, నిర్మాతలు, రచయితలు, నటులు మరియు సాంకేతిక నిపుణులను కలిపే అంతర్జాతీయ సినీ సహకార వేదిక.',
    ta: 'சினிவண்டாரா என்பது உலகளாவிய திரைப்பட இயக்குநர்கள், தயாரிப்பாளர்கள், எழுத்தாளர்கள், நடிகர்கள் மற்றும் கைவினைஞர்களை இணைக்கும் சர்வதேச தளமாகும்.',
    kn: 'ಸಿನಿವಂತಾರಾ ಎಂಬುದು ಜಾಗತಿಕ ನಿರ್ದೇಶಕರು, ನಿರ್ಮಾಪಕರು, ಬರಹಗಾರರು, ನಟರು ಮತ್ತು ತಂತ್ರಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸುವ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಿನಿಮಾ ವೇದಿಕೆಯಾಗಿದೆ.',
    ml: 'സംവിധായകർ, നിർമ്മാതാക്കൾ, എഴുത്തുകാർ, അഭിനേതാക്കൾ, സാങ്കേതിക വിദഗ്ദ്ധർ എന്നിവരെ ബന്ധിപ്പിക്കുന്ന അന്താരാഷ്ട്ര സിനിമാ സഹകരണ പ്ലാറ്റ്‌ഫോമാണ് സിനിവാന്താര.',
    bn: 'সিনেভান্তারা হলো আন্তর্জাতিক চলচ্চিত্র প্ল্যাটফর্ম যা বিশ্বব্যাপী পরিচালক, প্রযোজক, লেখক, অভিনেতা ও কলাকুশলীদের সংযুক্ত করে।',
    mr: 'सिनेवंतारा हे आंतरराष्ट्रीय चित्रपट सहकार्य व्यासपीठ आहे जे जगभरातील दिग्दर्शक, निर्माते, लेखक, अभिनेते आणि तंत्रज्ञांना जोडते.',
    es: 'CineVantaara es el ecosistema internacional de colaboración cinematográfica que conecta directores, productores, guionistas y artesanos de todo el mundo.',
    fr: 'CineVantaara est l’écosystème international de collaboration cinématographique reliant réalisateurs, producteurs, scénaristes et artisans du monde entier.',
    de: 'CineVantaara ist das internationale Kino-Kooperationsökosystem, das Regisseure, Produzenten, Autoren und Schauspieler weltweit vernetzt.',
    ja: 'CineVantaaraは、世界の映画監督、プロデューサー、脚本家、俳優、技術スタッフを結ぶ国際的な映画コラボレーションエコシステムです。',
    ko: 'CineVantaara는 전 세계의 비전 있는 감독, 프로듀서, 각본가, 배우, 기술 스태프를 연결하는 글로벌 영화 협업 생태계입니다.',
    ar: 'سينيفانتارا هي منظومة التعاون السينمائي الدولي التي تربط المخرجين والمنتجين والكتاب والممثلين في جميع أنحاء العالم.'
  },

  // Role Welcome Mottos
  'welcome.DIRECTOR': {
    en: 'COMMAND THE SCENE, DIRECTOR. Your vision, your crew. The next cinematic masterpiece begins on your call.',
    hi: 'दृश्य का संचालन करें, निर्देशक। आपकी दृष्टि, आपकी टीम। अगला सिनेमाई मास्टरपीस आपके आदेश से शुरू होता है।',
    te: 'దృశ్యాన్ని నడిపించండి, దర్శకుడా! మీ దార్శనికత, మీ బృందం. మీ ఒక్క పిలుపుతో తదుపరి అద్భుత కళాఖండం మొదలవుతుంది.',
    ta: 'காட்சியை இயக்குங்கள், இயக்குநரே! உங்கள் பார்வை, உங்கள் குழு. அடுத்த காவியப் படைப்பு உங்கள் குரலில் தொடங்குகிறது.',
    kn: 'ದೃಶ್ಯವನ್ನು ಮುನ್ನಡೆಸಿ, ನಿರ್ದೇಶಕರೇ! ನಿಮ್ಮ ದೃಷ್ಟಿ, ನಿಮ್ಮ ತಂಡ. ಮುಂದಿನ ಮಹಾನ್ ಸಿನೆಮಾ ನಿಮ್ಮ ಆದೇಶದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ.',
    ml: 'രംഗം നിയന്ത്രിക്കുക, സംവിധായകാ! നിങ്ങളുടെ ദർശനം, നിങ്ങളുടെ സംഘം. അടുത്ത മാസ്റ്റർപീസ് നിങ്ങളുടെ വിളിയോടെ ആരംഭിക്കുന്നു.',
    bn: 'দৃশ্য পরিচালনা করুন, পরিচালক। আপনার দৃষ্টি, আপনার দল। আপনার ডাকেই শুরু হবে পরবর্তী মাস্টারপিস।',
    mr: 'दृश्याचे नेतृत्व करा, दिग्दर्शक! तुमची दृष्टी, तुमची टीम. तुमची एक हाक आणि पुढील उत्कृष्ट चित्रपट सुरू होतो.',
    es: '¡DIRIGE LA ESCENA, DIRECTOR! Tu visión, tu equipo. La próxima obra maestra comienza a tu señal.',
    fr: 'COMMANDEZ LA SCÈNE, RÉALISATEUR. Votre vision, votre équipe. Le prochain chef-d’œuvre commence.',
    de: 'ÜBERNEHMEN SIE DIE REGIE. Ihre Vision, Ihre Crew. Das nächste Meisterwerk beginnt mit Ihrem Ruf.',
    ja: 'シーンを指揮せよ、映画監督。あなたのビジョン、あなたのクルー。次の名作はあなたの声で始まる。',
    ko: '장면을 지휘하십시오, 감독님. 당신의 비전과 크루. 다음 명작은 당신의 큐 사인으로 시작됩니다.',
    ar: 'قُد المشهد، أيها المخرج! رؤيتك وفريقك. التحفة السينمائية القادمة تبدأ بإشارتك.'
  },
  'welcome.PRODUCER': {
    en: 'GREENLIGHT THE FUTURE, PRODUCER. Assemble world-class production teams, post opportunities, and finance legendary cinema.',
    hi: 'भविष्य को हरी झंडी दें, निर्माता। विश्वस्तरीय उत्पादन टीमों को इकट्ठा करें और सिनेमा को वित्तपोषित करें।',
    te: 'భవిష్యత్తుకు గ్రీన్ సిగ్నల్ ఇవ్వండి, నిర్మాత! ప్రపంచ స్థాయి బృందాలను సమకూర్చండి మరియు గొప్ప సినిమాలను నిర్మించండి.',
    ta: 'எதிர்காலத்திற்கு பச்சைக் கொடி காட்டுங்கள், தயாரிப்பாளரே! உலகத்தரம் வாய்ந்த தயாரிப்புக் குழுக்களை உருவாக்குங்கள்.',
    kn: 'ಭವಿಷ್ಯಕ್ಕೆ ಹಸಿರು ನಿಶಾನೆ ತೋರಿ, ನಿರ್ಮಾಪಕರೇ! ವಿಶ್ವದರ್ಜೆಯ ನಿರ್ಮಾಣ ತಂಡಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ.',
    ml: 'ഭാവിക്ക് പച്ചക്കൊടി കാട്ടുക, നിർമ്മാതാവേ! ലോകോത്തര പ്രൊഡക്ഷൻ ടീമുകളെ അണിനിരത്തുക.',
    bn: 'ভবিষ্যতকে সবুজ সংকেত দিন, প্রযোজক। বিশ্বমানের দল গঠন করুন এবং কিংবদন্তি সিনেমা তৈরি করুন।',
    mr: 'भविष्याला हिरवा कंदील दाखवा, निर्माते! जागतिक दर्जाच्या टीम्स एकत्र करा आणि भव्य चित्रपट घडवा.',
    es: '¡DA LUZ VERDE AL FUTURO, PRODUCTOR! Reúne equipos de producción de clase mundial.',
    fr: 'DONNEZ LE FEU VERT, PRODUCTEUR. Rassemblez des équipes de renommée mondiale.',
    de: 'GEBEN SIE GRÜNES LICHT, PRODUZENT. Bauen Sie Weltklasse-Produktionsteams auf.',
    ja: '未来へゴーサインを出せ、プロデューサー。世界最高峰の制作チームを編成しよう。',
    ko: '미래에 그린라이트를 켜십시오, 프로듀서. 세계 최고 수준의 제작팀을 결성하십시오.',
    ar: 'امنح الضوء الأخضر للمستقبل، أيها المنتج! اجمع فرق إنتاج عالمية المستوى.'
  },
  'welcome.WRITER': {
    en: 'WRITE THE LEGEND, SCREENWRITER. From typewriter ink to silver screen. Connect with visionary directors and studios.',
    hi: 'किंवदंती लिखें, पटकथा लेखक। स्याही से रूपहले पर्दे तक। दूरदर्शी निर्देशकों और स्टूडियो से जुड़ें।',
    te: 'చరిత్రను లిఖించండి, రచయితా! సిరా చుక్కల నుండి వెండితెర వరకు. గొప్ప దర్శకులతో భాగస్వామ్యం అవ్వండి.',
    ta: 'வரலாற்றை எழுதுங்கள், கதாசிரியரே! மையிலிருந்து வெள்ளித்திரை வரை. சிறந்த இயக்குநர்களுடன் இணையுங்கள்.',
    kn: 'ಇತಿಹಾಸವನ್ನು ಬರೆಯಿರಿ, ಚಿತ್ರಕಥೆಗಾರರೇ! ಶಾಯಿಯಿಂದ ಬೆಳ್ಳಿಪರದೆಯವರೆಗೆ. ದಾರ್ಶನಿಕ ನಿರ್ದೇಶಕರೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ.',
    ml: 'ചരിത്രം രചിക്കുക, തിരക്കഥാകൃത്തേ! മഷിത്തുള്ളികളിൽ നിന്ന് വെള്ളിത്തിരയിലേക്ക്.',
    bn: 'ইতিহাস রচনা করুন, চিত্রনাট্যকার। কালির দাগ থেকে রূপালী পর্দা পর্যন্ত।',
    mr: 'इतिहास लिहा, पटकथा लेखक! लेखणीच्या शाईपासून रूपेरी पडद्यापर्यंत. दिग्गज दिग्दर्शकांशी जोडा.',
    es: '¡ESCRIBE LA LEYENDA, GUIONISTA! De la tinta a la gran pantalla.',
    fr: 'ÉCRIVEZ LA LÉGENDE, SCÉNARISTE. De l’encre au grand écran.',
    de: 'SCHREIBEN SIE DIE LEGENDE, DREHBUCHAUTOR. Von Tinte bis zur Leinwand.',
    ja: '伝説を紡げ、脚本家。インクから銀幕へ。',
    ko: '전설을 집필하십시오, 각본가님. 타자기의 잉크에서 은막으로.',
    ar: 'اكتب الأسطورة، أيها السيناريست! من حبر الآلة الكاتبة إلى الشاشة الفضية.'
  },
  'welcome.ACTOR': {
    en: 'STEP INTO THE SPOTLIGHT, ARTIST. Discover auditions, collaborate with acclaimed directors, and captivate audiences.',
    hi: 'स्पॉटलाइट में कदम रखें, कलाकार। ऑडिशन खोजें और दुनिया भर के दर्शकों को मंत्रमुग्ध करें।',
    te: 'వెలుగుల వేదికపైకి అడుగుపెట్టండి, నటుడా! ఆడిషన్స్ కనుగొని ప్రేక్షకుల మనసులను గెలవండి.',
    ta: 'வெளிச்சத்திற்கு வாருங்கள், கலைஞரே! ஆடிஷன்களைக் கண்டறிந்து உலகையே கவர்ந்திழுங்கள்.',
    kn: 'ಬೆಳಕಿನ ವೇದಿಕೆಗೆ ಬನ್ನಿ, ಕಲಾವಿದರೇ! ಆಡಿಷನ್‌ಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ ಮತ್ತು ಪ್ರೇಕ್ಷಕರನ್ನು ಆಕರ್ಷಿಸಿ.',
    ml: 'വെളിച്ചത്തിലേക്ക് ചുവടുവെക്കുക, അഭിനേതാവേ! ഓഡിഷനുകൾ കണ്ടെത്തി പ്രേക്ഷകരെ വിസ്മയിപ്പിക്കുക.',
    bn: 'স্পটলাইটে আসুন, শিল্পী। অডিশন আবিষ্কার করুন এবং দর্শকদের মুগ্ধ করুন।',
    mr: 'स्पॉटलाइटमध्ये पाऊल ठेवा, कलाकार! ऑडिशन्स शोधा आणि प्रेक्षकांना मंत्रमुग्ध करा.',
    es: '¡ENTRA EN EL ESCENARIO, ACTOR! Descubre audiciones y cautiva al público.',
    fr: 'ENTREZ DANS LA LUMIÈRE, ARTISTE. Découvrez des auditions et captivez.',
    de: 'TRETEN SIE INS RAMPENLICHT, SCHAUSPIELER. Entdecken Sie Castings.',
    ja: 'スポットライトへ進め、俳優よ。オーディションを発見し、観客を魅了せよ。',
    ko: '스포트라이트 속으로 걸어 나오십시오, 배우님. 오디션을 찾고 관객을 사로잡으십시오.',
    ar: 'ادخل تحت الأضواء، أيها الفنان! اكتشف تجارب الأداء واجذب الجماهير.'
  },
  'welcome.CINEMATOGRAPHER': {
    en: 'FRAME THE EMOTION, CINEMATOGRAPHER. Paint with light and shadow. Anamorphic glass, 70mm dreams, and moving camera art.',
    hi: 'भावनाओं को फ्रेम करें, छायाकार। रोशनी और छाया से पेंट करें। एनामॉर्फिक लेंस और 70mm के सपने।',
    te: 'భావోద్వేగాలను ఫ్రేమ్ చేయండి, సినిమాటోగ్రాఫర్! కాంతి మరియు నీడలతో అద్భుత దృశ్యాలను సృష్టించండి.',
    ta: 'உணர்வுகளை படம்பிடியுங்கள், ஒளிப்பதிவாளரே! ஒளியும் நிழலும் கொண்டு ஓவியம் தீட்டுங்கள்.',
    kn: 'ಭಾವನೆಗಳನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ, ಛಾಯಾಗ್ರಾಹಕರೇ! ಬೆಳಕು ಮತ್ತು ನೆರಳುಗಳಿಂದ ದೃಶ್ಯಕಾವ್ಯ ರಚಿಸಿ.',
    ml: 'വികാരങ്ങളെ ഫ്രെയിം ചെയ്യുക, ഛായാഗ്രാഹകാ! വെളിച്ചവും നിഴലും കൊണ്ട് വിസ്മയം തീർക്കുക.',
    bn: 'অনুভূতি ফ্রেম করুন, চিত্রগ্রাহক। আলো এবং ছায়া দিয়ে আঁকুন স্বপ্ন।',
    mr: 'भावनांना फ्रेम करा, छायाचित्रकार! प्रकाश आणि सावलीने अप्रतिम दृश्ये घडवा.',
    es: '¡ENCUADRA LA EMOCIÓN, CINEMATÓGRAFO! Pinta con luz y sombra.',
    fr: 'CADREZ L’ÉMOTION, DIRECTEUR PHOTO. Peignez avec la lumière et l’ombre.',
    de: 'FANGEN SIE DIE EMOTION EIN, KAMERAMANN. Malen Sie mit Licht und Schatten.',
    ja: '感情をフレームに収めよ、撮影監督。光と影で描く映画芸術。',
    ko: '감정을 프레임에 담으십시오, 촬영감독님. 빛과 그림자로 그리는 예술.',
    ar: 'أطّر المشاعر، أيها المصور السينمائي! ارسم بالنور والظلال.'
  },

  // Navigation & Core Options
  'nav.menu': {
    en: 'Studio Menu',
    hi: 'स्टूडियो मेनू',
    te: 'స్టూడియో మెనూ',
    ta: 'ஸ்டுடியோ மெனு',
    kn: 'ಸ್ಟುಡಿಯೋ ಮೆನು',
    ml: 'സ്റ്റുഡിയോ മെനു',
    bn: 'স্টুডিও মেনু',
    mr: 'स्टुडिओ मेनू',
    es: 'Menú del Estudio',
    fr: 'Menu du Studio',
    de: 'Studio-Menü',
    ja: 'スタジオメニュー',
    ko: '스튜디오 메뉴',
    ar: 'قائمة الاستوديو'
  },
  'nav.dashboard': {
    en: 'Studio Dashboard',
    hi: 'स्टूडियो डैशबोर्ड',
    te: 'స్టూడియో డ్యాష్‌బోర్డ్',
    ta: 'ஸ்டுடியோ டாஷ்போர்டு',
    kn: 'ಸ್ಟುಡಿಯೋ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    ml: 'സ്റ്റുഡിയോ ഡാഷ്‌ബോർഡ്',
    bn: 'স্টুডিও ড্যাশবোর্ড',
    mr: 'स्टुडिओ डॅशबोर्ड',
    es: 'Panel del Estudio',
    fr: 'Tableau de bord',
    de: 'Studio-Übersicht',
    ja: 'スタジオダッシュボード',
    ko: '스튜디오 대시보드',
    ar: 'لوحة التحكم'
  },
  'nav.collaborations': {
    en: 'Film Collaborations',
    hi: 'सिनेमा सहयोग',
    te: 'సినిమా సహకారాలు',
    ta: 'திரைப்பட கூட்டுமுயற்சிகள்',
    kn: 'ಸಿನಿಮಾ ಸಹಯೋಗಗಳು',
    ml: 'സിനിമാ സഹകരണങ്ങൾ',
    bn: 'চলচ্চিত্র সহযোগিতা',
    mr: 'चित्रपट सहकार्य',
    es: 'Colaboraciones de Cine',
    fr: 'Collaborations Cinéma',
    de: 'Film-Kollaborationen',
    ja: '映画コラボレーション',
    ko: '영화 협업',
    ar: 'التعاون السينمائي'
  },
  'nav.discover': {
    en: 'Discover Verified Talent',
    hi: 'सत्यापित प्रतिभा खोजें',
    te: 'ధృవీకరించబడిన ప్రతిభను కనుగొనండి',
    ta: 'சரிபார்க்கப்பட்ட கலைஞர்களைக் கண்டறியவும்',
    kn: 'ಪರಿಶೀಲಿಸಿದ ಪ್ರತಿಭೆಯನ್ನು ಅನ್ವೇಷಿಸಿ',
    ml: 'പരിശോധിച്ച കഴിവുകൾ കണ്ടെത്തുക',
    bn: 'যাচাইকৃত প্রতিভা খুঁজুন',
    mr: 'सत्यापित प्रतिभा शोधा',
    es: 'Descubrir Talento Verificado',
    fr: 'Découvrir les Talents Vérifiés',
    de: 'Verifizierte Talente entdecken',
    ja: '認証済みの映画人材を発見',
    ko: '검증된 영화 인재 발굴',
    ar: 'اكتشف المواهب المعتمدة'
  },
  'nav.opportunities': {
    en: 'Production Opportunities',
    hi: 'प्रोडक्शन अवसर',
    te: 'నిర్మాణ అవకాశాలు',
    ta: 'தயாரிப்பு வாய்ப்புகள்',
    kn: 'ನಿರ್ಮಾಣ ಅವಕಾಶಗಳು',
    ml: 'പ്രൊഡക്ഷൻ അവസരങ്ങൾ',
    bn: 'প্রযোজনা সুযোগ',
    mr: 'प्रॉडक्शन संधी',
    es: 'Oportunidades de Producción',
    fr: 'Opportunités de Production',
    de: 'Produktions-Chancen',
    ja: '制作案件・オーディション',
    ko: '제작 기회 및 공모',
    ar: 'فرص الإنتاج السينمائي'
  },
  'nav.aiMatch': {
    en: 'Multi-Format AI Work Scorer',
    hi: 'मल्टी-फॉर्मेट एआई वर्क स्कोरर',
    te: 'మల్టీ-ఫార్మాట్ AI వర్క్ స్కోరర్',
    ta: 'மல்டி-ஃபார்மேட் AI பணி மதிப்பீட்டாளர்',
    kn: 'ಬಹು-ಸ್ವರೂಪದ AI ವರ್ಕ್ ಸ್ಕೋರರ್',
    ml: 'മൾട്ടി-ഫോർമാറ്റ് AI വർക്ക് സ്കോറർ',
    bn: 'মাল্টি-ফরম্যাট এআই স্কোরার',
    mr: 'मल्टी-फॉर्मेट एआय वर्क स्कोअरर',
    es: 'Evaluador de Trabajo IA Multi-Formato',
    fr: 'Scoreur de Travail IA Multi-Format',
    de: 'Multi-Format KI-Werkbewerter',
    ja: 'マルチフォーマットAI作品評価',
    ko: '멀티 포맷 AI 작품 평가기',
    ar: 'مُقيّم الأعمال متعدد الصيغ بالذكاء الاصطناعي'
  },
  'nav.aiVideo': {
    en: 'AI Video & Deepfake Detector',
    hi: 'एआई वीडियो और डीपफेक डिटेक्टर',
    te: 'AI వీడియో & డీప్‌ఫేక్ డిటెక్టర్',
    ta: 'AI வீடியோ & டீப்ஃபேக் கண்டறிதல்',
    kn: 'AI ವೀಡಿಯೊ & ಡೀಪ್‌ಫೇಕ್ ಪತ್ತೆಕಾರಕ',
    ml: 'AI വീഡിയോ & ഡീപ്ഫേക്ക് ഡിറ്റക്ടർ',
    bn: 'এআই ভিডিও ও ডিপফেক সনাক্তকারী',
    mr: 'एआय व्हिडिओ आणि डीपफेक डिटेक्टर',
    es: 'Detector de Video Sintético y Deepfake IA',
    fr: 'Détecteur de Vidéo IA & Deepfake',
    de: 'KI-Video- & Deepfake-Detektor',
    ja: 'AI動画＆ディープフェイク検出器',
    ko: 'AI 비디오 및 딥페이크 탐지기',
    ar: 'كاشف الفيديو والتزييف العميق بالذكاء الاصطناعي'
  },
  'nav.messages': {
    en: 'Encrypted Creator Chat',
    hi: 'एन्क्रिप्टेड क्रिएटर चैट',
    te: 'ఎన్‌క్రిప్టెడ్ క్రియేటర్ చాట్',
    ta: 'என்க்ரிப்ட் செய்யப்பட்ட கலைஞர் உரையாடல்',
    kn: 'ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾದ ಚಾಟ್',
    ml: 'എൻക്രിപ്റ്റ് ചെയ്ത ചാറ്റ്',
    bn: 'এনক্রিপ্ট করা চ্যাট',
    mr: 'सुरक्षित निर्माता चॅट',
    es: 'Chat Encriptado de Creadores',
    fr: 'Chat Chiffré des Créateurs',
    de: 'Verschlüsselter Creator-Chat',
    ja: '暗号化クリエイターチャット',
    ko: '암호화된 크리에이터 채팅',
    ar: 'المحادثة المشفرة لصناع الأفلام'
  },
  'nav.citadel': {
    en: 'Platform Citadel (Admin)',
    hi: 'प्लेटफॉर्म सिटाडेल (व्यवस्थापक)',
    te: 'ప్లాట్‌ఫారమ్ కోట (అడ్మిన్)',
    ta: 'மேடை கோட்டை (நிர்வாகம்)',
    kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಕೋಟೆ (ಅಡ್ಮಿನ್)',
    ml: 'സിറ്റാഡൽ (അഡ്മിൻ)',
    bn: 'প্ল্যাটফর্ম দুর্গ (অ্যাডমিন)',
    mr: 'प्लॅटफॉर्म सिटाडेल (प्रशासक)',
    es: 'Ciudadela de la Plataforma (Admin)',
    fr: 'Citadelle de la Plateforme (Admin)',
    de: 'Plattform-Zitadelle (Admin)',
    ja: 'プラットフォームシタデル（管理者）',
    ko: '플랫폼 시타델 (관리자)',
    ar: 'قلعة المنصة (المشرف)'
  },
  'nav.profile': {
    en: 'Profile & Headshot Settings',
    hi: 'प्रोफ़ाइल और हेडशॉट सेटिंग्स',
    te: 'ప్రొఫైల్ & హెడ్‌షాట్ సెట్టింగ్‌లు',
    ta: 'சுயவிவரம் மற்றும் புகைப்பட அமைப்புகள்',
    kn: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಫೋಟೋ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    ml: 'പ്രൊഫൈൽ & ഹെഡ്ഷോട്ട് ക്രമീകരണങ്ങൾ',
    bn: 'প্রোফাইল ও ছবি সেটিংস',
    mr: 'प्रोफाइल आणि छायाचित्र सेटिंग्ज',
    es: 'Ajustes de Perfil y Foto',
    fr: 'Profil & Photo',
    de: 'Profil & Foto-Einstellungen',
    ja: 'プロフィールと写真設定',
    ko: '프로필 및 헤드샷 설정',
    ar: 'إعدادات الملف الشخصي والصورة'
  },
  'nav.signIn': {
    en: 'Filmmaker Sign In',
    hi: 'फिल्म निर्माता साइन इन',
    te: 'సినీ దర్శకులు / కళాకారుల సైన్ ఇన్',
    ta: 'திரைப்படக் கலைஞர் உள்நுழைவு',
    kn: 'ಚಲನಚಿತ್ರ ತಯಾರಕರ ಸೈನ್ ಇನ್',
    ml: 'ചലച്ചിത്ര പ്രവർത്തക സൈൻ ഇൻ',
    bn: 'চলচ্চিত্র নির্মাতা সাইন ইন',
    mr: 'चित्रपट निर्माते साइन इन',
    es: 'Iniciar Sesión',
    fr: 'Connexion Cinéaste',
    de: 'Filmemacher-Anmeldung',
    ja: '映画制作者ログイン',
    ko: '영화인 로그인',
    ar: 'تسجيل دخول صناع الأفلام'
  },
  'nav.register': {
    en: 'Join Network (Registration)',
    hi: 'नेटवर्क में शामिल हों (पंजीकरण)',
    te: 'నెట్‌వర్క్‌లో చేరండి (రిజిస్ట్రేషన్)',
    ta: 'இணையுங்கள் (பதிவு)',
    kn: 'ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರಿ (ನೋಂದಣಿ)',
    ml: 'നെറ്റ്‌വർക്കിൽ ചേരുക (രജിസ്ട്രേഷൻ)',
    bn: 'নেটওয়ার্কে যোগ দিন (নিবন্ধন)',
    mr: 'नेटवर्कमध्ये सामील व्हा (नोंदणी)',
    es: 'Unirse a la Red (Registro)',
    fr: 'Rejoindre le Réseau (Inscription)',
    de: 'Netzwerk beitreten (Registrierung)',
    ja: 'ネットワークに参加（新規登録）',
    ko: '네트워크 참여 (회원가입)',
    ar: 'الانضمام إلى الشبكة (تسجيل جديد)'
  },
  'nav.signOut': {
    en: 'Sign Out Session',
    hi: 'सत्र से बाहर निकलें',
    te: 'సెషన్ నుండి నిష్క్రమించండి',
    ta: 'வெளியேறு',
    kn: 'ಸೈನ್ ಔಟ್ ಮಾಡಿ',
    ml: 'സൈൻ ഔട്ട് ചെയ്യുക',
    bn: 'লগআউট করুন',
    mr: 'बाहेर पडा',
    es: 'Cerrar Sesión',
    fr: 'Déconnexion',
    de: 'Sitzung abmelden',
    ja: 'ログアウト',
    ko: '로그아웃',
    ar: 'تسجيل الخروج'
  },

  // Actions & Buttons
  'action.stopAnimation': {
    en: 'Stop Shaking Animation',
    hi: 'हिलने वाले एनिमेशन बंद करें',
    te: 'షేకింగ్ యానిమేషన్ ఆపివేయండి',
    ta: 'அசைவு அனிமேஷனை நிறுத்துங்கள்',
    kn: 'ಅಲುಗಾಡುವ ಅನಿಮೇಷನ್ ನಿಲ್ಲಿಸಿ',
    ml: 'ഷെയ്ക്ക് ആനിമേഷൻ നിർത്തുക',
    bn: 'কাঁপানো অ্যানিমেশন বন্ধ করুন',
    mr: 'थरथरणारे ॲनिमेशन थांबवा',
    es: 'Detener Animación Temblorosa',
    fr: 'Arrêter l’Animation Tremblante',
    de: 'Rüttel-Animation stoppen',
    ja: '揺れるアニメーションを停止',
    ko: '흔들림 애니메이션 중지',
    ar: 'إيقاف اهتزاز الرسوم المتحركة'
  },
  'action.enableAnimation': {
    en: 'Enable Shaking Animation',
    hi: 'हिलने वाले एनिमेशन चालू करें',
    te: 'షేకింగ్ యానిమేషన్ ప్రారంభించండి',
    ta: 'அசைவு அனிமேஷனை இயக்குங்கள்',
    kn: 'ಅಲುಗಾಡುವ ಅನಿಮೇಷನ್ ಸಕ್ರಿಯಗೊಳಿಸಿ',
    ml: 'ഷെയ്ക്ക് ആനിമേഷൻ പ്രവർത്തിപ്പിക്കുക',
    bn: 'কাঁপানো অ্যানিমেশন চালু করুন',
    mr: 'थरथरणारे ॲनिमेशन सुरू करा',
    es: 'Activar Animación Temblorosa',
    fr: 'Activer l’Animation',
    de: 'Animation aktivieren',
    ja: 'アニメーションを有効化',
    ko: '애니메이션 활성화',
    ar: 'تفعيل اهتزاز الرسوم المتحركة'
  },
  'theme.dark': {
    en: 'Dark Cinema Theme',
    hi: 'डार्क सिनेमा थीम',
    te: 'డార్క్ సినిమా థీమ్',
    ta: 'டார்க் சினிமா தீம்',
    kn: 'ಡಾರ್ಕ್ ಸಿನಿಮಾ ಥೀಮ್',
    ml: 'ഡാർക്ക് സിനിമ തീം',
    bn: 'ডার্ক সিনেমা থিম',
    mr: 'डार्क सिनेमा थीम',
    es: 'Tema Cine Oscuro',
    fr: 'Thème Cinéma Sombre',
    de: 'Dunkles Kino-Design',
    ja: 'ダークシネマテーマ',
    ko: '다크 시네마 테마',
    ar: 'الوضع السينمائي الداكن'
  },
  'theme.light': {
    en: 'Light Studio Theme',
    hi: 'लाइट स्टूडियो थीम',
    te: 'లైట్ స్టూడియో థీమ్',
    ta: 'லைட் ஸ்டுடியோ தீம்',
    kn: 'ಲೈಟ್ ಸ್ಟುಡಿಯೋ ಥೀಮ್',
    ml: 'ലൈറ്റ് സ്റ്റുഡിയോ തീം',
    bn: 'লাইট স্টুডিও থিম',
    mr: 'लाइट स्टुडिओ थीम',
    es: 'Tema Estudio Claro',
    fr: 'Thème Studio Clair',
    de: 'Helles Studio-Design',
    ja: 'ライトスタジオテーマ',
    ko: '라이트 스튜디오 테마',
    ar: 'الوضع المضيء للاستوديو'
  },
  'auth.noAccount': {
    en: "You cannot login without registration or email doesn't exist. Please register first.",
    hi: 'बिना पंजीकरण के आप लॉगिन नहीं कर सकते या ईमेल मौजूद नहीं है। कृपया पहले पंजीकरण करें।',
    te: 'రిజిస్ట్రేషన్ లేకుండా మీరు లాగిన్ చేయలేరు లేదా ఈ ఈమెయిల్ ఉనికిలో లేదు. దయచేసి ముందుగా నమోదు చేసుకోండి.',
    ta: 'பதிவு செய்யாமல் நீங்கள் உள்நுழைய முடியாது அல்லது மின்னஞ்சல் இல்லை. தயவுசெய்து முதலில் பதிவு செய்யவும்.',
    kn: 'ನೋಂದಣಿ ಇಲ್ಲದೆ ನೀವು ಲಾಗ್ ಇನ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ ಅಥವಾ ಇಮೇಲ್ ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ನೋಂದಾಯಿಸಿ.',
    ml: 'രജിസ്ട്രേഷൻ ഇല്ലാതെ നിങ്ങൾക്ക് ലോഗിൻ ചെയ്യാൻ കഴിയില്ല അല്ലെങ്കിൽ ഇമെയിൽ നിലവിലില്ല. ദയവായി ആദ്യം രജിസ്റ്റർ ചെയ്യുക.',
    bn: 'নিবন্ধন ছাড়া আপনি লগইন করতে পারবেন না অথবা ইমেলটি বিদ্যমান নেই। অনুগ্রহ করে প্রথমে নিবন্ধন করুন।',
    mr: 'नोंदणी केल्याशिवाय तुम्ही लॉगिन करू शकत नाही किंवा ईमेल अस्तित्वात नाही. कृपया प्रथम नोंदणी करा.',
    es: 'No puedes iniciar sesión sin registrarte o el correo no existe. Por favor regístrate primero.',
    fr: 'Vous ne pouvez pas vous connecter sans inscription ou l’e-mail n’existe pas. Veuillez d’abord vous inscrire.',
    de: 'Sie können sich nicht ohne Registrierung anmelden oder die E-Mail existiert nicht. Bitte registrieren Sie sich zuerst.',
    ja: '新規登録なしではログインできません、またはメールアドレスが存在しません。まず登録してください。',
    ko: '회원가입 없이는 로그인할 수 없거나 이메일이 존재하지 않습니다. 먼저 등록해 주십시오.',
    ar: 'لا يمكنك تسجيل الدخول دون تسجيل أو أن البريد الإلكتروني غير موجود. يُرجى التسجيل أولاً.'
  }
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  translateText: (text: string) => string;
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('cv_language');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('cv_language', lang);
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    if (currentLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [currentLanguage]);

  const t = (key: string, fallback?: string): string => {
    const item = TRANSLATIONS[key];
    if (item && item[currentLanguage]) {
      return item[currentLanguage]!;
    }
    if (item && item.en) {
      return item.en;
    }
    return fallback || key;
  };

  // Dynamic text translator for raw proverbs, headings, or titles
  const translateText = (text: string): string => {
    if (!text || currentLanguage === 'en') return text;

    // Search exact matches in translations
    for (const key of Object.keys(TRANSLATIONS)) {
      const entry = TRANSLATIONS[key];
      if (entry.en && entry.en.trim().toLowerCase() === text.trim().toLowerCase()) {
        if (entry[currentLanguage]) return entry[currentLanguage]!;
      }
    }

    // Role motto matches
    for (const key of Object.keys(TRANSLATIONS)) {
      if (key.startsWith('welcome.')) {
        const entry = TRANSLATIONS[key];
        if (entry.en && (text.includes(entry.en.slice(0, 20)) || entry.en.includes(text.slice(0, 20)))) {
          if (entry[currentLanguage]) return entry[currentLanguage]!;
        }
      }
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        translateText,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
