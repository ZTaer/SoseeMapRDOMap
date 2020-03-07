# SoseeMapRDOMap
荒野大镖客线上资源分布图RDOMAP有简体中文
<h2>
注意：本项目是为改进出更适合亚洲中国地域附近而创建，并防止因改进过大影响原项目冲突<br/><br/>
Note: This project was created to improve the areas near Asia and China, and to prevent conflicts from affecting the original project due to excessive improvements
<h2>
<h3>
    原作者( Author: jeanropke )：<a href="https://github.com/jeanropke/RDOMap">https://github.com/jeanropke/RDOMap</a><br/>
    改进者( helper: __OO7__ ): <a href="https://github.com/ZTaer" >https://github.com/ZTaer</a>
</h3>
<h4>
    赞助广告: <a href="https://update.leigod.com/soft/channel/LeiGodSetup_ZT.exe" > 雷神加速器快捷下载 </a>
</h4>
<pre>
    已经更新:
        0. 中文字体: 
            a) 文件: language.js / script.js
            b) 修改: Settings.language = 'zh-s';
        1. 设定地图图片地址:
           a) 使用本地地图图片( 切忌不要使用默认的cdn图片链接 )
           var mapLayers = [
                L.tileLayer('assets/maps/detailed/{z}/{x}_{y}.jpg', {
                    noWrap: true,
                    bounds: L.latLngBounds(L.latLng(-144, 0), L.latLng(0, 176))
                }),
                L.tileLayer('assets/maps/detailed/{z}/{x}_{y}.jpg', {
                    noWrap: true,
                    bounds: L.latLngBounds(L.latLng(-144, 0), L.latLng(0, 176))
                }),
                L.tileLayer('assets/maps/darkmode/{z}/{x}_{y}.jpg', {
                    noWrap: true,
                    bounds: L.latLngBounds(L.latLng(-144, 0), L.latLng(0, 176))
                })
            ];
       
</pre>
<pre>
    Already updated:
         1. Replaced JS-CDN plug-in to enable high-speed access in Asia
         Optimized font display
         1. Supplement some font translation
     Updating:
         1. More translations added
     Ready to update:
         1. Click the icon to display the image of the item's location in the game
</pre>

<hr/>

# RDOMap
A lot of plants positions by [EverettLawson](https://github.com/EverettLawson)

Detailed map by [RDR2Map](https://rdr2map.com/)

Dark map by [TDLCTV](https://github.com/TDLCTV)