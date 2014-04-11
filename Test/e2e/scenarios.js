describe('Commission Application', function() {

    it('should automatically redirect to /submitSales as the default route', function() {
        browser().navigateTo('/');
        expect(browser().location().path()).toBe('/submitSales');
    });

    describe('Submit Sales',function() {
        beforeEach(function() {
            browser().navigateTo('/events');
        });

        it('should render the SubmitSales page', function() {
            expect(element('h1:first').text()).toMatch(/Stub's GunBook/);
            expect(element('h2:first').text()).toMatch(/Submit your sales for a town/);
        });
    });

    describe('View Report',function() {
        beforeEach(function() {
            browser().navigateTo('#/salesReport');
        });

        it('should render the View Report page', function() {
            expect(element('h1:first').text()).toMatch(/Stub's GunBook/);
            expect(element('h2:first').text()).toMatch(/Here's your sales report for this month/);
        });

        it('should have 26 sales', function() {
            expect(repeater('tbody').count()).toBe(26);
        });
    });

    describe('Admin',function() {
        beforeEach(function() {
            browser().navigateTo('#/admin');
        });

        it('should render the View Report page', function() {
            expect(element('h1:first').text()).toMatch(/Stub's GunBook/);
            expect(element('h2:first').text()).toMatch(/Welcome to the Awesome Admin Panel/);
        });
    });


    describe('Navigation', function() {

        it('should navigate to /admin when admin is clicked', function() {
            element('nav ul li:nth-child(6) a').click();
            expect(browser().location().path()).toBe('/admin');
        });

        it('should navigate to /salesReport when View Report is clicked', function() {
            element('nav ul li:nth-child(4) a').click();
            expect(browser().location().path()).toBe('/salesReport');
        });

        it('should navigate to /submitSales when Submit Sales is clicked', function() {
            element('nav ul li:nth-child(2) a').click();
            expect(browser().location().path()).toBe('/submitSales');
        });
    });

});