describe('auth flows', () => {
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
});
