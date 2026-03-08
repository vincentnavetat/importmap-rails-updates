# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

pin "react" # @19.2.4
pin "idiomorph", to: "https://ga.jspm.io/npm:idiomorph@0.4.0/dist/idiomorph.esm.js"
pin "swiper", to: "https://ga.jspm.io/npm:swiper@12.0.0/swiper.mjs"
