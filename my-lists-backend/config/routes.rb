Rails.application.routes.draw do
#   resources :resources
#   resources :lists
get "lists", to: "lists#index"
get "lists/:id/resources", to: "resources#index"

post "lists", to: "lists#create"
post "lists/:id/resources", to: "resources#create"

delete "lists/:id", to: "lists#destroy"
delete "resources/:id", to: "resources#destroy"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
