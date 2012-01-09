class GroupsController < ApplicationController

  def reorder
    params[:group].each_with_index{|row, i| Group.update(row, {ordinal: i + 1})}
    render :nothing => true
  end

  def index
    @groups = Group.all
  end

  def show
    @group = Group.find(params[:id])
  end

  def new
    @group = Group.new
  end

  def edit
    @group = Group.find(params[:id])
  end

  def create
    @group = Group.new(params[:group])
    if request.xhr?
      @group.ordinal = Group.next_ordinal
      #@group.key_mappings.build({key: '', content: '', ordinal: 1})
    end
    
    status = @group.save
    if request.xhr?
      xhr_response_render_json(status) do
        html = render_to_string partial: 'sheets/group', locals: { group: @group }
        {html: html}
      end
      return
    end

    if status
      redirect_to @group, notice: 'Group was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @group = Group.find(params[:id])
    status = @group.update_attributes(params[:group])
    xhr_response_render_json(status) and return if request.xhr?

    if status
      redirect_to @group, notice: 'Group was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy    
    @group = Group.find(params[:id])
    status = @group.destroy
    xhr_response_render_json(status) and return if request.xhr?
    redirect_to groups_url
  end
end
