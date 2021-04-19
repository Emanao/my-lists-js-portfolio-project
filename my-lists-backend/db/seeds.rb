# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Resource.delete_all
List.delete_all

ActiveRecord::Base.connection.reset_pk_sequence!("lists")

unlisted = List.create(name:"Unlisted");
unlisted.resources.create(address:"http://csslint.net");

jsProject = List.create(name:"JS Project");
jsProject.resources.create(address:"https://github.com/learn-co-curriculum/environment-mac-os-catalina-setup");
jsProject.resources.create(address:"https://help.learn.co/en/articles/492988-who-are-the-section-leads");
jsProject.resources.create(address:"https://app.diagrams.net/");
jsProject.resources.create(address:"https://github.com/learn-co-curriculum/js-spa-project-instructions/blob/master/project-planning-tips.md");
jsProject.resources.create(address:"https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0");



news = List.create(name:"News")
news.resources.create(address:"https://www.nytimes.com");
news.resources.create(address:"https://www.elmundo.es");
news.resources.create(address:"https://www.spiegel.de");

learning = List.create(name:"Learning")
learning.resources.create(address:"https://guides.rubyonrails.org");

recipes = List.create(name:"Recipes")
recipes.resources.create(address: "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes")

faq = List.create(name:"FAQ")
