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
unlisted.resources.create(address:"https://explore.simpli.com/history-photos-that-will-give-you-the-chills-copy-3/2?utm_subid=4437210&utm_adset=1155882&utm_source=facebook&utm_medium=referral&utm_campaign=785168&utm_referrer=dc-ref10&utm_template=infinite2&fbclid=IwAR2wSTOXSAOe2LG-K7roWWPptlwyXVWRSIZSCmLUoiHHBJFgbuaPSe6UCvc");

news = List.create(name:"News")
news.resources.create(address:"https://www.nytimes.com");
news.resources.create(address:"https://www.elmundo.es");
news.resources.create(address:"https://www.spiegel.de");

learning = List.create(name:"Learning")
learning.resources.create(address:"https://guides.rubyonrails.org");

recipes = List.create(name:"Recipes")
recipes.resources.create(address: "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes")

movies = List.create(name:"Movies")
