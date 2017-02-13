# emmetJS
Convert Emmet sentence in a HTML collection of nodes
## Introduction
This library is a fully raw Javascript, built to make easier the creation of nodes structure in javascript, to code less and to be more efficient.

This library use the Emmet abreviation to make this possible, and transform those abbrevations in a complete full HTML Collections of Nodes.

## Emmet Sentences
To understand how Emmet work, go to official website [emmet.io](http://emmet.io/) and read the documentation.

The unique differnce between the two syntax, it's in custom attributes, where the delimiter it's comma and not a whitespace as original.

## How it Work

Only add the script to your code:

````javascript
<script type="text/javascript" src="emmet.js"></script>
````

## Methods and Functions

When you have the script in your website, you can create a Emmet object with your emmet sentences as parameter. Like this:

`````javascript
var emmet = new Emmet("table[width=300,height=300]>#row$*8>.col{Hola $$$@0}*8");
````

After that you can access to a lot of methods:

+ Emmet.prototype.add = function(string_to_add) => Add a new String between parenthesis in your current Emmet sentences

+ Emmet.prototype.remove = function(num_begin,num_end) => Remove a portion of the sentence beginnining with the first params and ending with second 

+ Emmet.prototype.removeAll = function() => Remove completely the emmet sentence

+ Emmet.prototype.search = function(string) => Find a concret word inemnmet sentence

+ Emmet.prototype.generateNodes = function(string) => Create a HTML Collection List

+ Emmet.prototype.generateHTML = function(string) => Create a HTMNL String


