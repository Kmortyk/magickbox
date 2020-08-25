function addEventTo( object, event, fun )
{
    if (object.addEventListener) { object.addEventListener( event, fun, false ); }
    else if (object.attachEvent) { object.attachEvent( "on" + event, fun ); }
}

function getDocumentHeight() {
    var body = document.body,
        html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

function getPageOffsets(){
    var doc = document.documentElement;
    return{
        left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
        top: (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    };
}

function newXMLHttpRequest() {

    var xmlreq = false;
    if (window.XMLHttpRequest) {
        // Создадим XMLHttpRequest объект для не-Microsoft браузеров
        xmlreq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // Создадим XMLHttpRequest с помощью MS ActiveX
        try {
            // Попробуем создать XMLHttpRequest для поздних версий
            // Internet Explorer
            xmlreq = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e1) {
            // Не удалось создать требуемый ActiveXObject
            try {
                // Пробуем вариант, который поддержат более старые версии
                //  Internet Explorer
                xmlreq = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) {
                // Не в состоянии создать XMLHttpRequest с помощью ActiveX
            }
        }
    }
    return xmlreq;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function findHighestZIndex(elem)
{
    var elems = document.getElementsByTagName(elem);
    var highest = 0;
    for (var i = 0; i < elems.length; i++)
    {
        var zindex = document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index");
        if ((zindex > highest) && (zindex !== 'auto'))
        {
            highest = zindex;
        }
    }
    return highest;
}

function findParent (element, class_name) {
    while (!element.classList.contains(class_name) && (element = element.parentElement));
    return element;
}

function contains(bounds1, bounds2){
    return  bounds2.top > bounds1.top && bounds2.right < bounds1.right && bounds2.bottom < bounds1.bottom && bounds2.left > bounds1.left;
}