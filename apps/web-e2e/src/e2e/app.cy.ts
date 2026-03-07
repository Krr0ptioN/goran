import {
    generateTestEmail,
    generateTestPassword,
    generateTestUsername,
} from '@goran/utils';

describe('auth flows', () => {
    const getCredentials = () => ({
        email: generateTestEmail(),
        username: generateTestUsername(),
        password: generateTestPassword(),
    });

    it('redirects guests from home to sign-in', () => {
        cy.visit('/');

        cy.location('pathname').should('eq', '/sign-in');
        cy.contains('h1', 'Sign In').should('be.visible');
    });

    it('allows navigating between sign-in and sign-up', () => {
        cy.visit('/sign-in');

        cy.contains('a', 'Sign up').click();
        cy.location('pathname').should('eq', '/sign-up');
        cy.contains('h1', 'Sign Up').should('be.visible');

        cy.contains('a', 'Sign In').click();
        cy.location('pathname').should('eq', '/sign-in');
        cy.contains('h1', 'Sign In').should('be.visible');
    });

    it('shows sign-in validation errors for missing credentials', () => {
        cy.visit('/sign-in');

        cy.contains('button', 'Sign In').click();

        cy.contains('Password is required').should('be.visible');
    });

    it('shows sign-up validation errors for weak credentials', () => {
        cy.visit('/sign-up');

        cy.get('input[name="username"]').type('abc');
        cy.get('input[name="password"]').type('weak');

        cy.contains('button', 'Sign Up').click();

        cy.contains('Name must be at least 2 characters long.').should(
            'be.visible',
        );
        cy.contains('Please enter a valid email.').should('be.visible');
        cy.contains('Be at least 8 characters long').should('be.visible');
    });

    it('signs up successfully and creates session cookies', () => {
        const creds = getCredentials();

        cy.visit('/sign-up');

        cy.get('input[name="username"]').type(creds.username);
        cy.get('input[name="email"]').type(creds.email);
        cy.get('input[name="password"]').type(creds.password);

        cy.contains('button', 'Sign Up').click();

        cy.location('pathname').should('eq', '/');
        cy.getCookie('session-access').should('exist');
        cy.getCookie('session-refresh').should('exist');
    });

    it('signs in successfully with existing account', () => {
        const creds = getCredentials();

        cy.visit('/sign-up');
        cy.get('input[name="username"]').type(creds.username);
        cy.get('input[name="email"]').type(creds.email);
        cy.get('input[name="password"]').type(creds.password);
        cy.contains('button', 'Sign Up').click();
        cy.location('pathname').should('eq', '/');

        cy.clearCookie('session-access');
        cy.clearCookie('session-refresh');

        cy.visit('/sign-in');
        cy.get('input[name="email"]').type(creds.email);
        cy.get('input[name="password"]').type(creds.password);

        cy.contains('button', 'Sign In').click();

        cy.location('pathname').should('eq', '/');
        cy.getCookie('session-access').should('exist');
        cy.getCookie('session-refresh').should('exist');
    });
});
