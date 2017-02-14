/**
 * Metodo dinamico que crea una clase emmet en caliente y devuelve una coleccion de nodos segun la sentencia emmet introducida
 */
function createEmmetNodes(texto)
{
    var sentence = new Emmet(texto);
    return sentence.generateNodes();
}
/**
 * Crea un objeto Emmet que permite crear una estructura HTML en JS con la sintaxis Emmet
 */
var Emmet = function()
{
    if(arguments.length >= 1)
    {
        if(typeof(arguments[0]) == "string" || arguments[0].indexOf(">") != -1)
        {
            this.texto = arguments[0];
        }
    }
}
/**
 * Esta funcion permite añadir una sentencia emmet, a la ya presente
 */
Emmet.prototype.add = function(abbr)
{
    this.texto = this.texto +"("+ abbr+")";
    return this.texto
}
/**
 * Elimina un trozo de sentencia emmet según los numeros inicio,final puestos en parametros
 * Parameter 1: {integer} Indica donde comienza la cadena a eliminar  
 * Parameter 2: {integer} Indica donde termina la cadena a eliminar  
 */
Emmet.prototype.remove = function(inicio,final)
{
    var sub = this.texto.substring(inicio,final);
    this.texto = this.texto.replace(sub,"");
    return this.texto;
}
/**
 * Elimina toda la sentencia emmet
 */
Emmet.prototype.removeAll = function()
{
    this.texto = "";
    return this.texto;
}
/**
 * Busca una cadena dentro de la sentencia Emmet, y devuelve la posicion donde se encontro, también como segundo parametro se puede pasar a partir de que numero se quiere empezar a buscar
 */
Emmet.prototype.search = function(cadena)
{
    var empieza = 0;
    if(arguments.length >= 2)
    {
        if(typeof(arguments[1]) == "number")
        {
            empieza = parseInt(arguments[1]);
        }
    }
    var indice = this.texto.indexOf(cadena,empieza);
    return indice;
}
/**
 * Genera y devuelve la estructura en nodos, a partir de la sentencia Emmet
 */
Emmet.prototype.generateNodes = function()
{
    return generarEstructura(this.texto);
}
/**
 * Genera y devuelve un String estructurado, a partir de la sentencia Emmet
 */
Emmet.prototype.generateHTML = function()
{
    var contenedor = this.generateNodes(this.texto);
    var div = document.createElement("div");
    div.appendChild(contenedor);
    return div.innerHTML;
}

/**
 * Esta funcion permite crear la estructura HTML de la sentencia Emmet introducida
 */
function generarEstructura(sentencia)
{
    /**
     * Lista de Nodos final que se devolverá
     */
    var extracto = document.createDocumentFragment();
    sentencia += ";";
    /**
     * Expresion Regular que devuelve en un array todos los operadores y componentes de la sentencia Emmet
     */
    var tabladesignos = sentencia.match(/[#|\.|\w|\{|\(][\w|\[|\]|\{|\}|\=|\s|\$|\-|\_|\(|\)|\#|\.|\@|\,]*[>|^|\+|*|;]+/g);   
    /**
     * El proximo signo que deberá respectar jeraquicamente el proximo elemento
     */
    var proximosigno = ">";
    /**
     * Ultimo elemento introducido en el extracto
     */
    var ultimoelemento = extracto;
    /**
     * Variable que indica si el elemento padre donde estamos es una serie de nodos debido al operador *: 0 es que no hay multi, 1 es que hay multi pero solo para los descendientes, 2 que hay multi para los descendientes y los adyacentes.
     */
    var insidemultipl = 0;
    /**
     * Tabla que representa todos los nodos donde hay que hacer un appendChild debido al operador *
     */
    var tablainside = [];
    /**
     * Nodo original del parentesis
     */
     var nodoprimario = "";

    for(var a = 0;a < tabladesignos.length;a++)
    {
        var signos = tabladesignos[a];
        var elm = crearElemento(signos,ultimoelemento);
        if(signos.charAt(0) == "(")
        {
            if(signos.indexOf(")") == -1)
            {
                nodoprimario = elm;
            }
        }
        var nuevosigno = signos.charAt(signos.length-1).trim();
        if(nuevosigno == '^')
        {
            var indice = signos.indexOf('^');
            if(indice != signos.length-1)
            {
                altura = ((signos.length-1)-indice)+1;
            }
        }
        if(nuevosigno == '*')
        {
            elemento = elm;
            proximosigno = nuevosigno;
        }
        else
        {
            if(typeof(elm) == "object")
            {
                elm = autonumerar(elm,0,1,false);
            }
            switch(proximosigno.charAt(0))
            {
                case '>': 
                    if(insidemultipl == 0)
                    {
                        ultimoelemento.appendChild(elm);
                        ultimoelemento = elm;
                        proximosigno = nuevosigno;
                    }else if(insidemultipl == 1 || insidemultipl == 2)
                    {
                        if(insidemultipl == 1)
                        {
                            for(var b = 0;b < tablainside.length;b++)
                            {
                                var clon = elm.cloneNode(true);
                                if(b==0)
                                {
                                    tablainside[b].appendChild(elm);
                                }else
                                {
                                    tablainside[b].appendChild(clon);
                                }
                            }
                        }
                        if(insidemultipl == 2)
                        {
                            insidemultipl = 0
                        }else
                        {
                            insidemultipl = 2;
                        };
                        ultimoelemento = elm;
                        proximosigno = nuevosigno;
                    }
                break;

                case '+': 
                    if(insidemultipl == 0)
                    {
                        ultimoelemento.parentNode.appendChild(elm);
                        ultimoelemento = elm;
                        proximosigno = nuevosigno;
                    }else if(insidemultipl == 2)
                    {
                        for(var b = 0;b < tablainside.length;b++)
                        {
                            var clon = elm.cloneNode(true);
                            if(b==0)
                            {
                                tablainside[b].appendChild(elm);
                            }else
                            {
                                tablainside[b].appendChild(clon);
                            }
                        }
                        insidemultipl = 2;
                        ultimoelemento = elm;
                        proximosigno = nuevosigno;
                    }
                break;

                case '*':
                    if(insidemultipl == 0)
                    {
                        tablainside = [];
                        for(var b = 0;b < elm;b++)
                        {
                            if(b == elm-1)
                            {
                                var elu = autonumerar(elemento,b,elm,false);
                                ultimoelemento.appendChild(elu);
                            }else
                            {
                                var elu = autonumerar(elemento,b,elm,true)
                                ultimoelemento.appendChild(elu);
                            }
                            tablainside.push(elu);
                        }
                        (elm>1)?insidemultipl=1:insidemultipl=0;
                        ultimoelemento = elemento;
                        proximosigno = nuevosigno;
                    }else if(insidemultipl == 1|| insidemultipl == 2)
                    {
                        for(var b = 0;b < tablainside.length;b++)
                        {
                            for(var c = 0;c < elm;c++)
                            {
                                if(c == elm-1 && b == tablainside.length-1)
                                {
                                    tablainside[b].appendChild(autonumerar(elemento,c,elm,false));
                                }else
                                {
                                    tablainside[b].appendChild(autonumerar(elemento,c,elm,true));
                                }
                            }
                        }
                        insidemultipl = 2;
                        ultimoelemento = elemento;
                        proximosigno = nuevosigno;
                    }

                break;

                case '^':
                    insidemultipl = 0;
                    for(var subir = 0;subir < altura;subir++)
                    {
                        ultimoelemento = ultimoelemento.parentNode;
                    } 
                    ultimoelemento.parentNode.appendChild(elm);
                    ultimoelemento = elm;
                    proximosigno = nuevosigno;
                break;
                
            }
            if(signos.indexOf(")") != -1 && typeof(nodoprimario) == "object")
            {
                ultimoelemento = nodoprimario.parentNode;
				nodoprimario = "";
                insidemultipl = 0;
            }
        }
    }
    return extracto;
}
/**
 * Crea un Elemento-Nodo a partir de los signos individuales separados de la sentencia Emmet
 */
function crearElemento(signo,ultimo)
{
    var nombreultimo = ultimo.nodeName;
    var elm = "";
    var sent = signo.replace(">","").replace("^","").replace("*","").replace(";","").replace("+","").replace("$","1").replace("(","").replace(")","");
    if(isNaN(parseInt(sent)))
    {
        var claseinside = false;
        var implicit = "div";
        if(nombreultimo == "UL" || nombreultimo == "OL")
        {
            implicit = "li";
        }else if(nombreultimo == "TABLE" || nombreultimo == "THEAD" || nombreultimo == "TBODY" || nombreultimo == "TFOOT")
        {
            implicit = "tr";
        }else if(nombreultimo == "TR")
        {
            implicit = "td";
        }else if(nombreultimo == "SELECT")
        {
            implicit = "option";
        }
        var valor = sent.replace("{","").replace("}","").trim();
        sent = sent.split("[")[0];
        sent = sent.split("{")[0];
        if(sent.split(".")[0] != "")
        {
            sent = sent.split(".")[0];
        }
        if(sent.split("#")[0] != "")
        {
            sent = sent.split("#")[0];
        }
        (sent=="")?sent="y":sent=sent;
        switch(sent.charAt(0))
        {
            case '#':
                elm = document.createElement(implicit);
                elm.setAttribute("id",sent.replace("#",""));
            break;

            case '.':
                elm = document.createElement(implicit);
                elm.setAttribute("class",sent.replace(/\./g,""));  
                claseinside = true;
            break;
            
            case 'y':
                elm = document.createTextNode(valor);
            break;
            
            default:
                elm = document.createElement(sent);
            break;
        }
        elm = existeClaseId(signo,elm,claseinside);
        elm = existeAtributo(signo,elm);
        elm = existeTexto(signo,elm);
        return elm;
    }else
    {
        return parseInt(sent);
    }
}
/**
 * Verifica si existe Clases y Ids
 */
function existeClaseId(trozo,nodo,claseinside)
{
    var tablaclases = trozo.match(/\.[\w|\$|\@|\-]*/g) || "nulo";
    var tablaids = trozo.match(/\#[\w|\$|\@|\-]*/g) || "nulo";
    if(tablaclases != "nulo")
    {
        var ind = 0;
        for(var cls of tablaclases)
        {
            var cl = cls.replace(".","").trim();
            if(claseinside = true && ind == 0)
            {
                nodo.className = cl;
            }
            else
            {
                if(nodo.className.indexOf(cl) == -1)
                {
                    (nodo.className == "")?nodo.className = cl:nodo.className += " "+cl;
                }
            }
            ind++;
        }
    }
    if(tablaids != "nulo")
    {
        var id0 = tablaids[0].replace("#","");
        nodo.setAttribute("id",id0);
    }
    return nodo;
}
/**
 * Verifica si existe un atributo en el elm
 */
function existeAtributo(trozo,nodo)
{
    var elm = trozo;
    var attr = elm.match(/\[.*\]/g) || "nulo";
    if(attr != "nulo")
    {
        var recattr = attr[0];
        var separacion = recattr.replace("[","").replace("]","").split(",");
        for(var valor of separacion)
        {
            var pares = valor.split("=");
            nodo.setAttribute(pares[0],pares[1]);
        }
    }
    return nodo;
}
/**
 * Verifica si hay texto en el elm
 */
function existeTexto(trozo,nodo)
{
    var elm = trozo;
    var attr = elm.match(/\{.*\}/g) || "nulo";
    if(attr != "nulo")
    {
        var recattr = attr[0];
        var texto = recattr.replace("{","").replace("}","");
        if(texto == "lorem")
        {
            nodo.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla orci ac ante vestibulum consectetur. Quisque vitae risus vitae nisi mattis blandit. Quisque id quam in nunc dignissim volutpat ac sed nunc. Quisque eleifend porttitor eros, eu vulputate sapien fermentum sed. Suspendisse commodo, lectus sed tempor auctor, libero ipsum mattis lorem, sed euismod augue ipsum eu justo. Cras eleifend rhoncus fringilla. Maecenas id arcu gravida nulla vulputate tincidunt in facilisis justo.";
        }else
        {
            nodo.innerHTML = texto;
        }
    }
    return nodo;
}
/**
 * Crea la autonumeración a partir de un elemento y el simbolo dolar
 */
function autonumerar(elm,numero,maximo,clonar)
{
    var nombreu = numero;
    if(clonar)
    {
        elm = elm.cloneNode(true);
    }else
    {
        elm = elm;
    }   
    var tabla = elm.attributes;
    for(var valor of tabla)
    {
        nombreu = numero;
        var nombre = valor.name;
        var arrobas = valor.value.match(/\@\-\d{0,}|\@\d+/g) || "nulo";
        var max = maximo - numero;
        if(arrobas != "nulo")
        {
            var arr = arrobas[0];
            var num = arr.replace("@","");
            if(num == "-")
            {
                nombreu = maximo - numero;
            }else
            {
                if(num.indexOf("-") != -1)
                {
                    nombreu = max - parseInt(num);
                }
                else
                {
                    num = parseInt(num);
                    nombreu = numero + num;
                }
            }
            elm.setAttribute(nombre,valor.value.replace(arr,""));
        }else
        {
            nombreu++;
        }
        var tbl = valor.value.match(/\$/g) || "nulo";
        if(tbl != "nulo")
        {   
            var potencia = parseInt(parseInt(nombreu)/10);
            var char = "";
            (potencia.toString().length==1)?(potencia == 0)?char="$":char="$$":char = crearDolar(potencia.toString().length);
            var indice = valor.value.lastIndexOf(char);
            var cadena = "";
            if(indice != -1)
            {
                cadena = valor.value.replaceAt(indice,nombreu);
                cadena = cadena.replace(/\$/g,"0");
            }else
            {
                cadena = valor.value;
                for(var c = 0;c < tbl.length-1;c++)
                {
                    cadena = cadena.replace("$","");
                }
                cadena = cadena.replace("$",nombreu);
            }
            elm.setAttribute(nombre,cadena);
        }
    }
    numero++;
    var texto = elm.textContent;

    /* Crea String a partir del arrobas */
    var arrobas = texto.match(/\@\-\d{0,}|\@\d+/g) || "nulo";
    var max = maximo - numero;
    if(arrobas != "nulo")
    {
        var arr = arrobas[0];
        var num = arr.replace("@","");
        if(num == "-")
        {
            nombreu = maximo - numero+1;
        }else
        {
            if(num.indexOf("-") != -1)
            {
                nombreu = max - parseInt(num);
            }
            else
            {
                num = parseInt(num);
                nombreu = numero + num;
            }
        }
        elm.textContent = texto.replace(arr,"");
    }else
    {
        nombreu++;
    }

    texto = elm.textContent;

    /* Crea el String a partir del dolar */
    var tbl = texto.match(/\$/g) || "nulo";
    if(tbl != "nulo")
    {  
        var potencia = parseInt(parseInt(nombreu)/10);
        var char = "";
        (potencia.toString().length==1)?(potencia == 0)?char="$":char="$$":char = crearDolar(potencia.toString().length);
        var indice = texto.lastIndexOf(char);
        var cadena = "";
        if(indice != -1)
        {
            cadena = texto.replaceAt(indice,nombreu);
            cadena = cadena.replace(/\$/g,"0");
            elm.textContent = cadena;
        }else
        {
            cadena = texto;
            for(var c = 0;c < tbl.length-1;c++)
            {
                cadena = cadena.replace("$","");
            }
            cadena = cadena.replace("$",nombreu);
            elm.textContent = cadena;
        }
    }
    return elm;
}
/**
 * Crea tantos dolares como numeros haya en la cadena
 */
function crearDolar(long)
{
    var res = "";
    for(var d = 0;d < long+1;d++)
    {
        res += "$";
    }
    return res;
}
/**
 * Reemplaza una cadena dado un indice
 */
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character;
}