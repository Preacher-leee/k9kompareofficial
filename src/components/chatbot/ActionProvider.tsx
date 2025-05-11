export class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  addMessageToState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  handleBreedRecommendation = () => {
    const message = this.createChatBotMessage(
      "I can help you find the perfect breed! Let me ask you a few questions about your lifestyle. How active are you on a scale of 1-5?",
      {
        widget: "activityLevel",
      }
    );
    this.addMessageToState(message);
  };

  handleAdoptionInfo = () => {
    const message = this.createChatBotMessage(
      "That's great that you're considering adoption! Would you like me to help you find local shelters or learn more about the adoption process?",
      {
        widget: "adoptionOptions",
      }
    );
    this.addMessageToState(message);
  };

  handleTrainingInfo = () => {
    const message = this.createChatBotMessage(
      "Training is essential for a happy dog! Here are some basic training tips:\n\n" +
      "1. Start training early\n" +
      "2. Be consistent\n" +
      "3. Use positive reinforcement\n" +
      "4. Keep sessions short\n\n" +
      "Would you like specific training tips for a particular breed?",
      {
        widget: "trainingOptions",
      }
    );
    this.addMessageToState(message);
  };

  handleHealthInfo = () => {
    const message = this.createChatBotMessage(
      "Regular vet check-ups and preventive care are important! Here are some basic health tips:\n\n" +
      "1. Schedule regular check-ups\n" +
      "2. Keep vaccinations up to date\n" +
      "3. Maintain dental hygiene\n" +
      "4. Watch for changes in behavior\n\n" +
      "Would you like information about specific health concerns?",
      {
        widget: "healthOptions",
      }
    );
    this.addMessageToState(message);
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "I'm not sure I understand. Would you like help with:\n\n" +
      "1. Finding the right breed\n" +
      "2. Adoption information\n" +
      "3. Training tips\n" +
      "4. Health care advice",
      {
        widget: "defaultOptions",
      }
    );
    this.addMessageToState(message);
  };
}