# emmetJS
Convert Emmet sentence in a HTML Collection
## Introduction
This library is a fully raw Javascript, built to make easier the creation of nodes structure in javascript, code less and be more efficient.

This library use the Emmet abbreviation to make this possible, and transform those abbreviations in a complete List of HTML Nodes

## Emmet Sentences
To understand how Emmet work, go to official website [emmet.io](http://emmet.io/) and read the documentation.

The unique differnce between the two syntax, it's in custom attributes, where the delimiter it's comma and not a whitespace as the original.

## How it Work

Only add the script to your code:

````javascript
<script type="text/javascript" src="emmet.js"></script>
````

## Methods and Functions

When you have the script in your website, you can create a Emmet object with your emmet sentences as the parameter. Like this:

````javascript
var emmet = new Emmet("table[width=300,height=300]>#row$*8>.col{Hola $$$@0}*8");
````

After that you can access to a lot of methods:

+ **Emmet.prototype.add** = function(string_to_add) => Add a new String between parenthesis in your current Emmet sentences

+ **Emmet.prototype.remove** = function(num_begin,num_end) => Remove a portion of the emmet sentences, from the num_begin to num_end

+ **Emmet.prototype.removeAll** = function() => Remove completely the emmet sentence

+ **Emmet.prototype.search** = function(string) => Find a concrete word in the emmet sentence

+ **Emmet.prototype.generateNodes** = function(string) => Create a HTML Nodes List

+ **Emmet.prototype.generateHTML** = function(string) => Create a HTML String

## Static Method

If you don't want to instance a new class, and you want to use the library in very few lines, you can use the static function **createEmmetNodes**, like this:

````javascript
var node_html = createEmmetNodes("table[width=300,height=300]>#row$*8>.col{Hola $$$@0}*8");
````
This static function evaluate your emmet sentences, and return a tree of html nodes, that you can use wherever you want.

