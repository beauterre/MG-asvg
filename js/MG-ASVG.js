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
          if(timeline[t].hasAttribute("fps"))
              fps=Number(timeline[t].getAttribute("fps"));
          let playback="looping";
          if(timeline[t].hasAttribute("playback"))
              playback=timeline[t].getAttribute("playback");
          this.timelines.push({dom: timeline[t],f:fr,fps: fps,cf:0,ot: Date.now(), playback:playback});
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
        let frame=Math.floor(ms/invfps);
        switch(timeline.playback)
        {
          case "pingpong":
            frame=frame%(timeline.f.length*2-1);
            if(frame>timeline.f.length-1)
            {
              frame=(timeline.f.length*2-frame-1)%timeline.f.length;
            }
          break;
          default:
            frame=frame%timeline.f.length;
        }
//        timeline.dom.setAttribute("currentFrame",frame);
        timeline.f[frame].style="";
        timeline.cf=frame; // all set for next one.
//        console.log("current time: "+frame);
      }
      window.requestAnimationFrame(this.animate.bind(this));
    },
    stop: function () {
    }
  };
  ASVG.start();
}
