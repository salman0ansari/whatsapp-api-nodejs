function Exceptions () {
    
    this.InvalidNumber = function () {
        return "Number is not registered on WhatsApp"
    }

    this.InvalidKey = function () {
        return "key is not registered with us"
    }

}

exports.Exceptions = Exceptions