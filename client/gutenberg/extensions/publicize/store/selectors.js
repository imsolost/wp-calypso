/**
 * Returns the failed Publicize connections.
 *
 * @param {Object} state State object.
 *
 * @return {Array} List of connections.
 */
export function getFailedConnections( state ) {
	return state.filter( connection => ! connection.test_success );
}

/**
 * Returns Publicize connections that require reauthentication from users. For example, when LinkedIn switched its API from v1 to v2.
 *
 * @param {Object} state State object.
 *
 * @return {Array} List of connections.
 */
export function getMustReauthConnections( state ) {
	return state
		.filter( connection => connection.must_reauth )
		.map( connection => connection.service_name );
}
