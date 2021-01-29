const DB = require('../db')

async function addNewPlaylist(client, title, fileUrl, description, views, id) {
    console.log(title, fileUrl, description, views, id)
    return new Promise(function (resolve, reject) {
        client.query(`INSERT INTO playlist (title, image, description, views, playlistOwner) VALUES ("${title}", "${fileUrl}", "${description}", ${views}, ${id})`,
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

async function addNewNotification(client, playlistID) {
    return new Promise(function (resolve, reject) {
        client.query(`INSERT INTO notifications (playlistID) VALUES (${playlistID})`,
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

async function updatePlaylist(client, playlistDetails) {
    return new Promise(function (resolve, reject) {
        client.query(`UPDATE playlist SET title = "${playlistDetails.title}", image = "${playlistDetails.image}", description = "${playlistDetails.description}" WHERE id = ${playlistDetails.playlistID}`,
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

async function updatePlaylistFavCount(client, playlistId,favCount) {
    return new Promise(function (resolve, reject) {
        client.query(`UPDATE playlist SET noOfFavorite = ${favCount}  WHERE id = ${playlistId}`,
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

async function updatePlaylistViewCount(client, playlistId,viewCount) {
    return new Promise(function (resolve, reject) {
        client.query(`UPDATE playlist SET views = ${viewCount}  WHERE id = ${playlistId}`,
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





async function getPlaylistByID(client, playlistID) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM playlist where id = ${playlistID}`, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

async function getAllPlaylist(client) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM playlist ORDER BY views DESC`, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

async function getAllNotifications(client) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM playlist ORDER BY added_at DESC`, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

async function getPlaylistsByAdmin(client, userID) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM playlist where playlistOwner = ${userID}`, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

async function updatePlaylistView(client, playlistID) {
    return new Promise(function (resolve, reject) {
        client.query(`UPDATE playlist SET views = views + 1 WHERE id = ${playlistID}`,
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

async function addPlaylistToFavourite(client, playlistDetails) {
    return new Promise(function (resolve, reject) {
        client.query(`INSERT INTO favourites (user, playlist) VALUES (${playlistDetails.userID}, ${playlistDetails.playlistID})`,
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


async function checkAlradyFav(client, playlistDetails) {
    return new Promise(function (resolve, reject) {
        client.query(`Select * from favourites where user = ${playlistDetails.userID} AND playlist= ${playlistDetails.playlistID}`,
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

async function getFavouritePlaylistsByID(client, userID) {
    return new Promise(function (resolve, reject) {
        return client.query(`SELECT * from favourites as f JOIN playlist as p WHERE f.playlist = p.id AND f.user = ${userID}`, function (error, result, fields) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

/**apolo */
/*
async function getAllPlayList(client){
    return new Promise(function (resolve,reject){
        return client.query(`SELECT * from playlist`,function(error,result,fields){
            if(error){
                reject(error);
                return;
            }
            resolve(result);
        })
    })
}
*/
/*
async function removeSongsfromPlayList(client,id){
    return new Promise(function (resolve,reject){
        return client.query(`DELETE from songs WHERE playlistId=${id}`,function(error,result,fields){
            if(error){
                reject(error);
                return;
            }
            resolve(result);
        })
    })
}

async function addSongtoPlayList(client,id,filename){
    let values = ''
    songlist.map((item)=>{
        values += `()`
    })
}
*/
module.exports = {
    addNewPlaylist: addNewPlaylist,
    addNewNotification: addNewNotification,
    updatePlaylist: updatePlaylist,
    getPlaylistByID: getPlaylistByID,
    updatePlaylistFavCount:updatePlaylistFavCount,
    getPlaylistsByAdmin: getPlaylistsByAdmin,
    updatePlaylistView: updatePlaylistView,
    updatePlaylistViewCount:updatePlaylistViewCount,
    getAllPlaylist: getAllPlaylist,
    addPlaylistToFavourite: addPlaylistToFavourite,
    checkAlradyFav: checkAlradyFav,
    getFavouritePlaylistsByID: getFavouritePlaylistsByID,
    getAllNotifications: getAllNotifications,

    
}