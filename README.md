# Metalogue

<p align="center">
<img src="https://github.com/Bortoli22/Metalogue/blob/master/metalogue/src/assets/logo.png" height="25%" width="25%">
</p>

## About
Metalogue is an online, text-editing interface that caters to the creation of game dialogue. Metalogue generates metadata for each line of dialogue you write, and this data can be used in conjunction with the appropriate scripting to create a full-fledged dialogue system. Through an intuitive, clickable interface, the text-editor allows for a variety of dialogue types, from multi-path dialogue options to randomized greetings. Dialogue you write can be exported using Metalogue's metadata (MM) scheme as a text or res file, which can then be parsed by and interpreted by the associated scripts. Additionally, the dialogue can be exported to both XML and JSON, with an editable blueprint for its formatting

## MM Internals
If you were type the following in the editor:

 ``` Hello there, traveler!```
  
And make the text into an ‘option’ with two possible responses the following would be generated:

 ``` \*/ 2B5 X27cT -o x17s5 t2116 /\* Hello there, traveler!```
  
Taking a look at that particular tag to break down the components:
```
\*/ 	2B5 		X27cT 		-o 		x17s5 		t2116		 /\*
  
 LS	spID		msgID		flags		args[0]		args[1]		RS
 ``` 
*Note that there is multi flag support, but each flag will have its own set of args, so a tag such as “*/ 2B5 X27cT -o x17s5 t2116 -q gJ99T /*” is considered valid.

## MM Components

LS - Left Start, the signal for the interpreter to begin parsing the data

spID - The speaker ID that is used in preprocessing to sort the dialogue. The dialogue belonging to a particular character or object is grouped according to the spID

msgID - The ID of the particular message that is referenced in methods and arguments

flags -	one of several optional flags that make up the heart of the (hopefully) robust dialogue engine

-o OPTION: Used when the message garners a player response and will segue into a popup box with the options that can be chosen being the messages with msgIDs in [args]

-q QUEUE: Used when the message changes the queued message (that which is to be seen the next time the character or object is interacted with) to the message with msgID in [args].

-r ROULETTE: the message is one of several that can be selected to be displayed. Randomly, either this message or one of the messages with msgIDs in [args]

-s SEQUENCE: the message is one in a series of messages that are to appear consecutively without reopening dialogue. 

-t TERMINUS: the message is the final message in the sequence, and once read will close the dialogue box

-x EVENT: the message holds some consequence that needs to be captured, and the data in [args] will be emitted upon closure of the message

-z OPENER: a compile-time flag that determines the first message to be queued for the character or object with the associated spID

[args] - One or more strings, either data or msgIDs, to be used

RS - Right Stop, the signal for the interpreter to stop parsing the data
