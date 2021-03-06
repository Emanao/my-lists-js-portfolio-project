class ListsController < ApplicationController
    def index
        lists = List.all.order("created_at")
        render json: lists, only: [:id, :name]    
    end
    def create
        new_list = List.create(name: params[:name])
        render json: new_list, :except=>[:created_at, :updated_at]
    end
    def destroy
        list = List.find(params[:id])
        list.destroy
        render json: list, :except=>[:created_at, :updated_at]
    end
end
