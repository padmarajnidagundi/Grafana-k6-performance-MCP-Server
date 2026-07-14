import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

/**
 * WebSocket Performance Test
 * 
 * This test demonstrates performance testing of WebSocket connections.
 * Includes connection lifecycle, message sending/receiving, and proper cleanup.
 */

export const options = {
	stages: [
		{ duration: '10s', target: 5 },   // Ramp up to 5 concurrent connections
		{ duration: '30s', target: 5 },   // Maintain 5 connections
		{ duration: '10s', target: 10 },  // Scale up to 10
		{ duration: '30s', target: 10 },  // Maintain 10 connections
		{ duration: '10s', target: 0 },   // Ramp down
	],
	thresholds: {
		ws_connecting: ['p(95)<1000'],           // Connection time < 1s for 95% of connections
		ws_session_duration: ['p(95)<60000'],    // Session duration
		ws_msgs_sent: ['count>100'],             // At least 100 messages sent total
		ws_msgs_received: ['count>100'],         // At least 100 messages received total
		'ws_message_latency': ['p(95)<500'],     // Message round-trip < 500ms
	},
};

// WebSocket endpoint - replace with your actual WebSocket server
const WS_URL = 'wss://echo.websocket.org/';  // Public echo server for testing

// Custom metrics
const wsConnectionTime = new Trend('ws_connecting');
const wsMessagesSent = new Counter('ws_msgs_sent');
const wsMessagesReceived = new Counter('ws_msgs_received');
const wsMessageLatency = new Trend('ws_message_latency');

export default function () {
	const url = WS_URL;
	const params = {
		tags: { name: 'WebSocketTest' },
	};

	const startConnect = Date.now();

	const res = ws.connect(url, params, function (socket) {
		// Connection established
		const connectTime = Date.now() - startConnect;
		wsConnectionTime.add(connectTime);

		socket.on('open', () => {
			console.log('WebSocket connection established');

			// Send initial message
			const initialMessage = JSON.stringify({
				type: 'ping',
				timestamp: Date.now(),
				userId: __VU,
			});
			socket.send(initialMessage);
			wsMessagesSent.add(1);
		});

		socket.on('message', (data) => {
			wsMessagesReceived.add(1);
			
			try {
				const message = JSON.parse(data);
				
				// Calculate latency for ping messages
				if (message.type === 'ping' && message.timestamp) {
					const latency = Date.now() - message.timestamp;
					wsMessageLatency.add(latency);
				}

				check(data, {
					'message received': (msg) => msg.length > 0,
					'valid JSON': (msg) => {
						try {
							JSON.parse(msg);
							return true;
						} catch (e) {
							return false;
						}
					},
				});
			} catch (e) {
				// Handle non-JSON messages (like echo responses)
				console.log('Received non-JSON message:', data);
			}
		});

		socket.on('error', (e) => {
			if (e.error() !== 'websocket: close sent') {
				console.error('WebSocket error:', e.error());
			}
		});

		socket.on('close', () => {
			console.log('WebSocket connection closed');
		});

		// Simulate realistic user behavior
		// Send periodic messages
		const messageInterval = socket.setInterval(() => {
			const message = JSON.stringify({
				type: 'ping',
				timestamp: Date.now(),
				userId: __VU,
				iteration: __ITER,
				data: 'Test message ' + Math.random(),
			});
			socket.send(message);
			wsMessagesSent.add(1);
		}, 2000); // Send message every 2 seconds

		// Keep connection alive for 20 seconds
		socket.setTimeout(() => {
			console.log('Timeout reached, closing connection');
			socket.clearInterval(messageInterval);
			socket.close();
		}, 20000);
	});

	check(res, {
		'WebSocket connected successfully': (r) => r && r.status === 101,
	});

	sleep(1);
}

/**
 * Alternative Pattern: Chat Application Simulation
 * 
 * Uncomment to test a chat-like WebSocket application
 */

/*
export function chatSimulation() {
	const url = 'wss://your-chat-server.com/ws';
	
	ws.connect(url, function (socket) {
		socket.on('open', () => {
			// Authenticate
			socket.send(JSON.stringify({
				type: 'auth',
				token: 'YOUR_AUTH_TOKEN',
			}));

			// Join a room
			socket.send(JSON.stringify({
				type: 'join_room',
				roomId: 'test-room-1',
			}));
		});

		socket.on('message', (data) => {
			const message = JSON.parse(data);
			
			// Handle different message types
			switch (message.type) {
				case 'auth_success':
					console.log('Authenticated successfully');
					break;
				case 'room_joined':
					console.log('Joined room:', message.roomId);
					break;
				case 'chat_message':
					console.log('Received message:', message.content);
					// Send a reply
					socket.send(JSON.stringify({
						type: 'chat_message',
						content: 'Automated test reply',
						roomId: message.roomId,
					}));
					break;
			}
		});

		// Send periodic chat messages
		const chatInterval = socket.setInterval(() => {
			socket.send(JSON.stringify({
				type: 'chat_message',
				content: `Test message from VU ${__VU}`,
				roomId: 'test-room-1',
			}));
		}, 5000);

		socket.setTimeout(() => {
			socket.clearInterval(chatInterval);
			socket.close();
		}, 30000);
	});
}
*/

/**
 * Best Practices for WebSocket Load Testing:
 * 
 * 1. Monitor connection success rate
 * 2. Track message send/receive rates
 * 3. Measure message latency (round-trip time)
 * 4. Test connection limits (max concurrent connections)
 * 5. Simulate realistic message patterns
 * 6. Test reconnection logic
 * 7. Monitor memory usage on long-lived connections
 * 8. Test with different message sizes
 * 9. Include authentication and authorization flows
 * 10. Test graceful degradation under load
 * 
 * Common WebSocket Metrics:
 * - ws_connecting: Time to establish connection
 * - ws_session_duration: How long connections stay open
 * - ws_msgs_sent: Total messages sent
 * - ws_msgs_received: Total messages received
 * - ws_message_latency: Round-trip time for messages
 */
