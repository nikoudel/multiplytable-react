//http://www.iconarchive.com/show/shrek-icons-by-majdi-khawaja.html
//http://www.iconarchive.com/show/rio-icons-by-majdi-khawaja.html
//http://www.iconarchive.com/show/ice-age-icons-by-majdi-khawaja.html
//http://www.iconarchive.com/show/kung-fu-panda-icons-by-majdi-khawaja.html
//http://www.iconarchive.com/show/madagascar-icons-by-majdi-khawaja.html


// "Alex-2-icon.png","Alex-3-icon.png","Alex-and-Marty-2-icon.png","Alex-and-Marty-icon.png",
// "Alex-icon.png","Blue-2-icon.png","Blue-3-icon.png","Blue-icon.png","Blue-young-icon.png","Buck-icon.png",
// "Crane-icon.png","Crash-and-Eddie-icon.png","Diego-2-icon.png","Diego-icon.png","Donkey-2-icon.png",
// "Donkey-3-icon.png","Donkey-icon.png","Fiona-2-icon.png","Fiona-3-icon.png","Fiona-icon.png","Gloria-2-icon.png",
// "Gloria-and-Melman-icon.png","Gloria-icon.png","Jewel-icon.png","King-Julian-icon.png","Luiz-icon.png",
// "Manny-icon.png","Mantis-icon.png","Marty-2-icon.png","Marty-icon.png","Master-Shifu-2-icon.png","Master-Shifu-3-icon.png",
// "Master-Shifu-icon.png","Master-Storming-Ox-icon.png","Master-Thundering-Rhino-icon.png","Melman-2-icon.png",
// "Melman-3-icon.png","Melman-and-Gloria-icon.png","Melman-icon.png","Nico-and-Pedro-icon.png","Nigel-2-icon.png",
// "Nigel-icon.png","Peaches-icon.png","Penguins-icon.png","Po-2-icon.png","Po-3-icon.png","Po-4-icon.png","Po-5-icon.png",
// "Po-icon.png","Puss-2-icon.png","Puss-3-icon.png","Puss-icon.png","Rafael-icon.png","Scrat-2-icon.png","Scrat-3-icon.png",
// "Scrat-icon.png","Scratte-icon.png","Shrek-2-icon.png","Shrek-3-icon.png","Shrek-4-icon.png","Shrek-5-icon.png",
// "Shrek-and-Donkey-and-Puss-2-icon.png","Shrek-and-Donkey-and-Puss-icon.png","Shrek-and-Fiona-icon.png","Shrek-icon.png",
// "Sid-icon.png","Skipper-icon.png","Tai-Lung-2-icon.png","Tai-Lung-icon.png","The-Gorillas-icon.png","Tigress-2-icon.png",
// "Tigress-3-icon.png","Tigress-icon.png","Viper-icon.png","Wolf-and-Pigs-icon.png","Wolf-Boss-icon.png"

const map = {
    "2|2": "Penguins-icon.png",
    "2|3": "Melman-3-icon.png",
    "2|4": "Master-Shifu-2-icon.png",
    "2|5": "King-Julian-icon.png",
    "2|6": "Fiona-3-icon.png",
    "2|7": "Sid-icon.png",
    "2|8": "Tigress-2-icon.png",
    "2|9": "Wolf-Boss-icon.png",
    "3|3": "Po-3-icon.png",
    "3|4": "Shrek-and-Donkey-and-Puss-2-icon.png",
    "3|5": "The-Gorillas-icon.png",
    "3|6": "Diego-2-icon.png",
    "3|7": "Blue-2-icon.png",
    "3|8": "Alex-and-Marty-2-icon.png",
    "3|9": "Gloria-icon.png",
    "4|4": "Donkey-icon.png",
    "4|5": "Master-Shifu-icon.png",
    "4|6": "Marty-2-icon.png",
    "4|7": "Peaches-icon.png",
    "4|8": "Wolf-and-Pigs-icon.png",
    "4|9": "Tigress-icon.png",
    "5|5": "Scrat-2-icon.png",
    "5|6": "Blue-young-icon.png",
    "5|7": "Alex-icon.png",
    "5|8": "Shrek-icon.png",
    "5|9": "Nigel-icon.png",
    "6|6": "Rafael-icon.png",
    "6|7": "Puss-3-icon.png",
    "6|8": "Skipper-icon.png",
    "6|9": "Manny-icon.png",
    "7|7": "Tigress-3-icon.png",
    "7|8": "Po-icon.png",
    "7|9": "Diego-icon.png",
    "8|8": "Shrek-and-Donkey-and-Puss-icon.png",
    "8|9": "Jewel-icon.png",
    "9|9": "Blue-3-icon.png"
};

export default function(x, y) {
    return x < y 
        ? map["" + x + "|" + y]
        : map["" + y + "|" + x];
}