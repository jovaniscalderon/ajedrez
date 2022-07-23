((Utils) => {
    const App = {
        htmlElements: {
            indexForm: document.querySelector("#index-form"),
        },
        init: () => {
            App.htmlElements.indexForm.addEventListener(
                "click",
                App.handlers.indexFormOnSubmit
            );
        },
        handlers: {
            indexFormOnSubmit: async (e) => {
                if(e.target.id === "logout"){
                    e.preventDefault();
                    try {
                        const response = await Utils.postService({
                            service: "logout", 
                            data: {}, 
                            method: "GET" 
                        });
                        if(response.response.cod === 'LOGOUT'){
                            Utils.navigate({
                                route: "login"
                            });
                        }else{
                            alert(response.response.message);
                        }
                    } catch(error) {
                        console.error(error);
                    }
                }
                if(e.target.id === "subscribe"){
                    e.preventDefault();
                    try {
                        const response = await Utils.postService({
                            service: "subscribe", 
                            data: {}, 
                            method: "POST" 
                        });
                        if(response.succes){
                            alert("Subscribed!");
                            location.reload();
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