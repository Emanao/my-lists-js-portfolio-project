class ListsController < ApplicationController
    def index
        lists = List.all
        render json: lists, only: :name
    end
    def create
        new_list = List.create(list_params);
        render json: new_list
    end
    def list_params
        params.require(:list).permit(:name)
      end
end
