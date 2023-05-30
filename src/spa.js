
// const PAGES = {
//     'PLAYER_PAGE': 'videos/hentai',
//     'INDEX_PAGE': '/',
// };

class SPA {
    pages;


    /**
     * @param {{PLAYER_PAGE: string, INDEX_PAGE: string}} pages
     */
    constructor(pages) {
        this.pages = pages;
    }

    /**
     * @return Promise<String>
     */
    async onLocation(page)  {
        return new Promise(resolve => {

            resolve(PAGES.PLAYER_PAGE)
        });
    };

}

let spa = new SPA(PAGES);
let PAGE = await spa.onLocation();

if (PAGES.PLAYER_PAGE === PAGE) {

}