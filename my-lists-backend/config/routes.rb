Rails.application.routes.draw do
#   resources :resources
#   resources :lists
get "lists", to: "lists#index"
post "lists", to: "lists#create"

post "lists/:id/resources", to: "lists#create"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
