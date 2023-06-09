describe('Rightmove', () => {

    let data;
    before(() => {
        cy.fixture('data').then((fData) => {
            data = fData;
        });
    });

        beforeEach(() => {
            cy.visit(`${Cypress.config('baseUrl')}`)
            cy.viewport(1280, 720)
        })

        it('should allow the user to allow all cookies', () => {
            cy.get('.optanon-alert-box-bg').should('be.visible').within(() => {
                cy.get('.optanon-alert-box-title').should('have.text', 'Cookie settings')
                cy.get('#alert-box-message').should('contain.text', data.cookiesMessage)
                cy.get('.optanon-alert-box-button.optanon-button-allow')
                    .should('have.text', 'Allow all cookies')
                    .click()
            })
        })

        it('should return a list of search results after entering a single letter', () => {
            const searchTerm = 'H'
            cy.get('.ta_searchPanelContainer').should('be.visible')
            cy.get('input[name=typeAheadInputField]').type(searchTerm)
            cy.get('.ksc_resultsList')
                .should('be.visible')
                .find('li')
                .should('have.length.greaterThan', 1)
        })

        it("should return 'No matches found' text after entering a full stop", () => {
            const searchTerm = '.'
            cy.get('.ta_searchPanelContainer').should('be.visible')
            cy.get('input[name=typeAheadInputField]').type(searchTerm)
            cy.get('.ksc_resultsList')
                .should('be.visible')
                .find('li')
                .should('have.length', 1)
                .should('have.text', 'No matches found')
        })

        it('should allow the user to search for a property For Sale using the name of a town', () => {
            const forSaleSearchTerm = 'Romford, London'
            cy.get('.ta_searchPanelContainer').should('be.visible')
            cy.get('input[name=typeAheadInputField]').type(forSaleSearchTerm)
            cy.get('button.searchPanelControls').contains('For Sale').click()
            cy.url().should('include', '/property-for-sale/')
            cy.get('h1').should('contain.text', 'property for sale in Romford, London')
            cy.get('#submit').should('have.text', 'Find properties').click()
        })

        it('should allow the user to search for a property For Rent using a partial postcode', () => {
            const toRentSearchTerm = 'ub10'
            cy.get('.ta_searchPanelContainer').should('be.visible')
            cy.get('input[name=typeAheadInputField]').type(toRentSearchTerm)
            cy.get('button.searchPanelControls').contains('To Rent').click()
            cy.url().should('include', '/property-to-rent/')
            cy.get('h1').should('contain.text', 'property to rent in UB10')
            cy.get('#submit').should('have.text', 'Find properties').click()
        })

        it("should allow the user to visit the 'Investors' section from the 'Buy' menu option", () => {
            cy.get('.seo-nav').should('be.visible')
            cy.get('a[data-nav=buy]').should('have.text', 'Buy').trigger('mouseover')
            cy.get('.seo-nav-item.buy.active-nav').should('be.visible')
            cy.get('.seo-nav-subNav-link').contains('Investors').click()
            cy.url().should('include', '/guides/landlord/investor-newsletter/')
            cy.get('h1').should('have.text', 'Do you get our investor newsletter?')
        })

        it('should allow the user to customise their search', () => {
            const forSaleSearchTerm = 'Hayes & Harlington Station'
            cy.get('.ta_searchPanelContainer').should('be.visible')
            cy.get('input[name=typeAheadInputField]').type(forSaleSearchTerm)
            cy.get('button.searchPanelControls').contains('For Sale').click()
            cy.url().should('include', '/property-for-sale/search.html?')
            cy.get('h1').should('contain.text', 'property for sale near Hayes & Harlington Station, Hayes, Middlesex')

            cy.get('select[id=radius]').select('Within 5 miles')
            cy.get('select[id=minPrice]').select('600,000')
            cy.get('select[id=maxPrice]').select('2,000,000')
            cy.get('select[id=minBedrooms]').select('3')
            cy.get('select[id=maxBedrooms]').select('5')
            cy.get('select[id=displayPropertyType]').select('Houses')
            cy.get('select[id=maxDaysSinceAdded]').select('Last 14 days')
            cy.get('label[for=includeSSTC]').should('have.text', 'Include Under Offer, Sold STC...').click()

            cy.get('#submit').should('have.text', 'Find properties').click()
            cy.url().should('include', '/property-for-sale/find.html?')
            cy.get('[data-test="header-title"]').should('have.text', 'Houses For Sale near Hayes & Harlington Station, Hayes, Middlesex, within 5 miles, £600,000 – £2,000,000, added in the last 14 days, including sold STC, 3 – 5 bed')
        })
    })
