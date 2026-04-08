/**
 * Parses API response message into a human-readable string.
 * Handles: string messages, validation objects { field: [errors] }, and thrown errors.
 */
export const parseApiMessage = (message) => {
  if (!message) return 'Something went wrong.';
  if (typeof message === 'string') return message;
  if (typeof message === 'object') {
    return Object.values(message).flat().join('\n');
  }
  return 'Something went wrong.';
};
