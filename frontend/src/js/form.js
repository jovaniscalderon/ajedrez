((Utils) => {
    const App = {
        htmlElements: {
            loginForm: document.querySelector("#login-form"),
            userInput: document.querySelector("#user-query"),
            passInput: document.querySelector("#pass-query"),
            nameInput: document.querySelector("#name-query"),
            scoreInput: document.querySelector("#score-query"),
        },
        init: () => {
            App.htmlElements.loginForm.addEventListener(
                "click",
                App.handlers.loginFormOnSubmit
            );
        },
        handlers: {
            loginFormOnSubmit: async (e) => {
                e.preventDefault();

                if(e.target.id === "btnLogin"){
                    const user = App.htmlElements.userInput.value;
                    const pass = App.htmlElements.passInput.value;

                    const data = {
                        id: user, 
                        pass: pass
                    }

                    try {
                        const response = await Utils.postService({
                            service: "login", 
                            data: data, 
                            method: "POST" 
                        });
                        if(response.succes){
                            //Redirige a index
                        }else{
                            alert(response.error.cod + ": " + response.error.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                }
                if(e.target.id === "btnSignUp"){
                    const user = App.htmlElements.userInput.value;
                    const pass = App.htmlElements.passInput.value;
                    const name = App.htmlElements.nameInput.value;
                    const score = App.htmlElements.scoreInput.value;
                    let scoreAux = 0;

                    if(score === "new"){
                        scoreAux = 800;
                    }
                    if(score === "beginner"){
                        scoreAux = 1200;
                    }
                    if(score === "intermediate"){
                        scoreAux = 1600;
                    }
                    if(score === "advanced"){
                        scoreAux = 2000;
                    }

                    const data = {
                        id: user, 
                        pass: pass,
                        name: name,
                        score: scoreAux
                    }

                    try {
                        const response = await Utils.postService({
                            service: "register", 
                            data: data, 
                            method: "POST" 
                        });
                        if(response.succes){
                            //Redirige a index
                        }else{
                            alert(response.error.cod + ": " + response.error.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                }
            }
        },
        templates: {

        }
    }
    App.init();
})(document.Utils);