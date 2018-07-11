#! /usr/bin/env node

// Imports
const fs = require("fs")
const translate = require("google-translate-api")

// Phrase processing code
tasks = 0
processPhrase = (selector) => {
   translate(english[selector], {from: "en", to: "ru"}).then(result => {
      output[selector] = result.text
      tasks--;
   });
}

// Read data
let initialInput = fs.readFileSync("data/translation-en.json")
const english = JSON.parse(initialInput)
const output = JSON.parse(initialInput)

// Set other language
output["@!other-lang-id@"] = "en"
output["@!other-lang@"] = "English"

// Translate
for (key in english) {
   if (!key.startsWith("@!") && !key.startsWith("~")){
      processPhrase(key)
      tasks++;
   }
}

// Wait for task to complete
setInterval(() => {
   if (tasks == 0) finish()
}, 100)

// When task completed
finish = () => {
	// Include manual overrides
	for (key in english) if (key.startsWith("~")) {
		output[key.replace("~", "@")] = output[key];
	}

   // Make case consistant
   doToFirst = (func, text) => {return (text.charAt(0)[func]() + text.slice(1))}
   for (key in english) {
      upperEnglish = 0; // Count the english uppercase letters
      for (word of english[key].split(".")[0].split(" ")) if (word.charAt(0) != word.charAt(0).toLowerCase()) upperEnglish++;

      if (upperEnglish == 0) doToFirst("toLowerCase", output[key])
      if (upperEnglish == 1) output[key] = doToFirst("toUpperCase", output[key])
      if (upperEnglish > 1) {
         words = output[key].split(" ")
         for (i in words) words[i] = doToFirst("toUpperCase", words[i])
         output[key] = words.join(" ")
      }
   }

   console.log(output)
   fs.writeFile("data/translation-ru.json", JSON.stringify(output), ()=>{
      process.exit()
   })
}