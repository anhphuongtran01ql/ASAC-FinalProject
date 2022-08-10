let getHomePage = (req, res) =>{
    return res.send("Hello world from controller!");
}

module.exports = {
    getHomePage: getHomePage,
}