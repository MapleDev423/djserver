const DB = require('../db')

async function addNewSong(client,filename,playlistId,fileUrl) {
    return new Promise(function (resolve, reject) {
        client.query(`INSERT INTO songs (name, path, views, playlistId) VALUES ("${filename}", "${fileUrl}", 0, ${playlistId})`,
            function (error, result) {
                if (error) {
                    console.log("Error is", error)
                    reject(error);
                    return;
                }
                resolve(result);
            })
    })
}
async function removeSong(client,id) {
    return new Promise(function (resolve, reject) {
        client.query(`DELETE from songs WHERE id=${id}`,
            function (error, result) {
                if (error) {
                    console.log("Error is", error)
                    reject(error);
                    return;
                }
                resolve(result);
            })
    })
}


async function getSongInPlaylist(client, playlistID) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * from  songs where playlistId=${playlistID}`,
            function (error, result) {
                if (error) {
                    console.log("Error is", error)
                    reject(error);
                    return;
                }
                resolve(result);
            })
    })
}



async function updateSongCount(client, songId,viewCount) {
    return new Promise(function (resolve, reject) {
        client.query(`UPDATE songs SET views = ${viewCount}  WHERE id = ${songId}`,
            function (error, result) {
                if (error) {
                    console.log("Error is", error)
                    reject(error);
                    return;
                }
                resolve(result);
            })
    })
}





async function getSongById(client, songID) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM songs where id = ${songID}`, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
async function getAllSong(client) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM songs`, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
module.exports = {
    addNewSong: addNewSong,
    removeSong:removeSong,
    updateSongCount: updateSongCount,
    getSongById:getSongById,
    getSongInPlaylist:getSongInPlaylist,
    getAllSong:getAllSong
}