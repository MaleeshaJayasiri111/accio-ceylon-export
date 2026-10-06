// Safe API helper that parses JSON and provides human-readable error messages

export async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    let data = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('API endpoint not found. Please ensure the backend server is running on port 5000.');
          }
          if (res.status === 502 || res.status === 504 || res.status === 500) {
            throw new Error('Server connection error. Please ensure the backend server is running (npm run dev:server).');
          }
          throw new Error(`Request failed with status ${res.status}`);
        }
        data = { message: text };
      }
    }

    if (!res.ok) {
      const errMsg = (data && (data.error || data.message)) || `Action failed (Status ${res.status})`;
      throw new Error(errMsg);
    }

    return data;
  } catch (err) {
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('JSON'))) {
      throw new Error('Cannot connect to backend server. Please make sure the server is started with "npm start" or "npm run dev:server" on port 5000.');
    }
    throw err;
  }
}
