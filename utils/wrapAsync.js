function wrapAsync(fn){
    return function(req, res, next) { // this returing function works is to execute the fn function with a same parameters
        fn(req, res, next).catch(next)
    }
}

module.exports = wrapAsync