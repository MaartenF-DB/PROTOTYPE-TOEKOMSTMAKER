export const translations = {
  nl: {
    // Entry Choice
    entryChoice: {
      title: "Welkom bij de tentoonstellingsevaluatie",
      subtitle: "Om je de beste ervaring te geven, willen we graag weten:",
      checkIn: "Ik kom net binnen",
      checkOut: "Ik ben net klaar"
    },
    
    // Check-in Intro
    checkInIntro: {
      title: "Hé Toekomstmaker!",
      subtitle: "Zullen we samen uitvinden wat voor toekomstmaker jij bent?",
      start: "Beginnen"
    },
    
    // Check-out Intro
    checkOutIntro: {
      title: "Welkom terug!",
      subtitle: "Dan onderzoeken we verder wat voor toekomstmaker jij bent!",
      start: "Verder gaan!"
    },
    
    // Questions
    questions: {
      name: "Wat is je naam?",
      age: "Hoe oud ben je?",
      visitingWith: "Met wie bezoek je de tentoonstelling?",
      topicRanking: "Rangschik de onderwerpen van 1 (meest belangrijk) tot 6 (minst belangrijk)",
      mostImportant: "Wat vind je het belangrijkste onderwerp?",
      feelingBefore: "Hoe voel je je over het onderwerp {topic}?",
      confidenceBefore: "Hoeveel vertrouwen heb je dat je iets kan veranderen aan {topic}?",
      feelingAfter: "Hoe voel je je nu over het onderwerp {topic}?",
      actionChoice: "Wat zou je doen voor {topic} in de toekomst?",
      confidenceAfter: "Hoeveel vertrouwen heb je dat je iets kan veranderen aan {topic} in de toekomst?"
    },
    
    // Buttons
    buttons: {
      previous: "Vorige",
      next: "Volgende",
      complete: "Voltooien",
      finish: "Afronden",
      start: "Start",
      continue: "Verder gaan",
      restart: "Opnieuw beginnen"
    },
    
    // Answer labels
    answers: {
      yourAnswer: "Jouw antwoord:",
      selectFromList: "Of kies je naam uit de lijst:",
      checkoutOnly: "Ik heb de eerdere vragen niet beantwoord",
      onlyCheckout: "Alleen checkout evaluatie",
      notAnsweredBefore: "Je hebt de eerdere vragen niet beantwoord"
    },
    
    // Results
    results: {
      title: "Jij bent een...",
      forTopic: "voor",
      motivationalMessages: {
        1: "Jouw ideeën betekenen veel voor de rest van de wereld. Hoe klein ze ook zijn!",
        2: "Met jouw ideeën kom je er wel! Blijf in jezelf en anderen geloven.",
        3: "Je bent geweldig! Blijf zo denken en doen. Samen geven we vorm aan de toekomst.",
        4: "Je doet het geweldig! Je zelfvertrouwen zal je helpen de wereld te veranderen.",
        5: "Je bent een superster! Je zelfvertrouwen is inspirerend, blijf stralen en wijs de weg!"
      }
    },
    
    // Validation
    validation: {
      fillAnswer: "Vul eerst je antwoord in!",
      nameExists: "Er bestaat al een antwoord met deze naam. Klik verder om te bevestigen dat jij dit bent.",
      nameConflict: "Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer (bijvoorbeeld: Jan 1)"
    },
    
    // Placeholders
    placeholders: {
      typeName: "Typ hier je naam...",
      typeAge: "Typ hier je leeftijd...",
      typeOther: "Typ hier je antwoord..."
    }
  },
  
  en: {
    // Entry Choice
    entryChoice: {
      title: "Welcome to the Exhibition Evaluation",
      subtitle: "To give you the best experience, we'd like to know:",
      checkIn: "I'm just arriving",
      checkOut: "I'm just finished"
    },
    
    // Check-in Intro
    checkInIntro: {
      title: "Hey Future Maker!",
      subtitle: "Shall we discover together what kind of future maker you are?",
      start: "Begin"
    },
    
    // Check-out Intro
    checkOutIntro: {
      title: "Welcome back!",
      subtitle: "Let's continue to explore what kind of future maker you are!",
      start: "Continue!"
    },
    
    // Questions
    questions: {
      name: "What is your name?",
      age: "How old are you?",
      visitingWith: "Who are you visiting the exhibition with?",
      topicRanking: "Rank the topics from 1 (most important) to 6 (least important)",
      mostImportant: "What do you think is the most important topic?",
      feelingBefore: "How do you feel about the topic {topic}?",
      confidenceBefore: "How confident are you that you can make a change regarding {topic}?",
      feelingAfter: "How do you feel now about the topic {topic}?",
      actionChoice: "What would you do for {topic} in the future?",
      confidenceAfter: "How confident are you that you can make a change regarding {topic} in the future?"
    },
    
    // Buttons
    buttons: {
      previous: "Previous",
      next: "Next",
      complete: "Complete",
      finish: "Finish",
      start: "Start",
      continue: "Continue",
      restart: "Start Over"
    },
    
    // Answer labels
    answers: {
      yourAnswer: "Your answer:",
      selectFromList: "Or choose your name from the list:",
      checkoutOnly: "I haven't answered the previous questions",
      onlyCheckout: "Checkout evaluation only",
      notAnsweredBefore: "You haven't answered the previous questions"
    },
    
    // Results
    results: {
      title: "You are a...",
      forTopic: "for",
      motivationalMessages: {
        1: "Your ideas mean a lot to the rest of the world. No matter how small they are!",
        2: "With your ideas, you'll make it! Keep believing in yourself and others.",
        3: "You're amazing! Keep thinking and acting this way. Together we shape the future.",
        4: "You're doing great! Your confidence will help you change the world.",
        5: "You're a superstar! Your confidence is inspiring, keep shining and lead the way!"
      }
    },
    
    // Validation
    validation: {
      fillAnswer: "Please fill in your answer first!",
      nameExists: "An answer with this name already exists. Click continue to confirm that this is you.",
      nameConflict: "If there are multiple people with the same name, type your name with a number (e.g., John 1)"
    },
    
    // Placeholders
    placeholders: {
      typeName: "Type your name here...",
      typeAge: "Type your age here...",
      typeOther: "Type your answer here..."
    }
  }
};

export type Language = 'nl' | 'en';
export type TranslationKey = keyof typeof translations.nl;