
const behind = {
    get Objective() {
        console.log("%c See the 😀 smiling faces without cotton barriers... \n let's 💉👨‍👨‍👧‍👦 all get vaccinated & 💧 Zero Vaccine wastage", "color: green; font-size: 16px");
    },
    get Team() {
        console.table(
            [
                { '🏗️': '👨‍💻', '🦉': 'Vineeth TR', '🔎': 'https://vineethtrv.github.io/'},
                { '🏗️': '👨‍💻', '🦉': 'Nijin Aniyath', '🔎': 'https://twitter.com/NijinAniyath' },
                { '🏗️': '📝', '🦉': 'Fathima S', '🔎': 'https://www.linkedin.com/in/fathima-s-a2523688/' }
            ]
        );
    }
};



console.log('%cAbout Us 👉', "color:#03a9f4; font-size: 22px", behind);




console.log("%cHey Geek, Have you got your 💉..?  \n > Yes() \n > No() ", "color:green; font-size: 22px");


const yes = YES = Yes = ()=> {
/*
    
    
    😕.?..Oh! You missed ()
    💡 try:  Yes()
    
    
*/
             
                        
                             
                                   
                                     
                 
    console.log("%c Congratulation..👏", "color: orange; font-size: 20px");
    playAudio();
    setTimeout(()=>{
        console.log("%c Please Share Vaccine Bell🔔, to help others to get vaccinated. \n We need to bring back the normal world without masks..", "color:green; font-size: 18px");
    },1500)
}


const no = NO = No = () => {
/*
    

    😕.?..Oh! You missed ()
    💡 try:  No()
    
    
    
*/
    
    
    
    

    console.log("%c Don't worry 🤗 ", "color:orange; font-size: 20px");
    console.log("%c Register on Vaccine Bell🔔 to get the latest updates on the availability of vaccine \n in your nearest centers and kindly share the information to others to get vaccinated. \n We need to bring back the normal world without masks..", "color:green; font-size: 18px");
}



function playAudio() {
    const au = document.getElementById('audio-player');
    au.play();
}