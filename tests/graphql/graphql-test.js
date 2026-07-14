import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * GraphQL API Performance Test
 * 
 * This test demonstrates performance testing of a GraphQL API endpoint.
 * It includes queries, mutations, and variable handling typical in GraphQL applications.
 */

export const options = {
	stages: [
		{ duration: '30s', target: 10 },  // Ramp up to 10 users
		{ duration: '1m', target: 10 },   // Stay at 10 users
		{ duration: '20s', target: 0 },   // Ramp down to 0
	],
	thresholds: {
		http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
		'http_req_duration{operation:query}': ['p(95)<1500'],
		'http_req_duration{operation:mutation}': ['p(95)<2500'],
		http_req_failed: ['rate<0.05'],    // Error rate should be less than 5%
	},
};

// GraphQL endpoint - replace with your actual GraphQL API
const GRAPHQL_URL = 'https://api.spacex.land/graphql/';

// Sample GraphQL query
const QUERY_LAUNCHES = `
query GetLaunches($limit: Int!) {
  launchesPast(limit: $limit) {
    mission_name
    launch_date_utc
    launch_success
    rocket {
      rocket_name
      rocket_type
    }
    links {
      mission_patch_small
      article_link
    }
  }
}
`;

// Sample GraphQL mutation (example structure)
const MUTATION_EXAMPLE = `
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
    email
    createdAt
  }
}
`;

// Sample nested query with fragments
const QUERY_COMPLEX = `
query GetLaunchDetails($id: ID!) {
  launch(id: $id) {
    mission_name
    launch_date_utc
    details
    rocket {
      rocket_name
      rocket_type
      first_stage {
        cores {
          core_serial
          reused
        }
      }
    }
    ships {
      name
      home_port
      image
    }
  }
}
`;

export default function () {
	// Execute a simple query
	executeGraphQLQuery(QUERY_LAUNCHES, { limit: 10 }, 'query', 'GetLaunches');
	sleep(1);

	// Execute a complex nested query
	executeGraphQLQuery(QUERY_COMPLEX, { id: '1' }, 'query', 'GetLaunchDetails');
	sleep(1);

	// Execute a mutation (if your API supports it)
	// executeGraphQLQuery(MUTATION_EXAMPLE, 
	//   { name: 'Test User', email: `test${Date.now()}@example.com` }, 
	//   'mutation', 
	//   'CreateUser'
	// );
}

/**
 * Helper function to execute GraphQL operations
 * @param {string} query - The GraphQL query or mutation string
 * @param {object} variables - Variables for the GraphQL operation
 * @param {string} operationType - 'query' or 'mutation'
 * @param {string} operationName - Name of the operation for tagging
 */
function executeGraphQLQuery(query, variables, operationType, operationName) {
	const payload = JSON.stringify({
		query: query,
		variables: variables,
	});

	const params = {
		headers: {
			'Content-Type': 'application/json',
			// Add authentication headers if needed
			// 'Authorization': 'Bearer YOUR_TOKEN',
		},
		tags: {
			operation: operationType,
			name: operationName,
		},
	};

	const response = http.post(GRAPHQL_URL, payload, params);

	// Check for successful response
	check(response, {
		[`${operationName}: status is 200`]: (r) => r.status === 200,
		[`${operationName}: no GraphQL errors`]: (r) => {
			try {
				const body = JSON.parse(r.body);
				return !body.errors || body.errors.length === 0;
			} catch (e) {
				return false;
			}
		},
		[`${operationName}: has data`]: (r) => {
			try {
				const body = JSON.parse(r.body);
				return body.data !== null && body.data !== undefined;
			} catch (e) {
				return false;
			}
		},
		[`${operationName}: response time OK`]: (r) => r.timings.duration < 3000,
	});

	// Optional: Log errors for debugging
	if (response.status !== 200) {
		console.error(`GraphQL ${operationType} failed:`, response.body);
	}
}

/**
 * Best Practices for GraphQL Load Testing:
 * 
 * 1. Test different query complexities (shallow vs deeply nested)
 * 2. Measure field-level performance with specific tags
 * 3. Test with realistic data sizes (pagination limits)
 * 4. Include error scenarios (invalid queries, missing fields)
 * 5. Test subscription endpoints separately (WebSocket tests)
 * 6. Monitor query complexity and depth limits
 * 7. Test batched queries if your API supports them
 * 8. Verify caching behavior (DataLoader, Redis)
 * 9. Test with authentication and authorization
 * 10. Monitor for N+1 query problems
 */
