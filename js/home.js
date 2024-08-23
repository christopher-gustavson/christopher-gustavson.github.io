const optimizelyClient = window.optimizelySdk.createInstance({
    sdkKey: 'JnAuUBx7dZUdibLcw9kPm'
});

optimizelyClient.onReady().then(() => {

    // generate a random user ID
    let userId = 'abc123';
    // add user attribute
    let attributes = {
        seen_test: true
    };
    // create a user context
    let user = optimizelyClient.createUserContext(userId, attributes);

    // add your feature's experiment rule key
    let decision = user.decide('banner_test');
    let featureEnabled = decision.enabled;
    let variableString = decision.variables['message'];
    let variationKey = decision.variationKey;
    // did decision fail with a critical error?
    if (variationKey === null) {
        console.log(' decision error: ', decision['reasons']);
    }
    // flip a coin to determine if a visitor will track an event
    let trackConversion = false;

    // log whether visitor got the feature, and which variation and feature variable they got
    if (featureEnabled) {
        var banner = '<div class="top-banner" style="background-color: blue;color: #fff; padding: 3px; font-weight: bold; text-align: center; font-size: 14px; height: 30px;">' + variableString + '</div>'
        document.querySelector('#myNavbar').insertAdjacentHTML('afterbegin', banner);
        console.log(`\nFeature test activated. User ${user.getUserId()} saw flag variation: ${variationKey} and got the message: ${variableString}`);
        // fire a conversion event, depending on the prior coin flip
        if (trackConversion) {
            user.trackEvent('user_converted');
            console.log(`\nUser ${user.getUserId()} converted.`)
        };
    } else {
        console.log(`\nUser ${user.getUserId()} failed traffic allocation.`)
    };

});