class KeyMappingsController < ApplicationController
  def index
    @group_id = params[:group_id]
    @key_mappings = KeyMapping.all
  end

  def show
    @key_mapping = KeyMapping.find(params[:id])
  end

  def new
    @key_mapping = KeyMapping.new
  end

  def edit
    @key_mapping = KeyMapping.find(params[:id])
  end

  def create
    group_id = params[:group_id]
    @key_mapping = KeyMapping.new(params[:key_mapping])

    if @key_mapping.save
      redirect_to group_key_mapping_path(group_id, @key_mapping), notice: 'Key mapping was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @key_mapping = KeyMapping.find(params[:id])

    if @key_mapping.update_attributes(params[:key_mapping])
      redirect_to [:group, @key_mapping], notice: 'Key mapping was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @key_mapping = KeyMapping.find(params[:id])
    @key_mapping.destroy

    redirect_to group_key_mappings_path
  end
end
