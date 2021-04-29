/// <reference path="../support/index.d.ts" />

describe('Main page', () => {
    const url = 'https://czyfryzjerzyotwarci.pl'; //TODO: change to local address after implementing local build + serve
    beforeEach(() => {
        cy.visit(url, {
            onBeforeLoad (win) {
              const latitude = 53.1333336;
              const longitude = 23.1279574;
              cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
                return cb({ coords: { latitude, longitude } });
              });
            }
        });
    });

    it('should hide the tooltip', () => {
        cy.get('#tooltip').should('not.be.visible');
    });

    it('should show state select', () => {
        cy.get('#stateSelect').should('be.visible')
    });

    it('should display answer based on location', () => {
        cy.get('#answer', {timeout: 10000}).contains(/^TAK$|^NIE$/);
    });

    it('should present correct answer based on a selected state', () => {
        cy.fixture('states').as('states');
        cy.get('@states').then((states:any) => {
            states.forEach(state => {
                cy.get('#stateSelect').select(state.name);
                let expectedAnswer = state.enabled ? 'TAK' : 'NIE';
                cy.get('#answer').should('have.text', expectedAnswer);
            });
        });
    });
});
