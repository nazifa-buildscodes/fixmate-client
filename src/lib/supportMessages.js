const STORAGE_KEY = 'fixmate_support_messages_v1';

export function getSupportMessages() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSupportMessages(items) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage quota errors
  }
}

export function createSupportMessage({
  name,
  email,
  phone = '',
  role = 'guest',
  topic = 'General Inquiry',
  message,
}) {
  const current = getSupportMessages();
  const newItem = {
    id: `MSG-${Date.now().toString().slice(-6)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: role || 'guest',
    topic: topic || 'General Inquiry',
    message: message.trim(),
    status: 'open',
    reply: '',
    repliedAt: null,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...current];
  saveSupportMessages(updated);
  return newItem;
}

export function replyToSupportMessage(id, replyText) {
  const current = getSupportMessages();
  const updated = current.map((item) =>
    item.id === id
      ? {
          ...item,
          reply: replyText.trim(),
          status: 'replied',
          repliedAt: new Date().toISOString(),
        }
      : item
  );
  saveSupportMessages(updated);
  return updated;
}