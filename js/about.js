// set global default decide options when initializing the client
const optimizelyClient = window.optimizelySdk.createInstance({
    sdkKey: 'JnAuUBx7dZUdibLcw9kPm',
    defaultDecideOptions: [window.optimizelySdk.OptimizelyDecideOption.DISABLE_DECISION_EVENT],
});

if (optimizelyClient) {
    optimizelyClient.onReady().then(({ success, reason }) => {
        if (!success) {
            throw new Error(reason);
        }
        let userId = 'abc123';
        let attributes = {};
        if (localStorage.attributes) {
            attributes = JSON.parse(localStorage.attributes);
        }
        if (attributes == {}) {
            attributes = { seen_test: false };
            localStorage.setItem('attributes', JSON.stringify(attributes));
        }

        const user = optimizelyClient.createUserContext(userId, attributes);
        if (!user) {
            throw new Error('failed to create user context');
        }
        // set additional options in a decide call
        let decisions = user.decideAll();
        decisions = user.decideAll([window.optimizelySdk.OptimizelyDecideOption.ENABLED_FLAGS_ONLY]);
        const flagKeys = Object.keys(decisions);
        let decisionForBanner = decisions['banner_test'];
        decisionForBanner = JSON.parse(decisionForBanner);
        if (decisionForBanner) {
            console.log('Visitor qualified for ' + decisionForBanner.flagKey);
        } else {
            console.log('Visitor did not qualify for test');
        }

    }).catch((err) => {
        // handle error
    });
} else {
    // handle instantiation error
}
