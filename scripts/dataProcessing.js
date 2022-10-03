module.exports = generateData = states =>{
    let colors = generateColors(states);
    let ranks = generateRanks(states);
    
    let data = {};
    for(key in states){
        data[key] = {
            color: colors[key],
            rank: ranks[states[key]],
            number: states[key]
        };
    }
    return data;
}

function generateColors(states){
    let unique = {};

    for (key in states){
        if (states[key] in unique){
            unique[states[key]] = unique[states[key]] + 1; 
        } else {
            unique[states[key]] = 1;
        }
    };
    let totalUnique = Object.keys(unique).length;
    
    let colors = {}; //transparency values
    let boxNum = 0;
    Object.keys(unique).forEach(key1 => {
        Object.keys(states).forEach(key2 => {
            if(states[key2].toString() === key1){
                let alpha = ((256/totalUnique)/2) + (256/totalUnique)*boxNum;
                alpha = Math.round(alpha);
                if(alpha < 0){alpha = 0;}
                    else if(alpha > 255) {alpha = 255;}
                colors[key2] = alpha.toString(16);
                //Sets single digit hex values to double digit(fixes bug)
                if(colors[key2].length === 1) {
                    colors[key2] = "0" + colors[key2];
                } 
            }
        });
        boxNum++;
    });
    return colors;
}

function generateRanks(states){
    let rankRef = {}; //stores the rank for every state val
    let rankCtr = 0; //stores the current rank
    let tieCtr = 0; //counts how many states are tied in rank
    let lastnum = -1;
    Object.values(states).sort((a, b) => b - a).forEach(num =>{
        if(num < lastnum || lastnum == -1){
            rankCtr+= 1 + tieCtr;
            lastnum = num;
            tieCtr = 0; //reset tie counter
        } else {
            tieCtr++;
        }
        rankRef[num] = rankCtr;
    });
    return rankRef;
}
