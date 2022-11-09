// the asvg player automatically looks for any SVG´s with the attribute _ animated="true" _ on the page
// this is set up to be called as an external script and works as a singleton instance module.
// create by Hjalmar Snoep
if(typeof(ASVG)=="undefined")
{
  var ASVG =
  {
    ot: Date.now(), // offset time
    playing: true, // this allows the loop to stop
    eventListener: null,
    start: function ()
    {
      console.log("MG-ASVG v 2022-05-23-17-41\nhttps://github.com/HjalmarSnoep/MG-asvg");
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
          let fr=timeline[t].children;
          let f=0;
    		  console.log("timeline"+t+"found "+fr.length+" frames");
          for(f=0;f<fr.length;f++)
          {
            fr[f].style="display: none";
          }
          timeline[t].style="";
          let fps=25;
          let now=Date.now();
          if(timeline[t].hasAttribute("fps"))
              fps=Number(timeline[t].getAttribute("fps"));
          let playback="looping";
          if(timeline[t].hasAttribute("playback"))
              playback=timeline[t].getAttribute("playback");
          if(timeline[t].hasAttribute("playback"))
              playback=timeline[t].getAttribute("playback");

          let playing=true;
          if(timeline[t].hasAttribute("playing"))
              playing=timeline[t].getAttribute("playing");
          if(timeline[t].hasAttribute("playing"))
              playing=timeline[t].getAttribute("playing");
          

          let frame=-1;
          if(timeline[t].hasAttribute("frame"))
              frame=timeline[t].getAttribute("frame");
            
          this.timelines.push({dom: timeline[t],f:fr,fps: fps,cf:frame,ot: now, playback:playback, playing: playing});
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
        if(timeline.cf==-1)
        {
          timeline.cf=0;
          // special case, we just started playing AND we skipped 0, but it has an event.
          if(timeline.f[0].hasAttribute("event"))
          {
            if(ASVG.eventListener!==null)
            {
              ASVG.eventListener(timeline.f[0].getAttribute("event"));
            }else
            {
                console.log("no event listener: "+timeline.f[0].getAttribute("event"));
            }
          }
        }
        timeline.f[timeline.cf].style="display: none"; // remove the OLD frame
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
        timeline.f[frame].style.display="";
        if(timeline.cf!=frame)
        {
          timeline.cf=frame;
          if(timeline.f[frame].hasAttribute("event"))
          {
            if(ASVG.eventListener!==null)
            {
              ASVG.eventListener(timeline.f[frame].getAttribute("event"));
  
            }else
            {
                console.log("no event listener: "+timeline.f[frame].getAttribute("event"));
            }
          }
        }
//        console.log("current time: "+frame);
      }
      if(this.playing)
      {
        window.requestAnimationFrame(this.animate.bind(this));
      }
    },
    stop: function () {
      this.playing=false;
    },
    stopTimeline: function (id) {
      for(let t=0;t<this.timelines.length;t++)
      {
        if(this.timelines[t].dom.id==id)
        {
          this.timelines[t].playing=false;
          this.timelines[t].lastframe=-1; // make sure events at frame 0 fire!
        }
      }
    },
    startTimeline: function (id) {
      for(let t=0;t<this.timelines.length;t++)
      {
        if(this.timelines[t].dom.id==id)
        {
          this.timelines[t].playing=true;
        }
      }
    }
  };
  ASVG.start();
}
