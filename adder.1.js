var BrainJSClassifier = require("natural-brain");
var classifier = new BrainJSClassifier();
const fs = require('fs');

const createEmptyJson = (name, content) => {
    typeof name === 'string' ? fs.writeFileSync(`${name}.json`, `${content}`) : console.log('create file failed')
}

const saveClassifier = filename => {
        return new Promise((resolve, reject) => {
            classifier.save(filename, (err, classifier) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(classifier)
            })
        })
    }
    // loads classifier from filename, then does callback
const loadClassifier = (filename, cb) => {
    BrainJSClassifier.load(filename, null, null, cb);
};

const retrainClassifier = (error, classifier) => {
    console.log("retraining");
    prepareDataSet('yelp.txt')
    console.log("new feature added");


    classifier.retrain();
    saveClassifier('classifier.json')
}

const testData = () => {
    classifier.retrain();
    console.log(classifier.classify("The food was good"));
}

//testing here
const loadedCB = (error, classifier) => {

    console.log(classifier.classify("The only thing better than this Jimmy's, with its awesome staff, cool back room and delicious bevy options"));
    console.log(classifier.classify("The milk tea is terrible, it is one of the worst milk"));
    console.log(classifier.classify("The food was okay"));
    console.log(classifier.classify("The food was nothing special"));
    console.log(classifier.classify("I've had better but I've had worse"));

};




const prepareDataSet = (dataSet) => {
    //console.log('in prepareDataSet');
    var parsedArray = fs.readFileSync(dataSet).toString().split("\n");;
    finalArray = [];
    for (var i = 51; i < 100; i++) {
        let dataPoint = parsedArray[i];
        let match = dataPoint.match(/(.*)\s(0|1)$/)
        dataObject = {};
        dataObject.content = match[1];
        match[2] == 1 ? dataObject.sentiment = 'positive' : dataObject.sentiment = 'negative';
        finalArray.push(dataObject);
    }
    //console.log(finalArray);
    addDataSet(finalArray);
}
const addDataSet = (dataSet) => {

    dataSet.forEach(function(item) {
        classifier.addDocument(item.content, item.sentiment);
    });
    classifier.retrain();
    saveClassifier('classifier.json');
    // console.log(dataSet[0])

}

loadClassifier('classifier.json', retrainClassifier)
    // prepareDataSet('yelp.txt');
    // loadClassifier('classifier.json', loadedCB);