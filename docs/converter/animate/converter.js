var dropZone = document.getElementById('dropzone');
var data={files:[]};
// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});
var interval=-1;

// Get file data on drop
dropZone.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files; // Array of all files

	// get the basename
	var file=files[0];
	for(var i=file.name.length-5;i>=0;i--)
	{
		var code=file.name.charCodeAt(i);
		console.log(code);
		if(code<48 || code>58) break;		
	}
	data.basename=files[0].name.substring(0,i+1);
    for (var i=0, file; file=files[i]; i++) 
	{
		var nr=Number(file.name.substring(data.basename.length,file.name.length-4));
		console.log(file);
		var reader = new FileReader();

        reader.onload = function(e2) {
             // finished reading file data.
             var img = document.createElement('img');
             img.src= e2.target.result;
             document.getElementById("frames").appendChild(img);
			 data.files.push(
			 {
				 nr:nr,
				 data:e2.target.result
			 });
        }

        reader.readAsDataURL(file); // start reading the file data.
    }
	data.frames=[];
	setTimeout(allRead,200);
});
var current_file=0;
function allRead()
{
	var feedback = document.getElementById('feedback');
	dropZone.style.display="none";
	feedback.innerHTML="analysing:"+ data.files.length+" files!";
	// convert to SVG's, place them on stage.
	current_file=0;
	analyze();
//	console.log(JSON.stringify(data));
}
function analyze()
{
	var file=data.files[current_file].data;
	var svg=file.substring(("data:image/svg+xml;base64,").length);
	feedback.innerHTML=atob(svg);
	var svgs=feedback.getElementsByTagName("svg");
	if(svgs.length!=1)
	{
		feedback.innerHTML="not an SVG!";
		current_file++;
		if(current_file<data.files.length) setTimeout(analyze,100);
		return;
	}
	// now we know there is an SVG
	svg=svgs[0];
	// analyse the sucker and store objects in data.files.
	var svg_props={};
	svg_props.width=svg.getAttribute("width");
	svg_props.height=svg.getAttribute("height");
	svg_props.viewbox=svg.getAttribute("viewBox");
	data.files[current_file].svg=svg_props;
	var defs=svg.getElementsByTagName("defs")[0];
	// create a lib if not there!
	if(typeof(data.lib)=="undefined")
	{	
		data.lib={};
	}
	for(var i=0;i<defs.children.length;i++)
	{
		var elem=document.getElementById(defs.children[i].id);		
		data.lib[defs.children[i].id]=[elem.outerHTML];
//		data.lib[defs.children[i].id]=elem.outerHTML.split("\n");
//		console.log(elem.outerHTML);
//		console.log(data.lib[defs.children[i].id]);
	}
	// now get the ACTUAL SVG and put it in a frame!
	var frame=[];
	for(var i=0;i<svg.children.length;i++)
	{
		if(svg.children[i].tagName!="defs")
		{
			frame.push([svg.children[i].outerHTML]);
//			frame.push(svg.children[i].outerHTML.split("\n"));
			//console.log(svg.children[i]);
		}
	}
	data.frames.push(frame);

//	code.innerHTML=str;
	// lib has been gathered.
//	console.log(data);
	// we have analyzed one, go on
	feedback.innerHTML="analysed "+current_file+" of "+data.files.length+" frame";
	current_file++;
	if(current_file<data.files.length) 
		setTimeout(analyze,100);
	else
	{
		// analysis done, now merge them together, keeping the lib!
		feedback.innerHTML="done analyzing, creating ASVG.";
		var code=document.getElementById("data");
		var str=JSON.stringify(data,null,2);
		str=str.split("<").join("&lt;");
		code.innerHTML=str;
		
		var svg="";
		svg+='<svg animate="true" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="'+data.files[0].svg.width+'" height="'+data.files[0].svg.height+'" viewBox="'+data.files[0].svg.viewbox+'">\n';
		svg+='<defs>\n';
		for(var all in data.lib)
		{
			svg+=data.lib[all]+"\n";
		}
		svg+='</defs>\n';
		svg+='<g class="asvg-timeline" playback="forward" loop="false" fps="25" id="timeline1" style="display: none;">\n';
		for(var f=0;f<data.frames.length;f++)
		{
			svg+='<g id="'+data.basename+"_"+f+'">\n';
			for(var l=0;l<data.frames[f].length;l++)
			{
				svg+=" "+data.frames[f][l]+"\n";
			}
			svg+="</g>\n";
		}
		svg+='</g>\n';
		svg+='</svg>';
		// now we will shorten the ID's in lib!
		var counter=0;
		for(var all in data.lib)
		{	
			svg=svg.split(all).join("I"+counter);
			counter++;
		}
		
		svg=svg.split("<").join("&lt;");
		code.innerHTML=svg;
		
	}
}