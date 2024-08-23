const optimizelyClient = window.optimizelySdk.createInstance({
    sdkKey: 'JnAuUBx7dZUdibLcw9kPm'
});

optimizelyClient.onReady().then(() => {

    // generate a random user ID
    let userId = 'abc123';
    // add user attribute
    // create a user context
    let user = optimizelyClient.createUserContext(userId);

    const decisionResults = user.decideAll([OptimizelyDecideOption.DISABLE_DECISION_EVENT]);
    console.log('decisionResults', decisionResults);

});