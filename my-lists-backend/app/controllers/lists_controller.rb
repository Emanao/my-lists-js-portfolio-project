class ListsController < ApplicationController
    def index
        if(params[:id])
            list = List.find(params[:id])
            # resources = list.resources
            render json: list, 
            :include=>{:resources=>{:except=>[:created_at, :updated_at]}},
            :except=>[:created_at, :updated_at]
        else
            lists = List.all
            render json: lists, only: [:id, :name]    
        end

    end
    def create
        new_list = List.create(list_params)
        render json: new_list, :except=>[:created_at, :updated_at]
    end

    def list_params
        params.require(:list).permit(:id, :name)
      end
end
