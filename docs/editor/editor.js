var data={currentframe:0,w:1920,h:1080,frames:[],keys:[]};
var view={
  margin: 100,
  pointer: {x:0,y:0,down:0,dragging:false},
  active_tool:{nr:1,name:"brush"},
  timeline_select: {start:-1,end:-1,selecting:false,interrupt:-1},
  currentframe: {strokes:[]}
};


init();

function init()
{
  showTimeLine();
  hookupCanvas();
  hookupTools();
}
function hookupCanvas()
{
  view.canvas=document.getElementById("canvas");
  view.canvas.width=data.w+view.margin*2;
  view.canvas.height=data.h+view.margin*2;
  view.canvas.addEventListener("pointerup",canvasPointer);
  view.canvas.addEventListener("pointerdown",canvasPointer);
  view.canvas.addEventListener("pointermove",canvasPointer);
  view.ctx=view.canvas.getContext("2d");
  view.ctx.fillStyle="#888";
  view.ctx.fillRect(0,0,data.w+view.margin*2,data.h+view.margin*2);
  view.ctx.fillStyle="#fff";
  view.ctx.fillRect(view.margin,view.margin,data.w,data.h);
}
function canvasPointer(ev)
{
  var rect=ev.currentTarget.getBoundingClientRect();
  var x=ev.clientX-rect.x-view.margin;
  var y=ev.clientY-rect.y-view.margin;
  document.getElementById("footer").innerHTML=Math.floor(x)+","+Math.floor(y);
}
function hookupTools()
{
  var tools=document.getElementById("toolbar");
  view.tools=tools.getElementsByClassName("tool");
  for(var i=0;i<view.tools.length;i++)
  {
    if(view.active_tool.nr==i)
    {
      view.tools[i].className="tool active";
    }else
    {
      view.tools[i].className="tool";
    }
    view.tools[i].setAttribute("nr",i);
    view.tools[i].addEventListener("click",activateTool);
  }
}
function activateTool(ev)
{
  view.active_tool.name=ev.currentTarget.getAttribute("title");
  view.active_tool.nr=Number(ev.currentTarget.getAttribute("nr"));
  console.log("activate tool: "+view.active_tool.name);
  switch(view.active_tool.name)
  {
    case "select":
        view.canvas.style.cursor="auto";
    break;
    case "eraser":
        view.canvas.style.cursor="not-allowed";
    break;
    case "bucket":
        view.canvas.style.cursor="not-allowed";
    break;
    case "zoom":
        view.canvas.style.cursor="zoom-in";
    break;
    case "pull":
        view.canvas.style.cursor="grab";
    break;
      default:
        view.canvas.style.cursor="crosshair";
  }
  hookupTools();
}

function showTimeLine()
{
  if(view.timeline_select.interrupt!=-1)
    clearTimeout(view.timeline_select.interrupt);

  var numbers=document.getElementById("timeline-numbers");
  var frames=document.getElementById("timeline-track");
  numbers.innerHTML="";
  frames.innerHTML="";
  for(var i=0;i<100;i++)
  {
    var f=document.createElement("div");
    f.setAttribute("nr",i);
    f.addEventListener("pointerdown",timelinePointer);
    f.addEventListener("pointerup",timelinePointer);
    if((i)%5===0)
    {
      f.className="k nr";
      f.innerHTML=i;
    }else
    {
      f.className="nr";
    }
    numbers.appendChild(f);
    numbers.style.width=100*13+"px";
    // do the frame
    var f=document.createElement("div");
        if((i)%5===0)
    {
      if(view.timeline_select.start<=i && view.timeline_select.end>=i)
      {
        f.className="frame key selected";
      }else
      {
        f.className="frame key";
      }
    }else
    {
      if(view.timeline_select.start<=i && view.timeline_select.end>=i)
      {
        f.className="frame tween selected";
      }else
      {
        f.className="frame tween";
      }
    }
    f.setAttribute("nr",i);
    f.addEventListener("pointerdown",timelinePointer);
    f.addEventListener("pointermove",timelinePointer);
    f.addEventListener("pointerup",timelinePointer);
    frames.appendChild(f);
    frames.style.width=100*13+"px";
  }
  var playhead=document.createElement("div");
  playhead.id="playhead";
  playhead.style.left=13*data.currentframe+"px";
  playhead.innerHTML="▼";
  numbers.appendChild(playhead);
}


function timelinePointer(ev)
{
  var nr=Number(ev.currentTarget.getAttribute("nr"));
  if(ev.type=="pointerdown")
  {
    data.currentframe=nr;
    view.timeline_select.selecting=true;
    view.timeline_select.start=nr;
    view.timeline_select.end=nr;
  }
  if(view.timeline_select.selecting)
  {
      if(ev.type=="pointermove")
      {
        view.timeline_select.end=nr;
      }
      if(ev.type=="pointerup")
      {
        view.timeline_select.selecting=false;
        view.timeline_select.end=nr;
        if(view.timeline_select.end==view.timeline_select.start)
        {
          // you clicked a frame!
        }
      }
      view.timeline_select.interrupt=setTimeout(showTimeLine,60);
  }
}