console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.OMDb = {
    OMDb_API_key: process.env.OMDB_KEY
}

exports.BIT = {
    BIT_API_key: process.env.BIT_Key
}
