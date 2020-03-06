export function jsonFactory(status, payload) {
  return function json() {
    return [
      status,
      { 'Content-Type': 'application/json' },
      JSON.stringify(payload)
    ];
  };
}

export function jsonResponse(status = 200, payload = {}) {
  return [
    status,
    { 'Content-Type': 'application/json' },
    JSON.stringify(payload)
  ];
}
