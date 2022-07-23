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
                e.preventDefault();

                if(e.target.id === "logout"){
                    try {
                        const response = await Utils.postService({
                            service: "logout", 
                            data: {}, 
                            method: "GET" 
                        });
                        console.log(response);
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