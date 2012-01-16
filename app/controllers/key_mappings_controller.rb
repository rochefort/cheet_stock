class KeyMappingsController < ApplicationController
  before_filter :find_key_mapping, :only => [:show, :edit, :update, :destroy]

  def reorder
    # グループ間を移動する場合
    increment_id = get_increment_id(params[:keymapping], params[:group_id])
    logger.info { "xxxxxxxxxxxxxxxx" }
    logger.info { increment_id }
    logger.info { "" }
    logger.info { "" }
    if increment_id
      add_key_mapping = KeyMapping.find(increment_id)
      add_key_mapping.group_id = params[:group_id]
      add_key_mapping.save!
    end

    params[:keymapping].each_with_index{|row, i| KeyMapping.update(row, {ordinal: i + 1})}
    render :nothing => true
  end

  def index
    @group_id = params[:group_id]
    @key_mappings = KeyMapping.where(group_id: @group_id)
  end

  def show
  end

  def new
    @key_mapping = KeyMapping.new
    @group = Group.find(params[:group_id])
  end

  def edit
    @group = @key_mapping.group
  end

  def create
    group_id = params[:group_id]
    @key_mapping = KeyMapping.new(params[:key_mapping])
    @key_mapping.group_id = group_id

    @key_mapping.ordinal = KeyMapping.next_ordinal if request.xhr?
    
    status = @key_mapping.save
    if request.xhr?
      xhr_response_render_json(status) do
        html = render_to_string partial: 'shared/key_mapping', collection: [@key_mapping]
        {html: html}
      end
      return
    end
    if status
      redirect_to group_key_mapping_path(group_id, @key_mapping), notice: 'Key mapping was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    status =  @key_mapping.update_attributes(params[:key_mapping])
    xhr_response_render_json(status) and return if request.xhr?
    if status
      redirect_to [:group, @key_mapping], notice: 'Key mapping was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    status = @key_mapping.destroy
    # if last_item?
    #   status = @key_mapping.update_attributes({key: '', content: '', ordinal: 1})
    # else
    #   status = @key_mapping.destroy
    # end
    xhr_response_render_json(status) and return if request.xhr?
    redirect_to group_key_mappings_path
  end

  
  private
  def find_key_mapping
    @key_mapping = KeyMapping.find(params[:id])
  end

  def get_increment_id(key_mapping_ids, group_id)
    bef_keys = KeyMapping.where(group_id: group_id).map(&:id)
    aft_keys = key_mapping_ids.map(&:to_i)
    (aft_keys - bef_keys)[0]
  end

  # def last_item?(group_id)
  #   KeyMapping.where(group_id: group_id).size == 1
  # end
end
