if (!location.hash) location.hash = "ru" // The default language
palette = new ColorThief()

$(() => {
   // Translation stuff
   replace = (search, out) => {
      document.body.innerHTML = document.body.innerHTML.split(search).join(out)
   }
   translate = () => $.getJSON(`data/translation-${location.hash.replace("#","")}.json`, (json) => { 
      for (template in json) replace(template, json[template] + "\u200B")
      setup() // Correct errors that occur due to the body redeclaration. Also set up the page on first run
   })
   untranslate = () => $.getJSON(`data/translation-${location.hash.replace("#","")}.json`, (json) => { for (template in json) replace(json[template] + "\u200B", template) })
   changeLanguage = (lang) => {
      createThemedCssRules("transparent", "transparent")
      setTimeout(() => {
       untranslate();
       location.hash = lang.substring(0,2);
       translate()
      }, 300)
      setTimeout(() => {
      	currentImage--
      	nextImage()
      }, 800)
    }
   translate() // Set the language to the desired choice

   // Load Initial Image
   currentImage = Math.floor(Math.random() * images.length) - 1
   nextImage()
});

setup = () => {
   navChildren = $("#nav").children()

   deselectAllNav = () => navChildren.removeClass("selected")
   collapsePanel = () => {
      deselectAllNav()
      $("#content").removeClass("expanded")
   }
   zoom = (zoomed) => $("#pager div.page").toggleClass("zoomed", zoomed)
   $(document).on("keyup", (event) => {
      if (event.keyCode == 27) collapsePanel()
      if (event.keyCode == 39) nextImage()
      if (event.keyCode == 37) prevImage()
   })
   currentIndex = -1;
   selectTab = (index) => {
      currentIndex = index
      if ($(navChildren[index - 1]).hasClass("selected")) return collapsePanel()
      
      $("#content").addClass("expanded")

	  scrollToIndex(index)

      deselectAllNav()
      $(navChildren[index - 1]).addClass("selected")
   }

   $(window).resize(() => scrollToIndex(currentIndex))

   scrollToIndex = (index) => {
      $("#pager-wrap").removeClass("lock").stop().animate({
      	 scrollTop: 0,
      	 scrollLeft: index * window.innerWidth
      }, 500, () => {	
      	  setTimeout (() => $("#pager-wrap").addClass("lock"), 500);
      });
   }
   scrollToIndex (1);

   // Touch gestures
   $("#slideshow").swipeleft(nextImage).swiperight(prevImage)
}

images = [
	"./res/01.jpg",
	"./res/06.jpg",
	"./res/08.jpg",
	"./res/10.jpg",
	"./res/13.jpg",
	"./res/09.jpg",
	"./res/15.jpg",
	"./res/03.jpg",
	"./res/11.jpg",
	"./res/02.jpg",
	"./res/14.jpg",
	"./res/12.jpg",
]
currentImage = -1;
imageInit = false;
onChangeImage = (index) => {
   	 $("#slideshow").attr("src", images[index])
   	 imgChanged = true;
}
onImgLoad = () => {
	if (imgChanged) {
		color = one.color("rgb(" + palette.getColor($("#slideshow")[0]).join() + ")")
		createThemedCssRules(color.hex(), ((color.lightness() < 0.5) ? "#ffffff" : "#000000"))
		imgChanged = false;
	}
}
nextImage = () => {
	currentImage++;
	if (currentImage >= images.length) {
		currentImage = 0;
	}
	onChangeImage(currentImage)
}
prevImage = () => {
	currentImage--;
	if (currentImage < 0) {
		currentImage = images.length - 1;
	}
	onChangeImage(currentImage)
}

createThemedCssRules = (color, text) => {
   $("#colors").remove()
   $(`<style id="colors">
	  #content {background-color:${color}99}
      #title,#nav {background-color:${color}DD; color:${text} !important;}
      .page, #nav a.selected {background-color:${color} !important; color:${text} !important;}
      #content.expanded > #nav a:hover {background-color: ${color}cc;color:${text};}
      .pg3 div {color: ${text};}
      hr {color: ${text}aa; border-color: ${text}aa; background-color: ${text}aa; }
      .previmg, .nextimg { background-color: ${color}cc; color: ${text} }
   </style>`).appendTo("body")
}