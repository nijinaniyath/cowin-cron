
const behind = {
    get Objective() {
        console.log("%c See the π smiling faces without cotton barriers... \n let's ππ¨βπ¨βπ§βπ¦ all get vaccinated & π§ Zero Vaccine wastage", "color: green; font-size: 16px");
    },
    get Team() {
        console.table(
            [
                { 'ποΈ': 'π¨βπ»', 'π¦': 'Vineeth TR', 'π': 'https://vineethtrv.github.io/'},
                { 'ποΈ': 'π¨βπ»', 'π¦': 'Nijin Aniyath', 'π': 'https://twitter.com/NijinAniyath' },
                { 'ποΈ': 'π', 'π¦': 'Fathima S', 'π': 'https://www.linkedin.com/in/fathima-s-a2523688/' }
            ]
        );
    }
};



console.log('%cAbout Us π', "color:#03a9f4; font-size: 22px", behind);




console.log("%cHeyπ΅οΈ, Have you got your π..?  \n > Yes() \n > No() ", "color:green; font-size: 22px");


const yes = YES = Yes = ()=> {
/*
    
    
    π.?..Oh! You missed ()
    π‘ try:  Yes()
    
    
*/
             
                        
                             
                                   
                                     
                 
    console.log("%c Congratulation..π", "color: orange; font-size: 20px");
    playAudio();
    setTimeout(()=>{
        console.log("%c Please Share Vaccine Bellπ, to help others to get vaccinated. \n We need to bring back the normal world without masks..", "color:green; font-size: 18px");
    },1500)
}


const no = NO = No = () => {
/*
    

    π.?..Oh! You missed ()
    π‘ try:  No()
    
    
    
*/
    
    
    
    

    console.log("%c Don't worry π€ ", "color:orange; font-size: 20px");
    console.log("%c Register on Vaccine Bellπ to get the latest updates on the availability of vaccine \n in your nearest centers and kindly share the information to others to get vaccinated. \n We need to bring back the normal world without masks..", "color:green; font-size: 18px");
}



function playAudio() {
    const au = document.getElementById('audio-player');
    au.play();
}