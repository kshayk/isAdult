(() => {

    // ML5 Loading Code

    const makeid = length => {
        const VALID_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let id = "";

        for (let i = 0; i < length; i++) {
            id += VALID_CHARACTERS.charAt(Math.floor(Math.random() * VALID_CHARACTERS.length));
        }

        return id;
    };

    const loadScript = new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/ml5@0.1.1/dist/ml5.min.js";
        script.id = makeid(7);
        document.body.appendChild(script);
        resolve(script.id);
    });

    const ml5Ready = () => new Promise(resolve => {
        const checkMl5 = () => {
            if (ml5) {
                clearInterval(mlLoaded);
                resolve();
            }
        };
        const mlLoaded = setInterval(checkMl5, 1000);
    });

    const classifyImage = async imgElement => {
        const scriptId = await loadScript;
        const scriptElement = document.getElementById(scriptId);

        if (!scriptElement) {
            throwImageClassifierError(`Could not load dynamic script into the HTML`);
        }

        let classifier;

        try {
            await ml5Ready();

            classifier = await ml5.imageClassifier('MobileNet');
        } catch (e) {
            throwImageClassifierError(`Failed to load the ml5 classifier module`);
        }

        try {
            return classifier.predict(imgElement);
        } catch (e) {
            throwImageClassifierError(`This image could not be parsed.`);
        }
    };

    // Classification Processing Code

    const NO_RISK_STATUS = 1;
    const MEDIUM_RISK_STATUS = 2;
    const HIGH_RISK_STATUS = 3;

    const STATUS_MESSAGES = {
        [NO_RISK_STATUS]: "No risk",
        [MEDIUM_RISK_STATUS]: "Medium risk. It is recommended to manually check this image",
        [HIGH_RISK_STATUS]: "High risk. This image is being flagged to most likely be an adult image",
    };

    const MEDIUM_RISK_KEYWORDS = [
        'tank suit', 'bathing trunks', 'swimming trunks', 'sarong', 'sunscreen', 'sunblock', 'sun blocker', 'diaper', 'nappy', 'napkin', 'miniskirt', 'dumbbell', 'plunger', 'plumber\'s helper',
    ];

    const HIGH_RISK_KEYWORDS = [
        'bikini', 'two-piece', 'maillot', 'brassiere', 'bandeau', 'balance beam', 'beam', 'punching bag', 'punch bag', 'punching ball', 'punchball',
    ];

    const statusAndMessage = status => ({ status, msg: STATUS_MESSAGES[status] });
    const throwImageClassifierError = err => { throw new Error(`Image classifier: ${err}`) };
    const categoriesIncludeKeywords = (categories, keywords) =>
        categories.filter(c => keywords.includes(c)).length > 0;

    window.checkAdultImage = async imgElement => {
        const results = await classifyImage(imgElement);

        const allCategories = results
            .map(r => r.className.split(', '))
            .reduce((acc, classNames) => [...acc, ...classNames], []);

        if (categoriesIncludeKeywords(allCategories, HIGH_RISK_KEYWORDS)) {
            return statusAndMessage(HIGH_RISK_STATUS)
        }

        if (categoriesIncludeKeywords(allCategories, MEDIUM_RISK_KEYWORDS)) {
            return statusAndMessage(MEDIUM_RISK_STATUS)
        }

        return statusAndMessage(NO_RISK_STATUS);
    };

    // Allow users to check what the status is without knowing the underlying values    

    Object.assign(window.checkAdultImage, { NO_RISK_STATUS, MEDIUM_RISK_STATUS, HIGH_RISK_STATUS });
})();
