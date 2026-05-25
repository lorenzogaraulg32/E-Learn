const path = require('path')

exports.checkTextFields = function (field, element, max, min) {
    switch (true) {
        case (!field):
            return ({message: element + ' empty'})
        case (field.length < min):
            return ({message: element + ' too short'})
        case (field.length > max):
            return ({message: element + ' too long'})
        default:
            break
    }
}

exports.checkFileFields = function (file, element, appendix) {
    switch (true) {
        case (file === undefined):
            return ({message: element + ' empty'})
        case (!isFile(file, appendix)):
            return ({message: element + ' invalid ' + appendix})
        default:
            break
    }
}

function isFile(file, appendix) {
    let extension = (path.extname(file.name)).toLowerCase()
    return extension === appendix
}

exports.isFile = function(file, appendix) {
    let extension = (path.extname(file.name)).toLowerCase()
    return extension === appendix
}