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
  hookupModal();
  hookupKeys(); // shortcuts!
  hookupCanvas();
  hookupMenu();
  hookupTools();
  hookupPlayControls();
}
function hookupKeys()
{
  view.keymodifiers=[];
  for(var i=0;i<20;i++) view.keymodifiers[i]=false;
  document.addEventListener("keydown",handleKeys);
  document.addEventListener("keyup",handleKeys);
}
function handleKeys(ev)
{
  var nr;
  if(ev.type=="keydown")
  {
    switch(ev.keyCode)
    {
        case 16: // modifier
        case 17: // modifier
        case 18: // modifier
          view.keymodifiers[ev.keyCode]=true;
          ev.stopPropagation(); //ok, guys, consider it done.
          ev.preventDefault(); // don´t do the normal space thing
          ev.returnValue = false; // IE
        break;
        case 8: // backspace
          ev.stopPropagation(); //ok, guys, consider it done.
          ev.preventDefault(); // don´t do the normal space thing
          ev.returnValue = false; // IE
        break;
        case 32: // space = play!
          ev.stopPropagation(); //ok, guys, consider it done.
          ev.preventDefault(); // don´t do the normal space thing
          ev.returnValue = false; // IE
        break;
        case 37: // arrow-key
        case 38: // arrow-key
        case 39: // arrow-key
        case 40: // arrow-key
          ev.stopPropagation(); //ok, guys, consider it done.
          ev.preventDefault(); // don´t do the normal space thing
          ev.returnValue = false; // IE
        break;
        case 190:
          nr=data.currentframe+1;
          setCurrentFrame(nr);
          ev.stopPropagation(); // don´t do the normal space thing.
        break;
        case 188:
          nr=data.currentframe-1;
          if(nr<0) nr=0;
          setCurrentFrame(nr);
          ev.stopPropagation(); // don´t do the normal space thing.
        break;
      default:
        console.log("keyCode: "+ev.keyCode);
    }
  }else
  {
    // turn off modifiers.
        view.keymodifiers[ev.keyCode]=false;
        ev.stopPropagation(); //ok, guys, consider it done.
        ev.preventDefault(); // don´t do the normal space thing
        ev.returnValue = false; // IE
  }
}
function hookupModal()
{
    document.getElementById("modal-close").addEventListener("click",closeModal);
    document.getElementById("NO-DONATION").addEventListener("click",closeModal);
    
}
function closeModal()
{
    document.getElementById("modal").style.display="none";
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
function hookupPlayControls()
{
  var tools=document.getElementById("timeline-controls");
  view.timeline_controls=tools.getElementsByTagName("button");
  for(var i=0;i<view.timeline_controls.length;i++)
  {
    view.timeline_controls[i].setAttribute("nr",i);
    view.timeline_controls[i].addEventListener("click",clickTimelineControl);
  }
  document.getElementById("framenr").addEventListener("change",gatherInput);
  document.getElementById("onion-start").addEventListener("change",gatherInput);
  document.getElementById("onion-end").addEventListener("change",gatherInput);

}
function hookupMenu()
{
  var tools=document.getElementById("menu");
  view.menu_buttons=tools.getElementsByTagName("button");
  for(var i=0;i<view.menu_buttons.length;i++)
  {
    view.menu_buttons[i].setAttribute("nr",i);
    view.menu_buttons[i].addEventListener("click",clickMenuButton);
  }
}
function clickMenuButton(ev)
{
  switch(ev.currentTarget.id)
  {
    case "new":
    case "props":
      document.getElementById("modal").style.display="block";
    break;
    case "open":
      document.getElementById("input_file").click();
      break;
    default:
    console.log("menu button: "+ev.currentTarget.id);
  }
  
}
function gatherInput(ev)
{
  switch(ev.currentTarget.id)
  {
    case "framenr":
//      console.log("set framenr to: "+Number(ev.currentTarget.value));
      setCurrentFrame(Number(ev.currentTarget.value));
    break;
    default:
     console.log("gather input: "+ev.currentTarget.id+ "has not been defined");
  }
}
function clickTimelineControl(ev)
{
  // pop playbutton.
  view.timeline_controls[1].className="";

  switch(ev.currentTarget.title)
  {
    case "play":
      ev.currentTarget.className="depressed";
    break;
    case "pause":
    break;
    case "loop":
      if(ev.currentTarget.getAttribute("active")=="true")
      {
          ev.currentTarget.setAttribute("active","false");
          ev.currentTarget.className="";
      }else
      {
          ev.currentTarget.className="depressed";
          ev.currentTarget.setAttribute("active","true");
      }
    break;
    case "onion skin":
      if(ev.currentTarget.getAttribute("active")=="true")
      {
          ev.currentTarget.setAttribute("active","false");
          ev.currentTarget.className="";
      }else
      {
          ev.currentTarget.className="depressed";
          ev.currentTarget.setAttribute("active","true");
      }
    break;
    case "view outline":
    case "view opaque":
    case "view rendered":
          document.getElementById("view-outline").className="";
          document.getElementById("view-opaque").className="";
          document.getElementById("view-rendered").className="";
          ev.currentTarget.className="depressed";
    break;
  }

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
function setCurrentFrame(nr)
{
  console.log("setCurrentFrame"+nr);
  data.currentframe=nr;
  var playhead=document.getElementById("playhead");
  playhead.style.left=13*data.currentframe+"px";
  var framenr=document.getElementById("framenr");
  framenr.value=nr;
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
          setCurrentFrame(nr);
        }
      }
      view.timeline_select.interrupt=setTimeout(showTimeLine,60);
  }
}