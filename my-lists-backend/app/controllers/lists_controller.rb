class ListsController < ApplicationController
    def index
        lists = List.all
        render json: list
    end
end
