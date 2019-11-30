/************ 数据处理模块-BGN  */
var dataModule = ( function(){

    const langInit = (idName,lang) => {
        let test = document.getElementById( idName ).value = lang;
    }

    return{
        langInit: ( idName,lang ) => {
            langInit( idName,lang );
        }

    }

} )()

/************ 数据处理模块-END  */

/************ ui界面处理模块-BGN  */
var uiModule = ( function(){
    const String = {
        zh_s: 'zh-s',
        zh_t: 'zh-t',
        language: 'language',
        toggleHidden: 'toggle-hidden',
    };

    const noneItems = ( items ) => {
        document.querySelector( items ).style.display = 'none';
    }

    const blockItems = ( items ) => {
        document.querySelector( items ).style.display = 'block';
    }

    // 保证中英文字体字间距不同
    const controlFontSpace = () => {
        let lg = document.getElementById(String.language).value;
        if( lg !== String.zh_s && lg !== String.zh_t ){
            document.querySelector('body').style.letterSpacing = '1px';
        }
        else{
            document.querySelector('body').style.letterSpacing = '3px';
        }
    }

    return{
        controlFontSpace: ()=>{
            controlFontSpace();
        },
        string: String,
        noneItems: ( items ) => {
            noneItems(items);
        },
        blockItems: (items) => {
            blockItems(items);
        }
    }

} )()
/************ ui界面处理模块-END  */


/************ 主空模块-BGN  */
var controlModule = ( function( data,ui ){

    // 切换显示
    var displayItems = () => {
        let items = ['#title-banner','#banner'];
        items.forEach( e => {
            let now = document.querySelector(e).style.display;
            now == 'none' ? ui.blockItems(e) : ui.noneItems(e); 
        } );
    }
    
    // 监听
    var setupEventLiteners = ()=>{
        document.getElementById( ui.string.language ).addEventListener('change',ui.controlFontSpace);
        window.addEventListener('load',  ui.controlFontSpace, data.langInit( ui.string.language, ui.string.zh_s ) );
        document.getElementById( ui.string.toggleHidden ).addEventListener('click',displayItems);
    }
    return{
        init: ()=>{
            setupEventLiteners();
        }
    }

} )( dataModule,uiModule )
/************ 主空模块-END  */
controlModule.init();

