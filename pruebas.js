/**
 * Created by Andre on 09/10/2016.
 */
var addDigits = function(num) {

    var digits = num.toString().split("");

    var sum=0;

    do{
        for(var i=0;i<digits.length;i++){
            sum+= parseInt(digits[i]);
        }
        digits = sum.toString().split("");
        console.log(digits);
        console.log(sum);
    }while(sum>=10);


    return sum;


};

addDigits(38);