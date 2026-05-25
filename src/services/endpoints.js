const AWS_BASE = (import.meta.env.VITE_AWS_URL || '').replace(/\/$/, '');

// Prepend AWS base URL to a relative S3 path returned by the API.
// Passes through if the path is already absolute (starts with http).
export const awsUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${AWS_BASE}/${path.replace(/^\//, '')}`;
};
