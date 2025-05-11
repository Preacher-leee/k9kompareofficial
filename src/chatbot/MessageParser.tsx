import { createChatBotMessage } from 'react-chatbot-kit';

export class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCase = message.toLowerCase();

    // Handle breed recommendations
    if (lowerCase.includes('breed') || lowerCase.includes('recommend')) {
      this.actionProvider.handleBreedRecommendation();
      return;
    }

    // Handle adoption questions
    if (lowerCase.includes('adopt') || lowerCase.includes('rescue')) {
      this.actionProvider.handleAdoptionInfo();
      return;
    }

    // Handle training questions
    if (lowerCase.includes('train') || lowerCase.includes('training')) {
      this.actionProvider.handleTrainingInfo();
      return;
    }

    // Handle health questions
    if (lowerCase.includes('health') || lowerCase.includes('vet')) {
      this.actionProvider.handleHealthInfo();
      return;
    }

    // Default response
    this.actionProvider.handleDefault();
  }
}