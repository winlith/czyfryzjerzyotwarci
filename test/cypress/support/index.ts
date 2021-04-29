// Cypress.Commands.add('mockGeolocation', (latitude: number, longitude: number) => {
// 	cy.window().then(($window) =>  {
// 		cy.stub($window.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
// 	   		return callback({ coords: { latitude, longitude } });
// 		});
// 	});
// });