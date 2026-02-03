const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "captions.json");

/* returns a random image and caption as an object with following variables:
* - image: the filename (extension included) of the image
* - caption: the caption belonging with this image
* - captionNumber: the index in the captions array (upvoting and downvoting require this)
* - votes: total votes (upvote +1, downvote -1)
*/
const getRandomImageCaption = () => {
    const data = readData();

    if (data.length === 0) {
        return { image: null, caption: "No data yet!", captionNumber: null, votes: 0 };
    }

    const imageIndex = Math.floor(Math.random() * data.length);
    const randomImage = data[imageIndex];

    const captionIndex = Math.floor(Math.random() * randomImage.captions.length);

    return{
        image: randomImage.image,
        caption: randomImage.captions[captionIndex].caption,
        captionNumber: captionIndex,
        votes: randomImage.captions[captionIndex].votes
    };
}

// Add a new caption to the image specified by imageName
const addCaption = (imageName, captionText) => {
    const data = readData();

    for(let image of data) {
        if(image.image == imageName) {
            const newCaption = { caption: captionText, votes: 0 };
            image.captions.push(newCaption);
        }
    }
    
    writeData(data);
}

// Change the number of votes for specific caption (+1 for upvote, -1 for downvote)
const changeVotes = (imageName, captionNumber, voteChange) => {
    const data = readData();

    for(let image of data) {
        if(image.image == imageName) {
            image.captions[captionNumber].votes += voteChange;
        }
    }
    
    writeData(data);
}

// Read JSON data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Write JSON data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

module.exports = {getRandomImageCaption, addCaption, changeVotes};