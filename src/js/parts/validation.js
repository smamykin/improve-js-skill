const me = {

};
me.isEmail = function(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
me.isPhoneNumber = (number) => {
    // let re = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    let re = /^(\+[1-9][0-9]*(\(?[0-9]*\)?|-[0-9]*-))?[0]?[1-9][0-9\- ]*$/;
    return re.test(number);
};

me.isNotEmpty = (str) => {
    return Boolean(str);
};

me.checkElement = (element, rules) => {

    rules = rules && rules.split(' ');

    if (rules && element && element.value !== undefined){
        for (let rule of rules){
            if (me.hasOwnProperty(rule) && {}.toString.call(me[rule]) === '[object Function]'){
                if (!me[rule](element.value)){
                    return false;
                }
            }else {
                throw 'there is not such check function ' + rule;
            }
        }
    }
    return true;
};
export default me;