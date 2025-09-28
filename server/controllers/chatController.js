const { getChatbotResponse } = require('../utils/chatbot');

// Handle chat message
const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Get response from chatbot
    const response = await getChatbotResponse(req.user._id, message);

    res.json({
      success: true,
      data: {
        message: response
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing chat message'
    });
  }
};

module.exports = {
  handleChatMessage
};