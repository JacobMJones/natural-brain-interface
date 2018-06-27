var BrainJSClassifier = require("natural-brain");
var classifier = new BrainJSClassifier();
const fs = require('fs');

const createEmptyJson = (name, content) => {
    typeof name === 'string' ? fs.writeFileSync(`${name}.json`, `${content}`) : console.log('create file failed')
}

// saves classifier to filename
// const saveClassifier = filename => {
//   classifier.save(filename, function(err, classifier) {});
// };
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




const loadedCB = (error, classifier) => {

    console.log(classifier.classify("Wow so good"));
    console.log(classifier.classify("That was bad food"));

};
loadClassifier('classifier.json', loadedCB)
const retrainClassifier = (error, classifier) => {
    console.log("retraining");
    classifier.addDocument("i love pie", "food");
    console.log("new feature added");
    classifier.retrain();
    saveClassifier('classifier.json')
    return Promise.resolve('success');
}

const createNewClassifier = () => {
    return new Promise((resolve, reject) => {
        classifier.addDocument("my unit-tests failed.", "software");
        // classifier.addDocument("tried the program, but it was buggy.", "software");
        // classifier.addDocument("tomorrow we will do standup.", "meeting");
        // classifier.addDocument("the drive has a 2TB capacity.", "hardware");
        // classifier.addDocument("i need a new power supply.", "hardware");
        // classifier.addDocument("can you play some new music?", "music");
        classifier.train();
        // console.log('classifier trained')
        saveClassifier("classifier.json");
        //console.log('classifier saved')
        resolve()
    })
};


const prepareDataSet = (dataSet) => {
    //console.log('in prepareDataSet');
    var parsedArray = fs.readFileSync(dataSet).toString().split("\n");;
    finalArray = [];
    for (var i = 0; i < 20; i++) {
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
    classifier.train();
    saveClassifier('classifier.json');
    // console.log(dataSet[0])

}




//prepareDataSet('yelp.txt');


// const createNewClassifier = async() => {
//     classifier.addDocument("my unit-tests failed.", "software");
//     // classifier.addDocument("tried the program, but it was buggy.", "software");
//     // classifier.addDocument("tomorrow we will do standup.", "meeting");
//     // classifier.addDocument("the drive has a 2TB capacity.", "hardware");
//     // classifier.addDocument("i need a new power supply.", "hardware");
//     // classifier.addDocument("can you play some new music?", "music");
//     classifier.train();
//     console.log('classifier trained')
//     saveClassifier("classifier.json");
//     console.log('classifier saved')
//     return
// };

const foo = () => {
    createNewClassifier().then(loadCB)
}

// const foo = async() => {
//     await createNewClassifier()
//     loadCB
// }


createNewClassifier()
    .then(r => { loadClassifier('classifier.json', loadedCB) })


// .then(r => {loadClassifier('classifier.json', retrainClassifier)})
// .then(r => {loadClassifier('classifier.json', loadedCB)})

// createWhole
// .then(saveClassifier('classifier.json'))
// .then(r => {loadClassifier('classifier.json', loadedCB)})
// .then(r => {loadClassifier('classifier.json', retrainClassifier)})
// .then(r => {loadClassifier('classifier.json', loadedCB)})


let createWhole = new Promise((resolve, reject) => {
    classifier.addDocument("my unit-tests failed.", "software");
    classifier.addDocument("tried the program, but it was buggy.", "software");
    classifier.addDocument("tomorrow we will do standup.", "meeting");
    classifier.addDocument("the drive has a 2TB capacity.", "hardware");
    classifier.addDocument("i need a new power supply.", "hardware");
    classifier.addDocument("can you play some new music?", "music");
    classifier.addDocument("pie is my greatest love", "food");
    classifier.train();
    resolve('success')
        //   // saveClassifier("classifier.json");
})