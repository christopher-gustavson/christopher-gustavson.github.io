// set global default decide options when initializing the client
const optimizelyClient = window.optimizelySdk.createInstance({
    sdkKey: 'JnAuUBx7dZUdibLcw9kPm',
    defaultDecideOptions: [OptimizelyDecideOption.DISABLE_DECISION_EVENT],
});

if (optimizelyClient) {
    optimizelyClient.onReady().then(({ success, reason }) => {
        if (!success) {
            throw new Error(reason);
        }

        const user = optimizelyClient.createUserContext('abc123');
        if (!user) {
            throw new Error('failed to create user context');
        }

        // set additional options in a decide call
        const decisionResults = user.decideAll(
            [
                OptimizelyDecideOption.ENABLED_FLAGS_ONLY,
                OptimizelyDecideOption.IGNORE_USER_PROFILE_SERVICE,
            ]
        );

        console.log('decisionResults', decisionResults);
    }).catch((err) => {
        // handle error
    });
} else {
    // handle instantiation error
}