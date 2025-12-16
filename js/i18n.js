i18next.init({
  lng: detectLanguage(),
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        'title': 'get the fuck out',
        'description': 'Digital obsession, open-source philosophy, motorcycle road trips and alternative music. Personal space with zero fucks given.',
        'og_description': 'Digital obsession, motorcycle road trips and alternative music',
        'about_title': 'About Me',
        'favorites': 'Favorites',
        'trips': 'Trips',
        'about_image_alt': 'me',
        'about_text': "I'm that guy — the ghost with a motorcycle. You won't find me home. Every day I'm rolling somewhere new, chasing curves or quiet corners. When the sun dips, I turn into something else: a creature of the screen glow, coding in the dark, getting lost in random movies and series that find me more than I find them. So if you're out there and boredom's creeping in… send up a smoke signal. I'm already looking at the horizon; I'll see it. What do you say? Feel like a drink with a phantom rider? Or just join me on the road for a while, no destination needed. Maybe we just talk over coffee while the world sleeps. I'm here. I'm out here. So tell me… what do you want?",
        'ps_note': "p.s hmu if you like talking about road trips and drinks ;p",
        'chat_title': 'Cbox is an embedded real-time chat web app'
      }
    },
    es: {
      translation: {
        'title': 'get the fuck out',
        'description': 'Obsesión digital, filosofía open-source, viajes en motocicleta y música alternativa. Espacio personal, si no te gusta, vete.',
        'og_description': 'Obsesión digital, viajes en motocicleta y música alternativa',
        'about_title': 'Sobre mí',
        'favorites': 'Favoritos',
        'trips': 'Viajes',
        'about_image_alt': 'yo',
        'about_text': "Soy el freaky gocho con moto. No me vas a encontrar en casa. Cada día estoy en un lugar nuevo, persiguiendo curvas sintiendo el viento. Cuando cae el sol soy un zombie: codeo en la oscuridad, me pierdo en películas y series que me encuentran más que yo a ellas, y sigo así hasta que el cansancio me noquea. Así que si estás por ahí y el aburrimiento empieza a asomarse… manda una señal. Yo ya estoy mirando al horizonte; la veré. ¿Qué te parece? ¿Quieres beber algo? ¿O prefieres dar una vuelta a donde sea? Quizá solo tomar café mientras el mundo duerme. Estoy aquí. Estoy aquí fuera. Así que dime… ¿qué buscas? ¿qué haces aquí?",
        'ps_note': "pd. hablame si te gusta hablar de rutas y tragos ;p",
        'chat_title': 'Cbox es una aplicación web de chat en tiempo real integrada'
      }
    },
    de: {
      translation: {
        'title': 'get the fuck out',
        'description': 'Digitale Obsession, Open-Source-Philosophie, Motorradreisen und alternative Musik. Persönlicher Raum, auf den geschissen wird.',
        'og_description': 'Digitale Obsession, Motorradreisen und alternative Musik',
        'about_title': 'Über mich',
        'favorites': 'Favoriten',
        'trips': 'Reisen',
        'about_image_alt': 'ich',
        'about_text': "Ich bin dieser Typ — das Gespenst mit Motorrad. Du wirst mich nicht zu Hause finden. Jeden Tag rolle ich woanders hin, jage Kurven oder stille Ecken. Wenn die Sonne untergeht, verwandle ich mich in etwas anderes: ein Geschöpf des Bildschirmscheins, programmiere im Dunkeln, verliere mich in zufälligen Filmen und Serien, die mich eher finden als ich sie. Also wenn du da draußen bist und die Langeweile schleicht sich ein… schick ein Rauchzeichen. Ich schaue schon auf den Horizont; ich werde es sehen. Was sagst du? Lust auf einen Drink mit einem Phantomfahrer? Oder begleite mich einfach eine Weile auf der Straße, ohne Ziel. Vielleicht reden wir nur bei Kaffee, während die Welt schläft. Ich bin hier. Ich bin hier draußen. Also sag mir… was willst du?",
        'ps_note': "ps. melde dich, wenn du über Roadtrips und Drinks reden magst ;p",
        'chat_title': 'Cbox ist eine eingebettete Echtzeit-Chat-Web-App'
      }
    },
    ru: {
      translation: {
        'title': 'get the fuck out',
        'description': 'Цифровая одержимость, философия открытого исходного кода, мотоциклетные путешествия и альтернативная музыка. Личное пространство, на которое всем плевать.',
        'og_description': 'Цифровая одержимость, мотоциклетные путешествия и альтернативная музыка',
        'about_title': 'Обо мне',
        'favorites': 'Избранное',
        'trips': 'Поездки',
        'about_image_alt': 'я',
        'about_text': "Я тот самый парень — призрак с мотоциклом. Ты не найдешь меня дома. Каждый день я качу куда-то новое, гоняюсь за поворотами или тихими уголками. Когда садится солнце, я превращаюсь во что-то другое: существо из свечения экрана, программирую в темноте, теряюсь в случайных фильмах и сериалах, которые находят меня чаще, чем я их. Так что если ты там снаружи и скука подкрадывается… подавай дымовой сигнал. Я уже смотрю на горизонт; я увижу его. Что скажешь? Хочешь выпить с призрачным наездником? Или просто присоединись ко мне на дороге на время, без необходимости в пункте назначения. Может, просто поболтаем за кофе, пока мир спит. Я здесь. Я здесь, снаружи. Так что скажи мне… чего ты хочешь?",
        'ps_note': "п.с. напиши, если любишь говорить о поездках на мотоцикле и выпивке ;p",
        'chat_title': 'Cbox — это встроенное веб-приложение для чата в реальном времени'
      }
    }
  }
}, function (err, t) {
  applyTranslations();
  document.title = i18next.t('title');
  document.documentElement.lang = i18next.language;
});

function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0];
  const supportedLangs = ['en', 'es', 'de', 'ru'];

  return supportedLangs.includes(langCode) ? langCode : 'en';
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18next.t(key);
  });

  const metaDescription = document.querySelector('meta[name="description"]');
  const metaOgDescription = document.querySelector('meta[property="og:description"]');
  const metaOgTitle = document.querySelector('meta[property="og:title"]');

  if (metaDescription) {
    metaDescription.setAttribute('content', i18next.t('description'));
  }

  if (metaOgDescription) {
    metaOgDescription.setAttribute('content', i18next.t('og_description'));
  }

  if (metaOgTitle) {
    metaOgTitle.setAttribute('content', i18next.t('title'));
  }

  const aboutImage = document.querySelector('img[src*="about.png"]');
  if (aboutImage) {
    aboutImage.setAttribute('alt', i18next.t('about_image_alt'));
  }

  const chatIframe = document.querySelector('iframe[title*="Cbox"]');
  if (chatIframe) {
    chatIframe.setAttribute('title', i18next.t('chat_title'));
  }

  document.documentElement.lang = i18next.language;
}
