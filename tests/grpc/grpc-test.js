import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

/**
 * gRPC Performance Test
 * 
 * This test demonstrates performance testing of gRPC services.
 * Includes unary calls, server streaming, and proper connection management.
 * 
 * Prerequisites:
 * - gRPC server running
 * - Proto file definitions available
 */

export const options = {
	stages: [
		{ duration: '20s', target: 10 },  // Ramp up to 10 users
		{ duration: '1m', target: 10 },   // Stay at 10 users
		{ duration: '10s', target: 20 },  // Scale to 20 users
		{ duration: '1m', target: 20 },   // Maintain load
		{ duration: '20s', target: 0 },   // Ramp down
	],
	thresholds: {
		grpc_req_duration: ['p(95)<500'],          // 95% of requests under 500ms
		'grpc_req_duration{method:GetUser}': ['p(99)<300'],
		'grpc_req_duration{method:CreateUser}': ['p(99)<800'],
		'grpc_req_duration{method:ListUsers}': ['p(99)<1000'],
		checks: ['rate>0.95'],                      // 95% of checks should pass
	},
};

// gRPC client
const client = new grpc.Client();

// Load proto file - replace with your actual proto file path
// In a real scenario, you would reference your .proto file
const GRPC_ADDR = 'grpcb.in:9001';  // Public gRPC test server
const PROTO_PATH = __ENV.PROTO_PATH || '../protos/route_guide.proto';

export default function () {
	// Connect to gRPC server
	client.connect(GRPC_ADDR, {
		plaintext: true,  // Use 'false' for TLS in production
		timeout: '10s',
		// For production with TLS:
		// plaintext: false,
		// reflect: true,
	});

	// Test 1: Unary RPC call (single request, single response)
	testUnaryCall();
	sleep(1);

	// Test 2: List/streaming operation
	// testServerStreaming();
	// sleep(1);

	// Close connection
	client.close();
	sleep(1);
}

/**
 * Test a simple unary gRPC call
 */
function testUnaryCall() {
	const data = {
		greeting: 'k6 Performance Test',
	};

	const response = client.invoke('hello.HelloService/SayHello', data, {
		tags: { method: 'SayHello' },
	});

	check(response, {
		'status is OK': (r) => r && r.status === grpc.StatusOK,
		'response has message': (r) => r && r.message && r.message.reply !== undefined,
		'response time OK': (r) => r && r.error === undefined,
	});

	if (response.status !== grpc.StatusOK) {
		console.error(`gRPC error: ${response.status} - ${response.error}`);
	}
}

/**
 * Example for testing server streaming
 * Uncomment when you have a server streaming method
 */
/*
function testServerStreaming() {
	const stream = new grpc.Stream(client, 'route.RouteGuide/ListFeatures', {
		tags: { method: 'ListFeatures' },
	});

	const request = {
		lo: { latitude: 400000000, longitude: -750000000 },
		hi: { latitude: 420000000, longitude: -730000000 },
	};

	stream.on('data', (feature) => {
		check(feature, {
			'feature has name': (f) => f.name !== '',
			'feature has location': (f) => f.location !== undefined,
		});
	});

	stream.on('error', (e) => {
		console.error('Stream error:', e);
	});

	stream.on('end', () => {
		console.log('Stream ended');
	});

	stream.write(request);
}
*/

/**
 * Example: Testing with authentication (metadata)
 */
function testWithAuth() {
	client.connect(GRPC_ADDR, {
		plaintext: false,
		timeout: '10s',
	});

	const authMetadata = {
		authorization: 'Bearer YOUR_JWT_TOKEN',
		'x-api-key': 'your-api-key',
	};

	const data = { userId: __VU };

	const response = client.invoke('user.UserService/GetUser', data, {
		metadata: authMetadata,
		tags: { method: 'GetUser', authenticated: 'true' },
	});

	check(response, {
		'authenticated request successful': (r) => r.status === grpc.StatusOK,
		'has user data': (r) => r.message && r.message.id !== undefined,
	});
}

/**
 * Example: Testing different gRPC methods
 */
export function advancedGrpcTest() {
	client.connect(GRPC_ADDR, { plaintext: true });

	// Test Create operation
	const createResponse = client.invoke('user.UserService/CreateUser', {
		name: `User ${__VU}`,
		email: `user${__VU}@test.com`,
		age: Math.floor(Math.random() * 50) + 18,
	}, {
		tags: { method: 'CreateUser' },
	});

	check(createResponse, {
		'user created': (r) => r.status === grpc.StatusOK,
		'has user id': (r) => r.message && r.message.id !== undefined,
	});

	const userId = createResponse.message?.id;

	// Test Read operation
	if (userId) {
		const getResponse = client.invoke('user.UserService/GetUser', {
			id: userId,
		}, {
			tags: { method: 'GetUser' },
		});

		check(getResponse, {
			'user retrieved': (r) => r.status === grpc.StatusOK,
			'correct user': (r) => r.message && r.message.id === userId,
		});
	}

	// Test Update operation
	if (userId) {
		const updateResponse = client.invoke('user.UserService/UpdateUser', {
			id: userId,
			name: `Updated User ${__VU}`,
		}, {
			tags: { method: 'UpdateUser' },
		});

		check(updateResponse, {
			'user updated': (r) => r.status === grpc.StatusOK,
		});
	}

	// Test List operation
	const listResponse = client.invoke('user.UserService/ListUsers', {
		page: 1,
		pageSize: 10,
	}, {
		tags: { method: 'ListUsers' },
	});

	check(listResponse, {
		'users listed': (r) => r.status === grpc.StatusOK,
		'has users array': (r) => r.message && Array.isArray(r.message.users),
	});

	client.close();
}

/**
 * Teardown function - runs once at the end of the test
 */
export function teardown(data) {
	client.close();
}

/**
 * Best Practices for gRPC Load Testing:
 * 
 * 1. Test all gRPC method types:
 *    - Unary (single request/response)
 *    - Server streaming
 *    - Client streaming
 *    - Bidirectional streaming
 * 
 * 2. Monitor gRPC-specific metrics:
 *    - Connection pool efficiency
 *    - Message size impact on performance
 *    - Compression effectiveness
 *    - Multiplexing behavior (HTTP/2)
 * 
 * 3. Test with realistic payloads:
 *    - Small messages (< 1KB)
 *    - Medium messages (1-100KB)
 *    - Large messages (> 100KB)
 * 
 * 4. Test error scenarios:
 *    - Invalid requests
 *    - Authentication failures
 *    - Service unavailability
 *    - Timeout handling
 * 
 * 5. Connection management:
 *    - Connection pooling
 *    - Keep-alive settings
 *    - Reconnection logic
 *    - Graceful shutdown
 * 
 * 6. Security testing:
 *    - TLS/SSL overhead
 *    - Token refresh flows
 *    - Certificate validation
 * 
 * 7. Compare with REST:
 *    - Throughput differences
 *    - Latency comparisons
 *    - Resource utilization
 * 
 * Common gRPC Status Codes:
 * - OK (0): Success
 * - CANCELLED (1): Operation cancelled
 * - UNKNOWN (2): Unknown error
 * - INVALID_ARGUMENT (3): Invalid arguments
 * - DEADLINE_EXCEEDED (4): Timeout
 * - NOT_FOUND (5): Resource not found
 * - ALREADY_EXISTS (6): Resource exists
 * - PERMISSION_DENIED (7): No permission
 * - UNAUTHENTICATED (16): Authentication required
 * - UNAVAILABLE (14): Service unavailable
 */
