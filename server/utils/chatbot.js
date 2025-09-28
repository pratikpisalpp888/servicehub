const OpenAI = require('openai');
const ChatMessage = require('../models/ChatMessage');

// Initialize OpenAI client only if API key is provided
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Enhanced system prompt for the chatbot with project-specific context
const SYSTEM_PROMPT = `You are ServiceHubAssistant, an AI assistant for the ServiceHub application. 
Your role is to help users find local service providers in Kharghar, Navi Mumbai, and solve common household problems.
You can help with:
1. Finding service providers by category (Beauty, Carpenter, Electrician, Plumber, Paint, Home Cleaning)
2. Explaining how to search and book services
3. Providing information about the booking process
4. Suggesting services based on user needs
5. Helping with account and profile management
6. Solving common household problems with step-by-step guidance

Key information about our service:
- We connect users with verified local service providers
- Users can search by service category or location
- All providers are rated and reviewed by customers
- Booking includes name, date/time, address, and special instructions
- Visit charges are displayed upfront
- Services are available in Kharghar, Navi Mumbai

Keep responses concise, friendly, and helpful. If a user asks about something outside our service scope, politely redirect them to our core services.`;

// FAQ groups for common questions
const FAQ_GROUPS = {
  booking: {
    title: "Booking Services",
    questions: [
      "How do I book a service?",
      "What information do I need to book?",
      "Can I change my appointment time?",
      "How do I cancel a booking?",
      "What happens if the provider doesn't show up?"
    ]
  },
  payments: {
    title: "Payments & Charges",
    questions: [
      "How much does it cost?",
      "What are your service charges?",
      "Do I pay upfront?",
      "What payment methods do you accept?",
      "Is there a guarantee on services?"
    ]
  },
  providers: {
    title: "Service Providers",
    questions: [
      "How do I find a provider?",
      "How are providers verified?",
      "Can I see provider ratings?",
      "What if I'm not satisfied with the service?",
      "How do I leave a review?"
    ]
  },
  services: {
    title: "Service Categories",
    questions: [
      "What services do you offer?",
      "Do you provide emergency services?",
      "What areas do you serve?",
      "How do I know what service I need?",
      "Can I book multiple services?"
    ]
  }
};

// Common household problems and solutions
const HOUSEHOLD_SOLUTIONS = {
  plumbing: {
    title: "Plumbing Issues",
    problems: {
      "overflow water in bathroom": `
        Steps to handle bathroom water overflow:
        1. Turn off the main water supply immediately
        2. Clear any blockages in the drain if visible
        3. Use towels or mops to absorb excess water
        4. Open windows for ventilation to prevent mold
        5. Contact a professional plumber as soon as possible
        6. For future prevention, consider installing overflow protection
      `,
      "leaking pipe": `
        Immediate steps for a leaking pipe:
        1. Turn off water supply to the affected area
        2. If possible, turn off the main water supply
        3. Dry the area around the leak
        4. Apply waterproof tape as a temporary fix
        5. Call a professional plumber for permanent repair
      `,
      "clogged drain": `
        How to fix a clogged drain:
        1. Remove visible debris from the drain
        2. Use a plunger to dislodge the clog
        3. Try pouring boiling water down the drain
        4. Mix baking soda and vinegar, pour down drain, wait 15 min, then flush with hot water
        5. If problem persists, contact a professional plumber
      `
    }
  },
  electrical: {
    title: "Electrical Issues",
    problems: {
      "power outage": `
        Steps to handle a power outage:
        1. Check if it's a general outage or just your home
        2. Check circuit breakers for tripped switches
        3. Unplug sensitive electronics to protect from power surges
        4. If breakers are fine, check with neighbors about outages
        5. Contact an electrician if the problem is in your home
      `,
      "flickering lights": `
        Solutions for flickering lights:
        1. Check if bulbs are loose and tighten them
        2. Replace old or burnt-out bulbs
        3. Ensure bulbs are the correct wattage for fixtures
        4. Check for loose connections at the switch or fixture
        5. Contact an electrician if problem continues
      `
    }
  },
  carpentry: {
    title: "Carpentry Issues",
    problems: {
      "squeaky floor": `
        How to fix a squeaky floor:
        1. Locate the exact spot that's squeaking
        2. Sprinkle baby powder or graphite between floorboards
        3. Drive screws through carpet into subfloor at squeak points
        4. For hardwood floors, use shims between joists and subfloor
        5. Contact a carpenter for persistent squeaks
      `,
      "stuck door": `
        Solutions for a stuck door:
        1. Check if hinges need tightening
        2. Apply lubricant (oil or graphite) to hinges
        3. Sand down areas where door rubs against frame
        4. Adjust door hinges if they've shifted
        5. Call a carpenter for major alignment issues
      `
    }
  },
  cleaning: {
    title: "Cleaning Issues",
    problems: {
      "stubborn stains": `
        Removing stubborn stains:
        1. Identify stain type (grease, ink, wine, etc.)
        2. Blot (don't rub) fresh stains immediately
        3. For grease: Apply dish soap and warm water
        4. For organic stains: Use enzyme cleaner
        5. For set-in stains: Try baking soda paste or vinegar
        6. Contact professional cleaners for valuable items
      `,
      "mold removal": `
        Safe mold removal:
        1. Ensure good ventilation
        2. Wear gloves and mask for protection
        3. Mix 1 part bleach with 10 parts water
        4. Scrub affected area thoroughly
        5. Dry completely to prevent regrowth
        6. For large areas, hire professional cleaners
      `
    }
  }
};

// Get recent conversation history for a user
const getConversationHistory = async (userId, limit = 10) => {
  const messages = await ChatMessage.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  
  // Reverse to chronological order
  return messages.reverse().map(msg => ({
    role: msg.role,
    content: msg.text
  }));
};

// Save a message to the database
const saveMessage = async (userId, role, text) => {
  const message = new ChatMessage({
    userId,
    role,
    text
  });
  
  return await message.save();
};

// Enhanced default responses for when OpenAI is not available
const getDefaultResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for FAQ group questions
  for (const [groupKey, group] of Object.entries(FAQ_GROUPS)) {
    for (const question of group.questions) {
      if (lowerMessage.includes(question.toLowerCase().substring(0, 10))) {
        switch(groupKey) {
          case 'booking':
            return "To book a service: 1) Search for a provider by category or name, 2) View provider details, 3) Click 'Book Service', 4) Enter your name, date/time, address, and any special instructions, 5) Confirm your booking. You can modify or cancel bookings through your 'My Bookings' page.";
          case 'payments':
            return "Each provider sets their own visit charge which is displayed upfront. You only pay after the service is completed to our satisfaction. We accept payments through our secure online payment system. All our services come with a satisfaction guarantee.";
          case 'providers':
            return "All our providers are verified professionals with background checks and skill assessments. You can see average ratings and read reviews on each provider's profile page. If you're not satisfied, contact our support team for assistance. You can leave reviews after your service is completed.";
          case 'services':
            return "We offer services in Beauty, Carpentry, Electrical work, Plumbing, Painting, and Home Cleaning. We serve Kharghar, Navi Mumbai. Our 24/7 emergency service is available for urgent issues. Our support team can help you determine what service you need based on your description.";
        }
      }
    }
  }
  
  // Check for household problem solutions
  for (const [categoryKey, category] of Object.entries(HOUSEHOLD_SOLUTIONS)) {
    for (const [problem, solution] of Object.entries(category.problems)) {
      if (lowerMessage.includes(problem)) {
        return `Here's how to handle ${problem}:\n\n${solution}\n\nFor professional assistance with this issue, you can book a ${category.title} service through ServiceHub.`;
      }
    }
  }
  
  // Service category responses
  if (lowerMessage.includes('beauty') || lowerMessage.includes('salon')) {
    return "We have verified beauty professionals offering services like haircuts, styling, facials, and makeup. You can find them in the Beauty category on our dashboard.";
  }
  
  if (lowerMessage.includes('carpenter') || lowerMessage.includes('wood')) {
    return "Our carpenters provide furniture repair, installation, and woodwork services. Visit the Carpenter category to find providers near you.";
  }
  
  if (lowerMessage.includes('electrician') || lowerMessage.includes('electrical')) {
    return "Licensed electricians are available for wiring, repairs, and installations. Check the Electrician category for local professionals.";
  }
  
  if (lowerMessage.includes('plumber') || lowerMessage.includes('water') || lowerMessage.includes('pipe')) {
    return "Professional plumbers can help with pipe repairs, installations, and water system maintenance. Browse the Plumber category for services.";
  }
  
  if (lowerMessage.includes('paint') || lowerMessage.includes('painting')) {
    return "Interior and exterior painting services are available. Visit the Paint category to connect with experienced painters.";
  }
  
  if (lowerMessage.includes('cleaning') || lowerMessage.includes('home cleaning')) {
    return "Professional home cleaning services including deep cleaning and regular maintenance. Check the Home Cleaning category for providers.";
  }
  
  // Booking process responses
  if (lowerMessage.includes('book') || lowerMessage.includes('booking') || lowerMessage.includes('appointment')) {
    return "To book a service: 1) Search for a provider by category or name, 2) View provider details, 3) Click 'Book Service', 4) Enter your name, date/time, address, and any special instructions, 5) Confirm your booking.";
  }
  
  if (lowerMessage.includes('charge') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "Each provider sets their own visit charge which is displayed upfront. You only pay after the service is completed to our satisfaction.";
  }
  
  if (lowerMessage.includes('rate') || lowerMessage.includes('review') || lowerMessage.includes('rating')) {
    return "All our providers are rated by customers. You can see average ratings and read reviews on each provider's profile page.";
  }
  
  if (lowerMessage.includes('location') || lowerMessage.includes('area') || lowerMessage.includes('kharghar')) {
    return "Our service is currently focused on Kharghar, Navi Mumbai. All providers in our network serve this area.";
  }
  
  // General help responses
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I can help you find local service providers, explain our booking process, or answer questions about our services. What do you need assistance with?";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your ServiceHub assistant. How can I help you find a service provider or solve a household problem today?";
  }
  
  // Default response
  return "I'm your ServiceHub assistant. I can help you find verified service providers in Kharghar for beauty, carpentry, electrical work, plumbing, painting, and home cleaning. I can also help solve common household problems. What type of service are you looking for or what problem can I help you solve?";
};

// Main chatbot function
const getChatbotResponse = async (userId, userMessage) => {
  // Save user message
  await saveMessage(userId, 'user', userMessage);
  
  let responseText;
  
  // Try OpenAI if available
  if (openai) {
    try {
      // Get conversation history
      const history = await getConversationHistory(userId);
      
      // Prepare messages for OpenAI
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: userMessage }
      ];
      
      // Get response from OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      });
      
      responseText = completion.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to default responses
      responseText = getDefaultResponse(userMessage);
    }
  } else {
    // Use default responses when OpenAI is not configured
    responseText = getDefaultResponse(userMessage);
  }
  
  // Save bot response
  await saveMessage(userId, 'assistant', responseText);
  
  return responseText;
};

module.exports = {
  getChatbotResponse,
  FAQ_GROUPS,
  HOUSEHOLD_SOLUTIONS
};