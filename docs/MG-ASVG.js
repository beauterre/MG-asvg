// the asvg pleyer automatically looks for any SVG´s with the attribute _ animated="true" _ on the page
// this is setup to be called as an external script and works as a singleton instance module.
// create by Hjalmar Snoep
if(typeof(ASVG)=="undefined")
{
  var ASVG =
  {
    ot: Date.now(), // offset time
    playing: true, // this allows the loop to stop
    start: function ()
    {
      console.log("MG-ASVG v 2022-05-23-14-22")
      this.playing=true;
      // analyse the document, find asvg´s
      this.timelines=[];
      this.svgs=document.body.getElementsByTagName("svg");
      for(let i=0;i<this.svgs.length;i++)
      {
        let timeline=this.svgs[i].getElementsByClassName("asvg-timeline");
        for(let t=0;t<timeline.length;t++)
        {
          // now initiate all frames in this timeline.
          let fr=timeline[t].getElementsByTagName("g");
          let f=0;
          for(f=0;f<fr.length;f++)
          {
            fr[f].style="display: none";
          }
          timeline[t].style="";
          let fps=25;
          let now=Date.now();
          let playing=true;
          if(timeline[t].hasAttribute("fps"))
              fps=Number(timeline[t].getAttribute("fps"));
          let playback="looping";
          if(timeline[t].hasAttribute("playback"))
              playback=timeline[t].getAttribute("playback");
          if(playback == "mouseover")
          {
            // we need to add a listener to the target!
            let target=timeline[t].getAttribute("target");
            var target_dom=document.getElementById(target);
            if(target_dom==null)
            {
              console.log("couldn`t find target: "+target);
            }else
            {
              playing=false;
            }
            
          }
          this.timelines.push({dom: timeline[t],f:fr,fps: fps,cf:0,ot: now, playback:playback, playing: playing});
          if(target_dom!==null)
          {
              target_dom.addEventListener("pointerover",this.mouseEvent.bind(this));
              target_dom.addEventListener("pointerout",this.mouseEvent.bind(this));
              target_dom.setAttribute("timeline",this.timelines.length-1);
          }
        }
      }
      console.log("ASVG- "+this.timelines.length+" timelines initiated");
      //console.log(JSON.stringify(this.timelines));
      this.animate();
    },
    animate: function ()
    {
      let t=0;
      for(t=0;t<this.timelines.length;t++)
      {
        let timeline=this.timelines[t];
        timeline.f[timeline.cf].style="display:none"; // remove the OLD frame
        let ms=Date.now()-this.ot;
        let invfps=1000/timeline.fps;
        let frame=0;
        if(timeline.playing) frame=Math.floor(ms/invfps);
        let loop=timeline.dom.getAttribute("loop");
        switch(timeline.playback)
        {
          case "mouseover":
            if(loop=="true")
            {
              frame=frame%timeline.f.length;
            }
          break;
          case "pingpong":
            frame=frame%(timeline.f.length*2-2);
            if(frame>timeline.f.length-1)
            {
              frame=(timeline.f.length*2-frame-2)%timeline.f.length;
            }
          break;
          case "forward":
            if(loop=="true")
            {
              frame=frame%timeline.f.length;
            }
          break;
          
          default: // looped forward is default
            frame=frame%timeline.f.length;
        }
//        timeline.dom.setAttribute("currentFrame",frame);
        if(frame<0) frame=0;
        if(frame>timeline.f.length-1) frame=timeline.f.length-1;
        timeline.f[frame].style="";
        timeline.cf=frame; // all set for next one.
//        console.log("current time: "+frame);
      }
      if(this.playing)
        window.requestAnimationFrame(this.animate.bind(this));
    },
    mouseEvent: function (ev) {
      if(ev.currentTarget.hasAttribute("timeline"))
      {
//        console.log("pointerover "+ ev.currentTarget.id+" -> timeline"+ev.currentTarget.getAttribute("timeline"));
        switch(ev.type)
        {
          case "pointerover":
            this.timelines[Number(ev.currentTarget.getAttribute("timeline"))].playing=true;
          break;
          case "pointerout":
            this.timelines[Number(ev.currentTarget.getAttribute("timeline"))].playing=false;
          break;
        }
      }
      
    },
    stop: function () {
    }
  };
  ASVG.start();
}
