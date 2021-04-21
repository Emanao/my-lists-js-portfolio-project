class ListsController < ApplicationController
    def index
        lists = List.all
        render json: lists, only: [:id, :name]    
    end
    def create
        new_list = List.create(list_params)
        render json: new_list, :except=>[:created_at, :updated_at]
    end
    def list_params
        params.require(:list).permit(:id, :name)
      end
end
