// const tooltip = document.querySelector('.tooltip');
//TODO: create condition for empty data
//Instead, either always send white data then handle for the details block
//or prevent hovering when a term has not been searched.
const data = JSON.parse(document.querySelector('.data').dataset.data);
const query = JSON.parse(document.querySelector('.query').dataset.query);

console.log(data);

document.querySelector('#search-input-bar')
    .setAttribute("value", query['text'].replaceAll("%20", " "));

Object.keys(data).forEach(key => {

    const path = document.querySelector('#' + key);
    path.style.fill = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary') + data[key]['color'];

    path.addEventListener("mouseleave",(e)=>{
        path.style.fill = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary') + data[key]['color'];
    });
    path.addEventListener("mouseenter",(e)=>{
        path.style.fill = getComputedStyle(document.documentElement)
            .getPropertyValue('--secondary');
        
    });
    path.addEventListener("click",(e)=>{
        document.querySelector('.detailed-name').innerText = path.getAttribute('name');
        
        let superscript = ""; 
        switch(data[key]['rank'] % 10){
            case 1:{ superscript = "st"; break;}
            case 2:{ superscript = "nd"; break;}
            case 3:{ superscript = "rd"; break;}
            default:{ superscript = "th";}
        }
        document.querySelector('.detailed-rank').innerHTML = data[key]['rank'] + "<sup>"+superscript+"</sup>";
        document.querySelector('.detailed-number').innerHTML = data[key]['number'] + " Tweets";
    });
    
});