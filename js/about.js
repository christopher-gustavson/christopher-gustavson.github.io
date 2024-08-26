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

        let attributes;
        if (localStorage.attributes) {
            attributes = JSON.parse(localStorage.attributes);
        }
        if (!attributes.length) {
            attributes = { seen_test: true };
            localStorage.setItem('attributes', JSON.stringify(attributes));
        }

        const user = optimizelyClient.createUserContext('abc123', attributes);
        if (!user) {
            throw new Error('failed to create user context');
        }
        // set additional options in a decide call
        let decisions = user.decideAll();
        decisions = user.decideAll([indow.optimizelySdk.OptimizelyDecideOption.ENABLED_FLAGS_ONLY]);
        const flagKeys = Object.keys(decisions);
        const decisionForBanner = decisions['banner_test'];
        console.log('decisionForBanner', decisionForBanner);
    }).catch((err) => {
        // handle error
    });
} else {
    // handle instantiation error
}
