class ResourcesController < ApplicationController
    def index
        if(params[:id])
            list = List.find(params[:id])
            resources = list.resources
            render json: resources, 
            :include=>{:list=>{:except=>[:created_at, :updated_at]}},
            :except=>[:created_at, :updated_at]

        end
    end
    def create
        # Nested resource
        if(params[:id])
            # byebug
            list = List.find(params[:id])
            resource = list.resources.build(address: params[:address])
            list.save
            render json: resource, 
            :include=>{:list=>{:except=>[:created_at, :updated_at]}},
            :except=>[:created_at, :updated_at]
        end
        
        
    end
end
