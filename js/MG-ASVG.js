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
          this.timelines.push({dom: timeline[t],frames:fr,fps: fps,current:0,ot: Date.now()});
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
        let ms=Date.now()-this.ot;
        let invfps=1000/timeline.fps;
        let frame=Math.floor(ms/invfps);
        timeline.frames[timeline.current].style="display:none";
        frame=frame%timeline.frames.length;
        timeline.frames[frame].style="";
        timeline.current=frame; // all set for next one.
//        console.log("current time: "+frame);
      }
      window.requestAnimationFrame(this.animate.bind(this));
    },
    stop: function () {
    }
  };
  ASVG.start();
}
