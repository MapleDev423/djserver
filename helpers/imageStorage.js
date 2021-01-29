const Buffer = require('buffer').Buffer;
const path = require('path');
const fs = require('fs');
const contentDirectory = 'content/'
const contentThumbnailDirectory = 'contentThumbnail/'


function contentStorageToDirectory(rsaEncryptedContent, user_id, filename) {

    if (!fs.existsSync(contentDirectory)) {
        fs.mkdirSync(contentDirectory, { recursive: true })
    }

    const userDirectory = contentDirectory + user_id.toString()

    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory, { recursive: true })
    }

    let contentBuffer = Buffer.from(rsaEncryptedContent, 'base64');
    let contentPath = path.join(userDirectory, filename);

    fs.writeFile(contentPath, contentBuffer, function (error) {
        if (error) {
            return error;
        }
    });
    return contentPath
}

function contentThumbnailStorageToDirectory(unencryptedContentThumbnail, user_id, filename) {

    if (!fs.existsSync(contentThumbnailDirectory)) {
        fs.mkdirSync(contentThumbnailDirectory, { recursive: true })
    }

    const userDirectory = contentThumbnailDirectory + user_id.toString()

    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory, { recursive: true })
    }

    let contentBuffer = Buffer.from(unencryptedContentThumbnail, 'base64');
    let contentThumbnailPath = path.join(userDirectory, filename);

    fs.writeFile(contentThumbnailPath, contentBuffer, function (error) {
        if (error) {
            return error;
        }
    });
    return contentThumbnailPath;
}

module.exports = {
    contentStorageToDirectory: contentStorageToDirectory,
    contentThumbnailStorageToDirectory: contentThumbnailStorageToDirectory
}