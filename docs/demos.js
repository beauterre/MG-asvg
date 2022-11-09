var data=[
  "forward playback",
  "looped forward playback",
  "pingpong playback",
  "multiple-timelines",
  "nested-timelines",
  "multiple-svgs",
  "animated-buttons",
  "converter animate",
  "events",
  ];
var menu=document.getElementById("menu");
var header=document.createElement("div");
header.id="header";
document.body.appendChild(header);
header.innerHTML="<big>MG-ASVG examples</big> <small>by Hjalmar Snoep</small>";
console.log(menu);
var ul=document.createElement("ul");
menu.appendChild(ul);
for(var i=0;i<data.length;i++)
{
  var li=document.createElement("li");
  ul.appendChild(li);
  var a=document.createElement("a");
  a.innerHTML=data[i];
  a.href=data[i].split(" ").join("-")+".html";
  if(location.href.includes(a.href))
  {
    a.className="active";
  }
  li.appendChild(a);
}
