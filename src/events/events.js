export function setupEvents(client) {
  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.on('authenticated', () => {
    console.log('Client is authenticated!');
  });

  client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
  });

  client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
  });
}