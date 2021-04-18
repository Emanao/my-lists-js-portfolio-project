class ListsController < ApplicationController
    def index
        lists = List.all
        render json: lists, only: [:id, :name]
    end
    def create
        # Nested resource
        if(params[:id])
            # byebug
            list = List.find(params[:id])
            list.resources.build(address: params[:address])
            list.save
            render json: list, 
            :include=>{:resources=>{:except=>[:created_at, :updated_at]}},
            :except=>[:created_at, :updated_at]

        else
            new_list = List.create(list_params)
            render json: new_list, :except=>[:created_at, :updated_at]
        end
        
        
    end
    def list_params
        params.require(:list).permit(:id, :name)
      end
end
