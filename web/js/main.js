const fx_optimizely = window.optimizelySdk.createInstance({
  sdkKey: 'JDDLtDrUVRMiVyehp6aqK'
});

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

if (fx_optimizely) {
    fx_optimizely.onReady().then(({ success, reason }) => {
        if (!success) {
            throw new Error(reason);
        }
        // set user ID
        let userId = getCookie('optimizelyEndUserId') || 'abc123';
        console.log('FX User ID: ', userId);

        // add user attribute
        let fx_attributes = {};
        if (localStorage.fx_attributes) {
            if (localStorage.fx_attributes != '{}') {
                fx_attributes = JSON.parse(localStorage.fx_attributes);
            }
        } else {
            //fx_attributes = {};
            fx_attributes = { 'state': 'OR','qa-group':'false' };
            localStorage.setItem('fx_attributes', JSON.stringify(fx_attributes));
        }
        console.log('Optimizely attributes', fx_attributes);

        // create a user context
        let user = fx_optimizely.createUserContext(userId, fx_attributes);

        // add your feature's experiment rule key
        let decision = user.decide('banner_test');
        let featureEnabled = decision.enabled;
        let variableString = decision.variables['message'];
        let variableCtaString = decision.variables['cta_message'];
        let variableUrlString = decision.variables['url_string'];
        let variationKey = decision.variationKey;
        // did decision fail with a critical error?
        if (variationKey === null) {
            console.log(' decision error: ', decision['reasons']);
        } else {
            console.log('decision',decision);
        }
        // flip a coin to determine if a visitor will track an event
        let trackConversion = false;

        // log whether visitor got the feature, and which variation and feature variable they got
        if (featureEnabled) {
            var banner = '<div class="top-banner" style="background-color: blue;color: #fff; padding: 3px; font-weight: bold; text-align: center; font-size: 14px; height: 30px;">' + variableString + ' <a data-event="purchase-order" href="' + variableUrlString + '">' + variableCtaString + '</a></div>'
            document.querySelector('#myNavbar').insertAdjacentHTML('afterbegin', banner);
            console.log(`\nOptimizely Feature test activated. User ${user.getUserId()} saw flag variation: ${variationKey} and got the message: ${variableString}`);
            // fire a conversion event, depending on the prior coin flip
            if (trackConversion) {
                user.trackEvent('user_converted');
                console.log(`\nOptimizely User ${user.getUserId()} converted.`)
            };
        } else {
            console.log(`\nUser ${user.getUserId()} failed traffic allocation.`)
        };
    }).catch((err) => {
        // handle error
    });
} else {
    // handle instantiation error
    console.warn('Optimizely FX Not instantiated');
}

tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#9333ea',
                neutral: {
                    100: '#f3f4f6',
                    800: '#1f2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite'
            }
        }
    }
}

