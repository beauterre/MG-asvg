# MG-asvg
Animated SVG timelines on any page with the Making Games - Animated SVG player. (MG-ASVG.js)
I  made this, because I want to sell web-animation and nobody seems to have a good way of placing these in - for instance - wordpress. Animated Gif has it´s drawbacks especially if you want to support multi-res displays like the Ipad or if
you want to start and stop your animation with javascript.
So I thought, why not make a general solution and give it away for free on github. 
This way, I get people using it and I´ll find more issues and this will make my product more stable.
It seemed (and still seems) rather straight forward what has to happen, it's just a load of work.

## MG-asvg-player
MG-ASVG.js is the script you have to include to play these kind of animations, anywhere on the page. 
You can find it in the folder "js"

## demos
Simple demo´s https://hjalmarsnoep.github.io/MG-asvg/ (I´ll make something fun later)

## discussions
If you have questions or a bug or anything, even if you are not a member of github, you can go here:
[Discussions](https://github.com/HjalmarSnoep/MG-asvg/discussions/1)

## placing an ASVG on the HTML page
It works the same as any SVG, so you can use normal layout techniques..
It is a little bit different from using an image or animated gif, since an image is a bitmap
and SVG is vector (infinite resolution). You do not have to include different sources to get more resolutions.
The best way is to style an SVG like you would any block-element.
The SVG will stretch according to the preserveAspectRatio attribute.
(kind of like using "cover", but with more possibilities)

## How to make an ASVG

### convert from adobe Animate
I am now working on a quick tool to convert Animate files to this format.
You can just drag the exported SVG's into the dropbox.
https://hjalmarsnoep.github.io/MG-asvg/converter/animate/convert_from_animate_svg_export.html

An example of how to use the result is here:
https://hjalmarsnoep.github.io/MG-asvg/converter.html

It's not working perfectly yet, somehow morphs aren't getting through and I feel there is more optimization to get.
Right now ASVG is 25% of just the exported SVG's at 132 frames. More frames with the same library will result in a
higher compression.
Other things I could do to compress=repeat frames that are still. Create and use custom morphic and tweening options in ASVG.js

### EDITOR
I understand that having a serious, free editor is going to make this format. However that's quite a tall order.
But I think I am up for it.
The editor is NOT finished yet... Working on the editor in my free-time:
https://hjalmarsnoep.github.io/MG-asvg/editor/editor.html
if you want to speed the process along, feel free to donate me money, this will push me with my nose in the laptop for a few hours out of sheer guilt for getting money..

### USE A TEXT EDITOR
- make or open an SVG, 
- add an attribute "animated"
- set a group to class "timeline" and groups within that svg

groups in the timeline group will be displayed in order.

For example:

```
<svg viewBox="0 0 1920 1080" animated="true" width="1920" height="1080" style="width: 100%; height: 100%;">
<rect x="0" y="0" width="1920" height="1080" fill="#eee"></rect>
<circle cx="960" cy="540" r="512" fill="#0ff"></circle>
 <g class="asvg-timeline" playback="pingpong" fps="25" id="timeline1" style="display: none;">
  	<g>
     <circle cx="512" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="600" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="700" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="800" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="900" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="1000" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="1100" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="1200" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="1300" cy="512" r="62" fill="#000"></circle>
  	</g>
  	<g>
     <circle cx="1400" cy="512" r="62" fill="#000"></circle>
  	</g>
  </g>
 </svg>
```
If you add the MG-ASVG.js script to this, you will see an animated ball.
Interestingly a SVG can actually contain a script element itself, so you could also make a animation that plays without a page!
Other examples can be found in "demo".

## future
An animation editor is something I am considering now. It would easy the use of SVG instances and library control. You could do actual drawing in any SVG editor and import the normal SVG to make an ASVG.
I could host it in the github docs :)

## fallback and crossbrowser support
A ASVG is a normal SVG, which is supported accross the board (https://caniuse.com/svg), 
but all frames will be displayed at once. 
To prevent this, set a style="display: none" to the timeline and create a underlying preview, 
to show the preview in places that don´t support javascript.

If ecmascript 6 is supported it will run the animation.
So everywhere but on opera mini (https://caniuse.com/?search=es6)

## any other issues?
I will open issues shortly. I am working on it, for now, just fork and follow or download and check back.
