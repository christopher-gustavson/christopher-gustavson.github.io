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
        let attributes;
        if (localStorage.attributes) {
            attributes = JSON.parse(localStorage.attributes);
        }
        if (!attributes) {
            // attributes = { seen_test: false };
            attributes = {};
            localStorage.setItem('attributes', JSON.stringify(attributes));
        }

        const user = optimizelyClient.createUserContext(userId, attributes);
        if (!user) {
            throw new Error('failed to create user context');
        }
        // set additional options in a decide call
        let decisions = user.decideAll([
            window.optimizelySdk.OptimizelyDecideOption.DISABLE_DECISION_EVENT,
            window.optimizelySdk.OptimizelyDecideOption.ENABLED_FLAGS_ONLY
        ]);
        const flagKeys = Object.keys(decisions);
        //console.log('keys', flagKeys);
        let decisionForTest = decisions['banner_test'];
        console.log('decisionForTest', decisionForTest);
        if (decisionForTest) {
            if (decisionForTest.userContext.attributes.seen_test == true) {
                console.log('Visitor saw experience: ' + decisionForTest.flagKey);
                document.querySelector('h2').innerText = "Seen Banner Test";
            } else {
                console.log('Visitor didnt see experience: ' + decisionForTest.flagKey);
            }
            if (decisionForTest.userContext.attributes.seen_test) {
                console.log('attribute "seen_test" has value of: ' + decisionForTest.userContext.attributes.seen_test);
            } else {
                console.log('attribute "seen_test" does not exist');
            }
            //}
        } else {
            console.log('Visitor did not qualify for the test');
        }

    }).catch((err) => {
        // handle error
    });
} else {
    // handle instantiation error
}
