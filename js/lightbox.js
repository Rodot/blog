function is_youtubelink(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
function is_imagelink(url) {
    var p = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
    return (url.match(p)) ? true : false;
}
function setGallery(el) {
    var elements = document.body.querySelectorAll(".gallery");
    elements.forEach(element => {
        element.classList.remove('gallery');
	});

    // look for other links to make a gallery
    var link_elements = document.querySelectorAll("a[class*='lightbox-']");
    link_elements.forEach(link_element => {
        link_element.classList.remove('current');
    });
    link_elements.forEach(link_element => {
        if(el.getAttribute('href') == link_element.getAttribute('href')) {
            link_element.classList.add('current');
        }
    });
    // if more than 1 element, actually make the gallery
    if(link_elements.length>1) {
        document.getElementById('lightbox').classList.add('gallery');
        link_elements.forEach(link_element => {
            link_element.classList.add('gallery');
        });
    }
    var gallery_elements = document.querySelectorAll('a.gallery');
    var currentkey;
    Object.keys(gallery_elements).forEach(function (k) {
        if(gallery_elements[k].classList.contains('current')) currentkey = k;
    });
    // next key
    if(currentkey==(gallery_elements.length-1)) var nextkey = 0;
    else var nextkey = parseInt(currentkey)+1;
    //prev key
    if(currentkey==0) var prevkey = parseInt(gallery_elements.length-1);
    else var prevkey = parseInt(currentkey)-1;
    document.getElementById('next').addEventListener("click", function() {
        gallery_elements[nextkey].click();
    });
    document.getElementById('prev').addEventListener("click", function() {
        gallery_elements[prevkey].click();
    });
    //preload next image when current image is loaded
    var img = new Image();
    img.onload = function(){
        var preload = new Image();
        preload.src = gallery_elements[nextkey].getAttribute('href');
    }
    img.src = gallery_elements[currentkey].getAttribute('href')
}

function preload(imageArray, index) {
    index = index || 0;
    if (imageArray && imageArray.length > index) {
        var img = new Image ();
        img.onload = function() {
            // preload next one when done with current one
            preload(imageArray, index + 1);
        }
        imgurl = imageArray[index].getElementsByTagName("source")[0].getAttribute("srcset").split(" ")[0];
        img.src = imgurl;
    }
}

document.addEventListener("DOMContentLoaded", function() {

    //create lightbox div in the footer
    var newdiv = document.createElement("div");
    newdiv.setAttribute('id',"lightbox");
    document.body.appendChild(newdiv);

    //add classes to links to be able to initiate lightboxes
    document.querySelectorAll('a').forEach(element => {
        var url = element.getAttribute('href');
        if(url) {
            if(is_youtubelink(url) && !element.classList.contains('no-lightbox')) {
                element.classList.add('lightbox-youtube');
                element.setAttribute('data-id',is_youtubelink(url));
            }
            if(is_imagelink(url) && !element.classList.contains('no-lightbox')) {
                element.classList.add('lightbox-image');
                var href = element.getAttribute('href');
                var filename = href.split('/').pop();
                var split = filename.split(".");
                var name = split[0];
                element.setAttribute('title',name);
            }
        }
    });

    //remove the clicked lightbox
    document.getElementById('lightbox').addEventListener("click", function(event) {
        if(event.target.id != 'next' && event.target.id != 'prev'){
            this.innerHTML = '';
            document.getElementById('lightbox').style.display = 'none';
        }
    });
    
    //add the youtube lightbox on click
    document.querySelectorAll('a.lightbox-youtube').forEach(element => {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube-nocookie.com/embed/'+this.getAttribute('data-id')+'?autoplay=1&cc_load_policy=1&rel=0&color=white&loop=1&modestbranding=1"></iframe></div>';
            document.getElementById('lightbox').style.display = 'block';
            document.getElementById('lightbox').style.backgroundImage = '';
            setGallery(this);
        });
    });

    //add the image lightbox on click
    document.querySelectorAll('a.lightbox-image').forEach(element => {
        element.addEventListener("click", function(event) {
            event.preventDefault();
            // load img 
            var imgurl = this.getAttribute('href')
            document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="img" style="background: url(\''+imgurl+'\') center center / contain no-repeat;" title="'+this.getAttribute('title')+'" ><img src="'+imgurl+'" alt="'+this.getAttribute('title')+'" /></div><span>'+this.getAttribute('title')+'</span>';
            // use the inner low res img as a preview while loading high res
            thumburl = this.getElementsByTagName("source")[0].getAttribute("srcset").split(" ")[0];
            if(thumburl){
                document.getElementById('lightbox').style.backgroundImage = "url('"+thumburl+"')";
            }
            document.getElementById('lightbox').style.display = 'block';
            setGallery(this);
        });
    });

    preload(document.querySelectorAll('picture'));

});