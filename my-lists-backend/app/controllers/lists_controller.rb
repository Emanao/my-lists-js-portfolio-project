class ListsController < ApplicationController
    def index
        lists = List.all
        render json: lists, only: [:id, :name]
    end
    def create

        if(!params[:id])

            new_list = List.create(list_params)
            render json: new_list

        else
            byebug
            list = List.find(params[:id])
            if !!list
                list.resources.build(address: params[:address])
                list.save
                render json: list
            else
            end
        end
        
        
    end
    def list_params
        params.require(:list).permit(:id, :name)
      end
end
