var BrainJSClassifier = require("natural-brain");
const fs = require('fs');
var sw = require('./stopwords.js');

const createClassifier = (name) => {
    typeof name === 'string' ? fs.writeFileSync(`${name}.json`, '') : console.log('create file failed')
    let file = `${name}.json`;
    const classifier = new BrainJSClassifier();
    classifier.addDocument("Pizza is tasty", "positive");
    classifier.train();
    saveClassifier(file, classifier);
}

const saveClassifier = (filename, classifier) => {
    console.log('in save', classifier);
    classifier.save(filename, (err, classifier) => {
        if (err) {
            reject(err)
            return
        }
        console.log('classifier', classifier);
    })
}

const loadClassifier = (filename, cb) => {
    BrainJSClassifier.load(filename, null, null, cb);
};

const testCB = (error, classifier) => {
    console.log(classifier);
    console.log("The candy was bad\n", classifier.getClassifications("The candy was bad"));
    //console.log("The food was good\n", classifier.getClassifications("The food was good"));
    //console.log("The candy was not bad\n", classifier.getClassifications("The food was not good not bad"));
};
//currying: const addSingleDocument = (content, sentiment) => (error, classifier) => {
const addSingleDocument = (error, classifier, content, sentiment, file) => {
    console.log('in add single', content, sentiment);
    content = removeStopWords(content);
    dataObject = {};
    dataObject.content = content;
    dataObject.sentiment = sentiment;
    addDataSet([dataObject], classifier, file);
}
const addManyDocuments = (error, classifier, file) => {
    var parsedArray = fs.readFileSync('yelp.txt').toString().split("\n");;
    finalArray = [];
    for (var i = 100; i < 200; i++) {
        console.log(i);
        let dataPoint = parsedArray[i];
        let match = dataPoint.match(/(.*)\s(0|1)$/)
        dataObject = {};

        //match 1 has content and match 2 has sentiment
        let content = match[1];
        content = removeStopWords(content);
        dataObject.content = content;

        match[2] == 1 ? dataObject.sentiment = 'positive' : dataObject.sentiment = 'negative';
        finalArray.push(dataObject);
    }
    console.log("classifer in prepare dataset");
    addDataSet(finalArray, classifier, file);
}

const removeStopWords = (content) => {

    return content.split(' ').filter(word => sw.stops().indexOf(word.toLowerCase()) == -1).join(' ');
}

function is_in_array(s, your_array) {
    for (var i = 0; i < your_array.length; i++) {
        if (your_array[i].toLowerCase() === s.toLowerCase()) return true;
    }
    return false;
}

const retrainClassifier = (error, classifier) => {
    console.log("retraining");
    prepareDataSet('yelp.txt')
    console.log("new feature added");


    classifier.retrain();
    saveClassifier('classifier.json')
}
const addDataSet = (dataSet, classifier, file) => {
    console.log('add data classififer', classifier)
    console.time();
    dataSet.forEach(function(item) {
        classifier.addDocument(item.content, item.sentiment);
    });
    console.timeEnd();
    console.time();
    classifier.retrain();
    console.timeEnd();
    saveClassifier(file, classifier);
}

//add to test
//manually add document
const start = (argv) => {
    const command = argv[2];
    switch (command) {
        case 'many':
            console.log('in new');
            // loadClassifier(argv[3], prepareDataSet);
            loadClassifier(argv[3], (error, classifier) => addManyDocuments(error, classifier, argv[3]));
            break;
        case 'test':
            loadClassifier(argv[3], testCB);
            break;
        case 'add':
            loadClassifier('classifier.json', retrainClassifier);
            break;
        case 'set':
            loadClassifier(argv[3], testCB);
        case 'one':
            loadClassifier(argv[3], (error, classifier) => addSingleDocument(error, classifier, argv[4], argv[5], argv[3]));
            // currying: loadClassifier(argv[3], addSingleDocument(argv[4], argv[5]));
            break;
        case 'new':
            createClassifier(argv[3]);
            break;
    }
}
console.log(start(process.argv));