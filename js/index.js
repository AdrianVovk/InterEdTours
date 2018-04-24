if (!location.hash) location.hash = "ru" // The default language
palette = new ColorThief()

$(() => {
   // Translation stuff
   replace = (search, out) => {
      document.body.innerHTML = document.body.innerHTML.replace(new RegExp(search, "g"), out);
      setup() // Correct errors that occur due to the body redeclaration. Also set up the page on first run
   }
   translate = () => $.getJSON(`data/translation-${location.hash.replace("#","")}.json`, (json) => { for (template in json) replace(template, json[template] + "\u200B") })
   untranslate = () => $.getJSON(`data/translation-${location.hash.replace("#","")}.json`, (json) => { for (template in json) replace(json[template] + "\u200B", template) })
   changeLanguage = (lang) => {
      createThemedCssRules("transparent;", "transparent;")
      setTimeout(() => {
       untranslate();
       location.hash = lang.substring(0,2);
       translate()
      }, 300)
      setTimeout(onChangeImage, 800)
    }
   translate() // Set the language to the desired choice

   onChangeImage()
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
   })

   selectTab = (index) => {
      currentIndex = index
      if ($(navChildren[index]).hasClass("selected")) return collapsePanel()

      zoom(false)
      $("#content").addClass("expanded")


      if (!navChildren.hasClass("selected"))
         $("#pager-wrap").css("scroll-behavior", "unset")
      $("#pager-wrap").scrollLeft(index * window.innerWidth)
      $("#pager-wrap").css("scroll-behavior", "")


      setTimeout(() => zoom(true), 500)

      deselectAllNav()
      $(navChildren[index]).addClass("selected")
   }

   // Touch gestures
   currentIndex = -1;
   $('#pager-wrap').swipeleft(function(e) { selectTab(currentIndex + 1) }).swiperight(function(e) { selectTab(currentIndex - 1) })
   $("#pager-wrap").tap(() => {
      zoom(false)
      setTimeout(collapsePanel, 200)
   })
}

onChangeImage = (index) => {
   img = document.createElement("img")
   img.src = "./res/img.jpg"
   img.onload = () => {
         color = one.color("rgb(" + palette.getColor(img).join() + ")")
         createThemedCssRules(color.hex(), ((color.lightness() > 0.5) ? "#ffffff" : "#000000"))
   }
}

createThemedCssRules = (color, text) => {
   $("#colors").remove()
   $(`<style id="colors">
      #content {background-color:${color}99}
      #title,#nav {background-color:${color}DD; color:${text} !important;}
      .page, #nav a.selected {background-color:${color} !important; color:${text} !important;}
      #content.expanded > #nav a:hover {background-color: ${color}cc;color:${text};}
      .pg3 div {color: ${text};}
   </style>`).appendTo("body")
}