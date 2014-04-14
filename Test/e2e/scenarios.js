describe('Commission Application', function() {

/*    beforeEach(function() {
        browser().navigateTo('/');
        if (element('nav ul li:nth-child(6) a').exists()) {
            element('nav ul li:nth-child(6) a').click();
        };      
    });*/
/*
    it('should render the landing page', function() {
        browser().navigateTo('/');
        expect(element('h1:first').text()).toMatch(/Welcome to Stub's/);
        expect(element('a, .button').text()).toMatch(/Login/);
        expect(element('a, .button').text()).toMatch(/Signup/);
    });
*/
    describe('Logging In As A Regular User', function(){
        beforeEach(function() {
            browser().navigateTo('/login');
            pause();
            expect(element('h1:first').text()).toMatch(/Sign In/);
            input('user.Email').enter('keoghpe@tcd.ie');
            input('user.Password').enter('password');
            element(':button').click();
            pause();
            browser().navigateTo('/profile');
            pause();
        });

        afterEach(function (argument) {
            element('nav ul li:nth-child(6) a').click();
            pause(100);
        });

       it('should log in', function () {
            expect(browser().location().path()).toBe('/submitSales');
            expect(element('h1').text()).toMatch(/Stub's GunBook/);
            expect(element('nav ul li:nth-child(6) a').text()).toMatch(/Log Out/);
        });

        it('should log in', function () {

            element('nav ul li:nth-child(4) a').click();
            pause();
            browser().navigateTo('/profile');
            pause();
            expect(element('h1').text()).toMatch(/Stub's GunBook/);
            expect(element('nav ul li:nth-child(6) a').text()).toMatch(/Log Out/);
            expect(element('h2').text()).toMatch(/Here's your sales reports for this year/);
        });


    });

    
/*
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
*/
});