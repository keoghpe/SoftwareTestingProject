describe('Commission Application', function() {

    describe('Logging In As A Regular User', function(){
        beforeEach(function() {
            browser().navigateTo('/login');
            pause();
            expect(element('h1:first').text()).toMatch(/Sign In/);
            input('user.Email').enter('keoghpe@tcd.ie');
            input('user.Password').enter('password');
            element(':button').click();
            pause();
        });

        afterEach(function (argument) {
            element('nav ul li:nth-child(6) a').click();
            pause(100);
        });

       it('should log in and render the submit sales page', function () {
            expect(browser().location().path()).toBe('/submitSales');
            expect(element('h1').text()).toMatch(/Stub's GunBook/);
            expect(element('nav ul li:nth-child(6) a').text()).toMatch(/Log Out/);
            pause();
        });

        it('should log in and navigate to the sales report page', function () {

            element('nav ul li:nth-child(4) a').click();
            pause();
            expect(element('h1').text()).toMatch(/Stub's GunBook/);
            expect(element('nav ul li:nth-child(6) a').text()).toMatch(/Log Out/);
            expect(element('h2').text()).toMatch(/Here's your sales reports for this year/);
            pause();
        });


    });


    describe('Logging In As Admin', function(){
        beforeEach(function() {
            browser().navigateTo('/login');
            pause();
            expect(element('h1:first').text()).toMatch(/Sign In/);
            input('user.Email').enter('admin@admin.com');
            input('user.Password').enter('password');
            element(':button').click();
            pause();
        });

        afterEach(function (argument) {
            element('nav ul li:nth-child(6) a').click();
            pause(100);
        });

       it('should log in and render the admin page', function () {
            expect(browser().location().path()).toBe('/admin');
            expect(element('h1').text()).toMatch(/Stub's GunBook/);
            expect(element('h2').text()).toMatch(/Welcome to the Awesome Admin Panel/);
            expect(element('nav ul li:nth-child(6) a').text()).toMatch(/Log Out/);
            pause();
        });

        it('should log in and render the sales reports ', function () {

            element('nav ul li:nth-child(2) a').click();
            pause();
            expect(element('h1').text()).toMatch(/Stub's GunBook/);
            expect(element('nav ul li:nth-child(6) a').text()).toMatch(/Log Out/);
            expect(element('h2').text()).toMatch(/Here's your sales reports for this year/);
            pause();
        });


    });

});