const pendingApprovals = new Map();
const ADMIN_NUMBER = process.env.ADMIN_NUMBER;

export async function isMessageApproved(messageDetails) {
  const { chat, contact, content } = messageDetails;
  const messageId = `${contact.number}_${Date.now()}`;
  
  try {
    const adminChat = await chat.client.getChatById(ADMIN_NUMBER);
    const approvalMessage = `
📩 New message requires approval:
👤 From: ${contact.pushname} (${contact.number})
💬 Message: ${content}

✅ Reply with "${messageId}_approve" to approve
❌ Reply with "${messageId}_deny" to deny`;
    
    pendingApprovals.set(messageId, {
      ...messageDetails,
      status: 'pending',
      timestamp: Date.now()
    });
    
    await adminChat.sendMessage(approvalMessage);
    
    // Clean up old pending approvals (older than 1 hour)
    cleanupOldApprovals();
    
    return false;
  } catch (error) {
    console.error('Error in approval system:', error);
    return false;
  }
}

export function handleApprovalResponse(message) {
  if (!message.fromMe && message.from !== ADMIN_NUMBER) return null;
  
  const response = message.body.toLowerCase();
  const [messageId, action] = response.split('_');
  
  if (!pendingApprovals.has(messageId)) return null;
  
  const approval = pendingApprovals.get(messageId);
  pendingApprovals.delete(messageId);
  
  return {
    approved: action === 'approve',
    originalMessage: approval
  };
}

function cleanupOldApprovals() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  for (const [messageId, approval] of pendingApprovals.entries()) {
    if (approval.timestamp < oneHourAgo) {
      pendingApprovals.delete(messageId);
    }
  }
}