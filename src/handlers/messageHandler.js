import { isMessageApproved, handleApprovalResponse } from '../utils/approvalSystem.js';
import { generateResponse } from '../utils/responseGenerator.js';

export function messageHandler(client) {
  client.on('message', async (message) => {
    try {
      // Check if this is an approval response
      const approvalResponse = handleApprovalResponse(message);
      if (approvalResponse) {
        const { approved, originalMessage } = approvalResponse;
        if (approved) {
          const response = await generateResponse(originalMessage.content);
          const chat = await client.getChatById(originalMessage.contact.number + '@c.us');
          await chat.sendMessage(response);
          
          // Notify admin of sent response
          const adminChat = await client.getChatById(process.env.ADMIN_NUMBER);
          await adminChat.sendMessage(`✅ Response sent to ${originalMessage.contact.pushname}`);
        }
        return;
      }

      // Handle new incoming messages
      if (message.fromMe) return;

      const chat = await message.getChat();
      const contact = await message.getContact();
      
      const messageDetails = {
        chat,
        contact,
        content: message.body,
        timestamp: new Date(),
      };

      await isMessageApproved(messageDetails);
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Notify admin of error
      try {
        const adminChat = await client.getChatById(process.env.ADMIN_NUMBER);
        await adminChat.sendMessage(`❌ Error handling message: ${error.message}`);
      } catch (notifyError) {
        console.error('Error notifying admin:', notifyError);
      }
    }
  });
}